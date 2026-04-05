import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhoneNumber = (input: string, countryCode: string = 'VN') => {
  try {
    const cleaned = input.replace(/[\s\-\(\)]/g, '');

    if (!isValidPhoneNumber(cleaned, countryCode as any)) {
      return {
        isValid: false,
        formatted: cleaned,
        error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)',
      };
    }

    const phoneNumber = parsePhoneNumber(cleaned, countryCode as any);
    return {
      isValid: true,
      formatted: phoneNumber?.formatInternational() || cleaned,
    };
  } catch (error) {
    return {
      isValid: false,
      formatted: input,
      error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)',
    };
  }
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateName = (name: string) => {
  return name.length >= 2 && name.length <= 100;
};

export const validateAddress = (address: string) => {
  return address.length >= 10 && address.length <= 500;
};

export const validateCustomerName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.length > 100) {
    return { isValid: false, error: 'Name must be less than 100 characters' };
  }
  return { isValid: true };
};

export const validateDeliveryAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'Address is required' };
  }
  if (address.length < 10) {
    return { isValid: false, error: 'Address must be at least 10 characters' };
  }
  if (address.length > 500) {
    return { isValid: false, error: 'Address must be less than 500 characters' };
  }
  return { isValid: true };
};
