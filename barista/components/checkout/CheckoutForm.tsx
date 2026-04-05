'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/common';
import {
  validateName,
  validateVietnamesePhone,
  validateAddress,
  validateDriverNote,
  validateCheckoutForm,
  type CheckoutFormData,
  type FormErrors,
} from '@/lib/checkout-validation';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData, formattedPhone: string) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CheckoutFormData>;
}

export default function CheckoutForm({ onSubmit, isLoading = false, initialData }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    driverNote: initialData?.driverNote || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [noteCharCount, setNoteCharCount] = useState(0);
  const [saveForNext, setSaveForNext] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update character count for driver note
    if (field === 'driverNote') {
      setNoteCharCount(value.length);
    }

    // Real-time validation on change (only if field was touched)
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field: string, value: string) => {
    let fieldError: string | undefined;

    switch (field) {
      case 'name':
        const nameVal = validateName(value);
        fieldError = nameVal.error;
        break;
      case 'phone':
        const phoneVal = validateVietnamesePhone(value);
        fieldError = phoneVal.error;
        break;
      case 'address':
        const addrVal = validateAddress(value);
        fieldError = addrVal.error;
        break;
      case 'driverNote':
        const noteVal = validateDriverNote(value);
        fieldError = noteVal.error;
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));
  };

  const handleFieldBlur = (field: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOnline) {
      return;
    }

    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true,
      address: true,
      driverNote: true,
    });

    // Validate entire form
    const validation = validateCheckoutForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // Get formatted phone
    const phoneVal = validateVietnamesePhone(formData.phone);
    const formattedPhone = phoneVal.formatted || formData.phone;

    // Save form data for next time if checkbox checked
    if (saveForNext) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90); // 90-day expiry

      const cacheData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        expiryDate: expiryDate.toISOString(),
      };

      try {
        localStorage.setItem('BARISTA_CHECKOUT_DATA', JSON.stringify(cacheData));
      } catch (err) {
        console.warn('Failed to save checkout data to localStorage:', err);
      }
    }

    // Call parent submit handler
    try {
      await onSubmit(formData, formattedPhone);
    } catch (err) {
      // Error handling is in parent component
      console.error('Form submission error:', err);
    }
  };

  const showFieldError = (field: string): string | undefined => {
    if (touched[field] && field in errors) {
      return errors[field as keyof FormErrors];
    }
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 px-4 py-3 rounded">
          <p className="text-yellow-800 font-medium">
            ⚠️ You're offline. Checkout requires an internet connection.
          </p>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Customer Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => handleFieldBlur('name')}
          placeholder="Enter your full name"
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] ${
            showFieldError('name')
              ? 'border-[#DC2626] focus:ring-[#DC2626]'
              : 'border-[#E8E3D9] focus:border-[#8B6F47] focus:ring-[#8B6F47]'
          }`}
          disabled={isLoading || !isOnline}
          aria-describedby={showFieldError('name') ? 'name-error' : undefined}
        />
        {showFieldError('name') && (
          <p id="name-error" className="text-[#DC2626] text-sm mt-1 font-medium">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          onBlur={() => handleFieldBlur('phone')}
          placeholder="0912345678 or +84912345678"
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] ${
            showFieldError('phone')
              ? 'border-[#DC2626] focus:ring-[#DC2626]'
              : 'border-[#E8E3D9] focus:border-[#8B6F47] focus:ring-[#8B6F47]'
          }`}
          disabled={isLoading || !isOnline}
          aria-describedby={showFieldError('phone') ? 'phone-error' : undefined}
        />
        {showFieldError('phone') && (
          <p id="phone-error" className="text-[#DC2626] text-sm mt-1 font-medium">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Address Field */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Delivery Address *
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          onBlur={() => handleFieldBlur('address')}
          placeholder="Enter your full delivery address (minimum 10 characters)"
          maxLength={500}
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none focus:resize-none min-h-[96px] ${
            showFieldError('address')
              ? 'border-[#DC2626] focus:ring-[#DC2626]'
              : 'border-[#E8E3D9] focus:border-[#8B6F47] focus:ring-[#8B6F47]'
          }`}
          disabled={isLoading || !isOnline}
          aria-describedby={showFieldError('address') ? 'address-error' : undefined}
        />
        <div className="flex justify-between items-start mt-1">
          {showFieldError('address') && (
            <p id="address-error" className="text-[#DC2626] text-sm font-medium">
              {errors.address}
            </p>
          )}
          <p className="text-xs text-[#8E8680] ml-auto">{formData.address.length}/500</p>
        </div>
      </div>

      {/* Driver Note Field */}
      <div>
        <label htmlFor="driverNote" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          id="driverNote"
          value={formData.driverNote}
          onChange={(e) => handleFieldChange('driverNote', e.target.value)}
          onBlur={() => handleFieldBlur('driverNote')}
          placeholder="e.g., 'Leave at reception' or 'Call on arrival' or use emojis: 🛵, 🏢, 🏪"
          maxLength={500}
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none focus:resize-none min-h-[96px] ${
            showFieldError('driverNote')
              ? 'border-[#DC2626] focus:ring-[#DC2626]'
              : 'border-[#E8E3D9] focus:border-[#8B6F47] focus:ring-[#8B6F47]'
          }`}
          disabled={isLoading || !isOnline}
          aria-describedby={showFieldError('driverNote') ? 'driverNote-error' : undefined}
        />
        <div className="flex justify-between items-start mt-1">
          {showFieldError('driverNote') && (
            <p id="driverNote-error" className="text-[#DC2626] text-sm font-medium">
              {errors.driverNote}
            </p>
          )}
          <p className="text-xs text-[#8E8680] ml-auto">{noteCharCount}/500</p>
        </div>
      </div>

      {/* Save for Next Time */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="saveForNext"
          checked={saveForNext}
          onChange={(e) => setSaveForNext(e.target.checked)}
          disabled={isLoading || !isOnline}
          className="w-5 h-5 cursor-pointer"
        />
        <label htmlFor="saveForNext" className="text-sm text-[#8E8680] cursor-pointer">
          Save for next time
        </label>
      </div>

      {/* Submit Button */}
      <Button
        variant="primary"
        size="lg"
        type="submit"
        disabled={isLoading || !isOnline}
        className="w-full min-h-[48px] text-base font-semibold"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing your order...
          </span>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
