import { CreateCustomerInput, AddressFormData } from '../types/customer';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - at least 7 digits
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function validateCustomerInput(
  input: CreateCustomerInput
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.firstName || input.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!input.lastName || input.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!input.email || input.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(input.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (input.phone && !validatePhone(input.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  return errors;
}

export function validateAddressInput(
  input: AddressFormData
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.address1 || input.address1.trim().length === 0) {
    errors.push({ field: 'address1', message: 'Address is required' });
  }

  if (!input.city || input.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!input.country || input.country.trim().length === 0) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!input.countryCode || input.countryCode.trim().length === 0) {
    errors.push({ field: 'countryCode', message: 'Country code is required' });
  }

  if (input.phone && !validatePhone(input.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  return errors;
}
