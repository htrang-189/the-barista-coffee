/**
 * Checkout form validation utilities with strict Vietnamese phone validation
 */

import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  driverNote?: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  driverNote: string;
}

/**
 * Validate Vietnamese phone number strictly
 * Accepts: 10 digits starting with 0 (0912345678) OR +84 format (+84912345678)
 * Rejects all other formats
 */
export const validateVietnamesePhone = (phone: string): { isValid: boolean; formatted?: string; error?: string } => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();

  // Check strict format: must be 10 digits starting with 0 OR +84 format
  const pattern10Digits = /^0[0-9]{9}$/; // 0912345678
  const patternPlus84 = /^\+84[1-9][0-9]{8}$/; // +84912345678

  if (pattern10Digits.test(trimmedPhone)) {
    // Valid 10-digit format starting with 0
    return { isValid: true, formatted: trimmedPhone };
  }

  if (patternPlus84.test(trimmedPhone)) {
    // Valid +84 format
    return { isValid: true, formatted: trimmedPhone };
  }

  // Try to parse with libphonenumber-js as fallback
  try {
    const parsed = parsePhoneNumber(trimmedPhone, 'VN');
    if (parsed && isValidPhoneNumber(trimmedPhone, 'VN')) {
      // Verify it's Vietnamese format (starts with 0 or country code 84)
      const nationalNumber = parsed.nationalNumber?.toString() || '';
      if (nationalNumber.startsWith('0') || trimmedPhone.startsWith('+84')) {
        return { isValid: true, formatted: trimmedPhone };
      }
    }
  } catch (err) {
    // Fall through to error message
  }

  return {
    isValid: false,
    error: 'Phone must be a valid Vietnamese number (10 digits starting with 0 or +84 format)',
  };
};

/**
 * Validate customer name
 * Required, 2-100 characters, alphanumeric + spaces + hyphens + Vietnamese accents
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Name must not exceed 100 characters' };
  }

  // Allow alphanumeric, spaces, hyphens, and Vietnamese accents
  const namePattern = /^[a-zA-Z0-9\s\-àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+$/i;

  if (!namePattern.test(trimmedName)) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }

  return { isValid: true };
};

/**
 * Validate delivery address
 * Required, 10-500 characters
 */
export const validateAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Delivery address is required' };
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.length < 10) {
    return { isValid: false, error: 'Address must be at least 10 characters' };
  }

  if (trimmedAddress.length > 500) {
    return { isValid: false, error: 'Address must not exceed 500 characters' };
  }

  return { isValid: true };
};

/**
 * Validate driver note
 * Optional, max 500 characters
 * Supports emoji, accents, special characters
 */
export const validateDriverNote = (note: string): { isValid: boolean; error?: string; charCount?: number } => {
  if (!note || note.trim() === '') {
    return { isValid: true, charCount: 0 };
  }

  const trimmedNote = note.trim();
  const charCount = trimmedNote.length;

  if (charCount > 500) {
    return { isValid: false, error: 'Driver note must not exceed 500 characters', charCount };
  }

  return { isValid: true, charCount };
};

/**
 * Validate entire checkout form
 */
export const validateCheckoutForm = (form: CheckoutFormData): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  // Validate name
  const nameValidation = validateName(form.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  // Validate phone
  const phoneValidation = validateVietnamesePhone(form.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  // Validate address
  const addressValidation = validateAddress(form.address);
  if (!addressValidation.isValid) {
    errors.address = addressValidation.error;
  }

  // Validate driver note (optional)
  const noteValidation = validateDriverNote(form.driverNote);
  if (!noteValidation.isValid) {
    errors.driverNote = noteValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
