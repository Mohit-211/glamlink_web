import {
  doc,
  getDoc,
  updateDoc,
  Firestore,
  runTransaction
} from 'firebase/firestore';
import {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerAddress,
  AddressFormData,
  CustomerNote
} from '../types/customer';
import { generateId } from '@/lib/utils/ids';

// ============================================
// HELPER FUNCTIONS
// ============================================

function createCustomerFromInput(
  brandId: string,
  input: CreateCustomerInput
): Customer {
  const now = new Date().toISOString();
  const customerId = generateId('cust');

  const addresses: CustomerAddress[] = [];

  if (input.address) {
    const addressId = generateId('addr');
    addresses.push({
      id: addressId,
      type: 'default',
      isDefault: true,
      firstName: input.address.firstName || input.firstName,
      lastName: input.address.lastName || input.lastName,
      company: input.address.company,
      phone: input.address.phone,
      phoneCountryCode: input.address.phoneCountryCode,
      address1: input.address.address1,
      address2: input.address.address2,
      city: input.address.city,
      state: input.address.state,
      postalCode: input.address.postalCode,
      country: input.address.country,
      countryCode: input.address.countryCode,
      createdAt: now,
      updatedAt: now,
    });
  }

  return {
    id: customerId,
    brandId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase().trim(),
    phone: input.phone,
    phoneCountryCode: input.phoneCountryCode || 'US',
    language: input.language || 'en',
    addresses,
    defaultAddressId: addresses[0]?.id,
    marketing: {
      emailSubscribed: input.emailMarketingConsent || false,
      emailSubscribedAt: input.emailMarketingConsent ? now : undefined,
      smsSubscribed: input.smsMarketingConsent || false,
      smsSubscribedAt: input.smsMarketingConsent ? now : undefined,
      emailConsentSource: 'manual',
      smsConsentSource: 'manual',
    },
    taxSettings: {
      collectionSetting: input.taxCollectionSetting || 'collect_tax',
    },
    tags: input.tags || [],
    notes: input.notes ? [{
      id: generateId('note'),
      content: input.notes,
      createdAt: now,
      createdBy: 'system',
    }] : [],
    analytics: {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      location: addresses[0] ? {
        city: addresses[0].city,
        state: addresses[0].state,
        country: addresses[0].country,
        countryCode: addresses[0].countryCode,
      } : undefined,
    },
    status: 'active',
    source: 'manual',
    createdAt: now,
    updatedAt: now,
  };
}

function applyCustomerUpdates(
  customer: Customer,
  updates: UpdateCustomerInput
): Customer {
  const now = new Date().toISOString();

  const updated: Customer = {
    ...customer,
    updatedAt: now,
  };

  if (updates.firstName !== undefined) {
    updated.firstName = updates.firstName;
  }
  if (updates.lastName !== undefined) {
    updated.lastName = updates.lastName;
  }
  if (updates.email !== undefined) {
    updated.email = updates.email.toLowerCase().trim();
  }
  if (updates.phone !== undefined) {
    updated.phone = updates.phone;
  }
  if (updates.phoneCountryCode !== undefined) {
    updated.phoneCountryCode = updates.phoneCountryCode;
  }
  if (updates.language !== undefined) {
    updated.language = updates.language;
  }
  if (updates.tags !== undefined) {
    updated.tags = updates.tags;
  }
  if (updates.status !== undefined) {
    updated.status = updates.status;
  }

  // Handle marketing preference changes
  if (updates.emailMarketingConsent !== undefined) {
    if (updates.emailMarketingConsent && !customer.marketing.emailSubscribed) {
      updated.marketing = {
        ...updated.marketing,
        emailSubscribed: true,
        emailSubscribedAt: now,
      };
    } else if (!updates.emailMarketingConsent && customer.marketing.emailSubscribed) {
      updated.marketing = {
        ...updated.marketing,
        emailSubscribed: false,
        emailUnsubscribedAt: now,
      };
    }
  }

  if (updates.smsMarketingConsent !== undefined) {
    if (updates.smsMarketingConsent && !customer.marketing.smsSubscribed) {
      updated.marketing = {
        ...updated.marketing,
        smsSubscribed: true,
        smsSubscribedAt: now,
      };
    } else if (!updates.smsMarketingConsent && customer.marketing.smsSubscribed) {
      updated.marketing = {
        ...updated.marketing,
        smsSubscribed: false,
        smsUnsubscribedAt: now,
      };
    }
  }

  if (updates.taxCollectionSetting !== undefined) {
    updated.taxSettings = {
      ...updated.taxSettings,
      collectionSetting: updates.taxCollectionSetting,
    };
  }

  return updated;
}

// ============================================
// CRUD OPERATIONS
// ============================================

