import React, { useState, useEffect } from 'react';
import { Property } from '../../types/property';
import { X, Calendar, Clock, CheckCircle2, Users, AlertCircle, Phone } from 'lucide-react';
import { DatabaseService } from '../../services/database';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  properties: Property[];
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  properties
}) => {
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM (Morning)');
  const [numberOfVisitors, setNumberOfVisitors] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedProperty) {
      setPropertyTitle(selectedProperty.title);
      setPropertyId(selectedProperty.id);
    } else if (properties.length > 0) {
      setPropertyTitle(properties[0].title);
      setPropertyId(properties[0].id);
    } else {
      setPropertyTitle('General Property Consultation in Sector 57');
      setPropertyId(undefined);
    }
    setErrorMessage(null);
    setSubmitted(false);
  }, [selectedProperty, properties, isOpen]);

  if (!isOpen) return null;

  // Phone validation helper (accepts standard 10-digit Indian numbers or with +91/0)
  const isValidPhone = (input: string) => {
    const cleaned = input.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    if (!isValidPhone(phone.trim())) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 098112 34567 or 9811234567).');
      return;
    }

    if (!preferredDate) {
      setErrorMessage('Please select your preferred visit date.');
      return;
    }

    if (!preferredTime) {
      setErrorMessage('Please choose your preferred time slot.');
      return;
    }

    setIsSubmitting(true);

    try {
      await DatabaseService.submitSiteVisit({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        propertyId: propertyId || undefined,
        propertyTitle: propertyTitle,
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        numberOfVisitors: numberOfVisitors ? Number(numberOfVisitors) : undefined,
        notes: message.trim() || undefined
      });

      setSubmitted(true);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Site visit submission error:', err);
      setErrorMessage(
        err?.message || 'Failed to submit site visit request. Please check your connection or call 084471 95227 directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif font-bold text-slate-900 text-2xl">
              Site Visit Request Submitted
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-slate-800">{customerName}</strong>! Your request to inspect{' '}
              <span className="font-semibold text-slate-800">"{propertyTitle}"</span> on{' '}
              <span className="font-semibold text-slate-800">{preferredDate} ({preferredTime})</span> has been saved directly to our database.
            </p>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
              <p className="font-bold">Next Steps:</p>
              <p className="text-[11px] text-amber-800">
                Your request is currently marked as <strong className="underline">Pending</strong> in our system. Our property advisor will call you at <strong className="text-slate-900">{phone}</strong> to confirm the appointment and provide exact gate directions.
              </p>
            </div>

            <div className="pt-3 flex gap-3 justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Guruji Property Gurugram</span>
            </div>

            <h3 className="font-serif font-bold text-slate-900 text-xl mb-1">
              Request a Property Visit
            </h3>

            <p className="text-xs text-slate-500 mb-5">
              Select your preferred date and time to schedule an escorted private inspection.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Property Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Property of Interest
                </label>
                <select
                  value={propertyTitle}
                  onChange={(e) => {
                    setPropertyTitle(e.target.value);
                    const matched = properties.find(p => p.title === e.target.value);
                    if (matched) setPropertyId(matched.id);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600 bg-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.title}>
                      {p.title} — {p.price} ({p.location})
                    </option>
                  ))}
                  <option value="General Property Consultation in Sector 57">
                    General Property Consultation in Sector 57
                  </option>
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikas Gupta"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 098112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Email & Number of Visitors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. vikas@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Number of Visitors <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    placeholder="e.g. 2"
                    value={numberOfVisitors}
                    onChange={(e) => setNumberOfVisitors(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Visit Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Time Slot <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600 bg-white"
                  >
                    <option value="10:00 AM - 01:00 PM (Morning)">10:00 AM - 01:00 PM (Morning)</option>
                    <option value="01:00 PM - 04:00 PM (Afternoon)">01:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 07:00 PM (Evening)">04:00 PM - 07:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Additional Message <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Interested in upper floor, coming with family..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-600 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving to Supabase Database...
                    </span>
                  ) : (
                    <span>Submit Site Visit Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
