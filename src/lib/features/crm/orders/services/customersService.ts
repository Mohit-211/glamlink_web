/**
 * Customers Service
 *
 * Service layer for managing customers in Firestore subcollections.
 * Schema: brands/{brandId}/customers/{customerId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';

import type { Customer, Address} from '../types';

/**
 * Customers Service Class
 */
export class CustomersService {
  /**
   * Get all customers for a brand
   */
  static async getCustomers(
    db: Firestore,
    brandId: string,
    searchQuery?: string
  ): Promise<Customer[]> {
    const customersRef = collection(db, `brands/${brandId}/customers`);
    const q = query(customersRef, orderBy('name', 'asc'));

    const snapshot = await getDocs(q);
    let customers = snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Customer;
    });

    // Apply client-side search filtering
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          (customer.phone && customer.phone.includes(searchQuery))
      );
    }

    return customers;
  }

  /**
   * Get a single customer by ID
   */
  static async getCustomerById(
    db: Firestore,
    brandId: string,
    customerId: string
  ): Promise<Customer | null> {
    const customerRef = doc(db, `brands/${brandId}/customers`, customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return null;
    }

    const data = customerSnap.data();
    return {
      ...data,
      id: customerSnap.id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Customer;
  }

  /**
   * Get a customer by email
   */
  static async getCustomerByEmail(
    db: Firestore,
    brandId: string,
    email: string
  ): Promise<Customer | null> {
    const customersRef = collection(db, `brands/${brandId}/customers`);
    const q = query(customersRef, where('email', '==', email), limit(1));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();
    return {
      ...data,
      id: snapshot.docs[0].id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Customer;
  }

  /**
   * Create a new customer
   */
  static async createCustomer(
    db: Firestore,
    brandId: string,
    customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent'>
  ): Promise<Customer> {
    const customersRef = collection(db, `brands/${brandId}/customers`);
    const now = new Date().toISOString();

    const customer: Omit<Customer, 'id'> = {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      createdAt: now,
      updatedAt: now,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: undefined,
      tags: customerData.tags || [],
      notes: customerData.notes,
      defaultShippingAddress: customerData.defaultShippingAddress,
      defaultBillingAddress: customerData.defaultBillingAddress,
    };

    // Create customer document with auto-generated ID
    const newCustomerRef = doc(customersRef);
    await setDoc(newCustomerRef, customer);

    return {
      ...customer,
      id: newCustomerRef.id,
    };
  }

  /**
   * Update an existing customer
   */
  static async updateCustomer(
    db: Firestore,
    brandId: string,
    customerId: string,
    updates: Partial<Omit<Customer, 'id' | 'createdAt'>>
  ): Promise<void> {
    const customerRef = doc(db, `brands/${brandId}/customers`, customerId);

    await updateDoc(customerRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete a customer (use with caution)
   */
  static async deleteCustomer(db: Firestore, brandId: string, customerId: string): Promise<void> {
    const customerRef = doc(db, `brands/${brandId}/customers`, customerId);
    await deleteDoc(customerRef);
  }

  /**
   * Update customer order statistics
   * Call this when an order is placed, fulfilled, or refunded
   */
  static async updateCustomerStats(
    db: Firestore,
    brandId: string,
    customerId: string,
    orderTotal: number,
    orderDate: string,
    increment: boolean = true
  ): Promise<void> {
    const customerRef = doc(db, `brands/${brandId}/customers`, customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return;
    }

    const customer = customerSnap.data() as Customer;

    await updateDoc(customerRef, {
      totalOrders: increment ? customer.totalOrders + 1 : Math.max(0, customer.totalOrders - 1),
      totalSpent: increment ? customer.totalSpent + orderTotal : customer.totalSpent - orderTotal,
      lastOrderDate: orderDate,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Find or create a customer
   * Useful for order creation flow
   */
  static async findOrCreateCustomer(
    db: Firestore,
    brandId: string,
    customerData: {
      id?: string;
      name: string;
      email: string;
      phone?: string;
      defaultShippingAddress?: Address;
      defaultBillingAddress?: Address;
    }
  ): Promise<Customer> {
    // If customer ID is provided, fetch it
    if (customerData.id) {
      const existing = await this.getCustomerById(db, brandId, customerData.id);
      if (existing) {
        return existing;
      }
    }

    // Try to find by email
    const existingByEmail = await this.getCustomerByEmail(db, brandId, customerData.email);
    if (existingByEmail) {
      return existingByEmail;
    }

    // Create new customer
    return await this.createCustomer(db, brandId, {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      tags: [],
      notes: undefined,
      defaultShippingAddress: customerData.defaultShippingAddress,
      defaultBillingAddress: customerData.defaultBillingAddress,
    });
  }

  /**
   * Get recent customers (last 10)
   */
  static async getRecentCustomers(db: Firestore, brandId: string): Promise<Customer[]> {
    const customersRef = collection(db, `brands/${brandId}/customers`);
    const q = query(customersRef, orderBy('createdAt', 'desc'), limit(10));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Customer;
    });
  }

  /**
   * Get top customers by total spent
   */
  static async getTopCustomers(
    db: Firestore,
    brandId: string,
    limitCount: number = 10
  ): Promise<Customer[]> {
    const customersRef = collection(db, `brands/${brandId}/customers`);
    const q = query(customersRef, orderBy('totalSpent', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data();
      return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Customer;
    });
  }
}

export default CustomersService;