export async function getCustomers(
  db: Firestore,
  brandId: string
): Promise<Customer[]> {
  const brandRef = doc(db, 'brands', brandId);
  const brandSnap = await getDoc(brandRef);

  if (!brandSnap.exists()) {
    // Return empty array if brand doesn't exist yet
    return [];
  }

  const data = brandSnap.data();
  return (data.customers || []) as Customer[];
}

export async function getCustomerById(
  db: Firestore,
  brandId: string,
  customerId: string
): Promise<Customer | null> {
  const customers = await getCustomers(db, brandId);
  return customers.find(c => c.id === customerId) || null;
}

export async function getCustomerByEmail(
  db: Firestore,
  brandId: string,
  email: string
): Promise<Customer | null> {
  const customers = await getCustomers(db, brandId);
  const normalizedEmail = email.toLowerCase().trim();
  return customers.find(c => c.email === normalizedEmail) || null;
}

export async function createCustomer(
  db: Firestore,
  brandId: string,
  input: CreateCustomerInput
): Promise<Customer> {
  // Check for duplicate email
  const existing = await getCustomerByEmail(db, brandId, input.email);
  if (existing) {
    throw new Error('A customer with this email already exists');
  }

  const customer = createCustomerFromInput(brandId, input);

  const brandRef = doc(db, 'brands', brandId);

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    transaction.update(brandRef, {
      customers: [...customers, customer],
    });
  });

  // Update customer tags if new tags were added
  if (input.tags && input.tags.length > 0) {
    await updateCustomerTags(db, brandId, input.tags);
  }

  return customer;
}

export async function updateCustomer(
  db: Firestore,
  brandId: string,
  customerId: string,
  updates: UpdateCustomerInput
): Promise<Customer> {
  const brandRef = doc(db, 'brands', brandId);

  return await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    // Check email uniqueness if email is being updated
    if (updates.email) {
      const normalizedEmail = updates.email.toLowerCase().trim();
      const emailExists = customers.some(
        (c, i) => i !== customerIndex && c.email === normalizedEmail
      );
      if (emailExists) {
        throw new Error('A customer with this email already exists');
      }
    }

    const updatedCustomer = applyCustomerUpdates(customers[customerIndex], updates);

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });

    return updatedCustomer;
  });
}

export async function deleteCustomer(
  db: Firestore,
  brandId: string,
  customerId: string
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const updatedCustomers = customers.filter(c => c.id !== customerId);

    transaction.update(brandRef, { customers: updatedCustomers });
  });
}

// ============================================
// ADDRESS OPERATIONS
// ============================================

export async function addCustomerAddress(
  db: Firestore,
  brandId: string,
  customerId: string,
  address: AddressFormData,
  setAsDefault: boolean = false
): Promise<CustomerAddress> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();
  const addressId = generateId('addr');

  return await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];

    const newAddress: CustomerAddress = {
      id: addressId,
      type: setAsDefault || customer.addresses.length === 0 ? 'default' : 'shipping',
      isDefault: setAsDefault || customer.addresses.length === 0,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      phone: address.phone,
      phoneCountryCode: address.phoneCountryCode,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      countryCode: address.countryCode,
      createdAt: now,
      updatedAt: now,
    };

    // If setting as default, unset previous default
    let updatedAddresses = customer.addresses.map(addr => ({
      ...addr,
      isDefault: setAsDefault ? false : addr.isDefault,
      type: setAsDefault && addr.isDefault ? 'shipping' as const : addr.type,
    }));

    updatedAddresses.push(newAddress);

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
      defaultAddressId: newAddress.isDefault ? newAddress.id : customer.defaultAddressId,
      analytics: {
        ...customer.analytics,
        location: newAddress.isDefault ? {
          city: newAddress.city,
          state: newAddress.state,
          country: newAddress.country,
          countryCode: newAddress.countryCode,
        } : customer.analytics.location,
      },
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });

    return newAddress;
  });
}

export async function updateCustomerAddress(
  db: Firestore,
  brandId: string,
  customerId: string,
  addressId: string,
  updates: Partial<AddressFormData>
): Promise<CustomerAddress> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();

  return await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const addressIndex = customer.addresses.findIndex(a => a.id === addressId);

    if (addressIndex === -1) {
      throw new Error('Address not found');
    }

    const existingAddress = customer.addresses[addressIndex];
    const updatedAddress: CustomerAddress = {
      ...existingAddress,
      ...updates,
      updatedAt: now,
    };

    const updatedAddresses = [...customer.addresses];
    updatedAddresses[addressIndex] = updatedAddress;

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
      analytics: existingAddress.isDefault ? {
        ...customer.analytics,
        location: {
          city: updatedAddress.city,
          state: updatedAddress.state,
          country: updatedAddress.country,
          countryCode: updatedAddress.countryCode,
        },
      } : customer.analytics,
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });

    return updatedAddress;
  });
}

