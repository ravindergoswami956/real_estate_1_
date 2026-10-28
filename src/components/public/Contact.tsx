import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Send, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { DatabaseService } from '../../services/database';
import { BUSINESS_INFO } from '../../data/business';

export const Contact: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = customerName.trim();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DatabaseService.submitEnquiry({
        customerName: cleanName,
        phone: phone.trim(),
        email: email.trim() || undefined,
        budget: budget.trim() || undefined,
        message: message.trim() || undefined
      });
      setSubmitted(true);
      setCustomerName('');
      setPhone('');
      setEmail('');
      setBudget('');
      setMessage('');
    } catch (err) {
      setErrorMessage('Failed to send enquiry to database. Please call us directly at 084471 95227.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-ivory-50 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest block mb-2">
            Sector 57 Consulting Office
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
            Connect With Our Advisors
          </h2>
          <p className="text-sm text-charcoal-700/80 mt-3 font-light">
            Visit our office in MKM Market or leave your requirements below. Direct advisory without intermediary markups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Business Details & Location Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 bg-champagne-50 px-2.5 py-1 rounded-md border border-champagne-200 inline-block mb-2">
                  Registered Consultant
                </span>
                <h3 className="font-serif font-bold text-charcoal-900 text-xl">
                  {BUSINESS_INFO.name}
                </h3>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Residential & Commercial Property Advisory • Gurugram
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-sand-100">
                <div className="flex items-start gap-3.5 text-xs text-charcoal-700">
                  <div className="p-2 rounded-lg bg-ivory-100 text-champagne-700 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold mb-0.5">Office Address:</strong>
                    <span className="leading-relaxed text-charcoal-600">{BUSINESS_INFO.address.full}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-charcoal-700">
                  <div className="p-2 rounded-lg bg-ivory-100 text-champagne-700 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold mb-0.5">Telephone & Call:</strong>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-champagne-700 font-bold hover:underline text-sm block">
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                    <span className="text-[11px] text-charcoal-400">Available Monday – Sunday ({BUSINESS_INFO.hours})</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-charcoal-700">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold mb-0.5">Direct WhatsApp Helpline:</strong>
                    <a
                      href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Guruji Property Gurugram! I would like to consult regarding properties in Gurugram.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline text-sm block"
                    >
                      +91 84471 95227
                    </a>
                    <span className="text-[11px] text-charcoal-400">Instant layout brochures & video walk-throughs</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-charcoal-700">
                  <div className="p-2 rounded-lg bg-ivory-100 text-champagne-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold mb-0.5">Office Timings:</strong>
                    <span className="text-charcoal-600">{BUSINESS_INFO.hours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-sand-300 hover:border-charcoal-900 hover:bg-charcoal-900 hover:text-white text-charcoal-800 text-xs font-semibold text-center transition-all cursor-pointer shadow-sm"
                >
                  Get Directions on Google Maps
                </a>
              </div>
            </div>

            {/* Embedded Location Map */}
            <div className="rounded-2xl overflow-hidden border border-sand-200 h-64 bg-sand-100 shadow-luxury">
              <iframe
                title="Guruji Property Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14035.79240898565!2d77.06734!3d28.42084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d226a27e78d91%3A0xb35e80fa9c90ec15!2sSector%2057%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-sand-200 shadow-luxury">
              <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                Property Request Form
              </span>
              <h3 className="font-serif font-bold text-charcoal-900 text-2xl mb-1">
                Share Your Property Requirements
              </h3>
              <p className="text-xs text-charcoal-600 font-light mb-8">
                Whether you wish to purchase a luxury floor, sell your asset, lease commercial space, or invest in high-yield Gurugram corridors.
              </p>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-6">
                  {errorMessage}
                </div>
              )}

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-charcoal-900 text-lg">Enquiry Recorded in System</h4>
                  <p className="text-xs text-charcoal-700 max-w-md mx-auto leading-relaxed">
                    Thank you, your enquiry has been saved into our records. Our principal consultant will call you at your preferred time.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-charcoal-900 text-champagne-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-800 transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikramaditya Rao"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 098112 34567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. vikram@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                        Target Budget / Price Range
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹ 2.50 Cr – 4.00 Cr or ₹ 65,000 / mo"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Property Requirements & Locations of Interest
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Looking for a park-facing 4 BHK luxury builder floor in Sushant Lok 2 or Sector 57 with 2 car parks..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-charcoal-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-champagne-600 shrink-0" />
                    <span>Your details are kept strictly confidential. We never spam or distribute client data.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Saving Enquiry to Database...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Property Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