export async function deleteCustomerAddress(
  db: Firestore,
  brandId: string,
  customerId: string,
  addressId: string
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const addressToDelete = customer.addresses.find(a => a.id === addressId);

    if (!addressToDelete) {
      throw new Error('Address not found');
    }

    const updatedAddresses = customer.addresses.filter(a => a.id !== addressId);

    // If deleting default address, set first remaining as default
    let newDefaultId = customer.defaultAddressId;
    if (addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0] = {
        ...updatedAddresses[0],
        isDefault: true,
        type: 'default',
      };
      newDefaultId = updatedAddresses[0].id;
    } else if (updatedAddresses.length === 0) {
      newDefaultId = undefined;
    }

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
      defaultAddressId: newDefaultId,
      analytics: {
        ...customer.analytics,
        location: updatedAddresses.length > 0 && updatedAddresses[0].isDefault ? {
          city: updatedAddresses[0].city,
          state: updatedAddresses[0].state,
          country: updatedAddresses[0].country,
          countryCode: updatedAddresses[0].countryCode,
        } : undefined,
      },
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });
  });
}

export async function setDefaultAddress(
  db: Firestore,
  brandId: string,
  customerId: string,
  addressId: string
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const addressExists = customer.addresses.some(a => a.id === addressId);

    if (!addressExists) {
      throw new Error('Address not found');
    }

    const updatedAddresses = customer.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
      type: addr.id === addressId ? 'default' as const :
            (addr.type === 'default' ? 'shipping' as const : addr.type),
      updatedAt: addr.id === addressId ? now : addr.updatedAt,
    }));

    const newDefaultAddress = updatedAddresses.find(a => a.id === addressId)!;

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
      defaultAddressId: addressId,
      analytics: {
        ...customer.analytics,
        location: {
          city: newDefaultAddress.city,
          state: newDefaultAddress.state,
          country: newDefaultAddress.country,
          countryCode: newDefaultAddress.countryCode,
        },
      },
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });
  });
}

// ============================================
// TAG OPERATIONS
// ============================================

export async function updateCustomerTags(
  db: Firestore,
  brandId: string,
  newTags: string[]
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const existingTags: string[] = data.customerTags || [];

    const uniqueTags = [...new Set([...existingTags, ...newTags])];

    transaction.update(brandRef, { customerTags: uniqueTags });
  });
}

export async function getCustomerTags(
  db: Firestore,
  brandId: string
): Promise<string[]> {
  const brandRef = doc(db, 'brands', brandId);
  const brandSnap = await getDoc(brandRef);

  if (!brandSnap.exists()) {
    throw new Error('Brand not found');
  }

  const data = brandSnap.data();
  return (data.customerTags || []) as string[];
}

// ============================================
// NOTE OPERATIONS
// ============================================

export async function addCustomerNote(
  db: Firestore,
  brandId: string,
  customerId: string,
  content: string,
  createdBy: string
): Promise<CustomerNote> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();
  const noteId = generateId('note');

  const newNote: CustomerNote = {
    id: noteId,
    content,
    createdAt: now,
    createdBy,
  };

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const updatedCustomer: Customer = {
      ...customer,
      notes: [...customer.notes, newNote],
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });
  });

  return newNote;
}

export async function deleteCustomerNote(
  db: Firestore,
  brandId: string,
  customerId: string,
  noteId: string
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const updatedCustomer: Customer = {
      ...customer,
      notes: customer.notes.filter(n => n.id !== noteId),
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });
  });
}

// ============================================
// TAX SETTINGS OPERATIONS
// ============================================

export async function updateCustomerTaxSettings(
  db: Firestore,
  brandId: string,
  customerId: string,
  taxSettings: Partial<Customer['taxSettings']>
): Promise<void> {
  const brandRef = doc(db, 'brands', brandId);
  const now = new Date().toISOString();

  await runTransaction(db, async (transaction) => {
    const brandSnap = await transaction.get(brandRef);

    if (!brandSnap.exists()) {
      throw new Error('Brand not found');
    }

    const data = brandSnap.data();
    const customers: Customer[] = data.customers || [];

    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const customer = customers[customerIndex];
    const updatedCustomer: Customer = {
      ...customer,
      taxSettings: {
        ...customer.taxSettings,
        ...taxSettings,
      },
      updatedAt: now,
    };

    const updatedCustomers = [...customers];
    updatedCustomers[customerIndex] = updatedCustomer;

    transaction.update(brandRef, { customers: updatedCustomers });
  });
}
