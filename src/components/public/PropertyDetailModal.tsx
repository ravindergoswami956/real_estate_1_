import React, { useState } from 'react';
import { Property } from '../../types/property';
import { X, MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Calendar, Send, CheckCircle2 } from 'lucide-react';
import { DatabaseService } from '../../services/database';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onRequestSiteVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onRequestSiteVisit
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setActiveImageIndex(0);
    setSubmitted(false);
  }, [property]);

  if (!property) return null;

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DatabaseService.submitEnquiry({
        customerName: customerName.trim(),
        phone: phone.trim(),
        propertyId: property.id,
        propertyTitle: property.title,
        message: message.trim() || `Interested in ${property.title}`
      });
      setSubmitted(true);
      setCustomerName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      alert('Failed to send enquiry. Please contact 084471 95227 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${property.contactWhatsApp || '918447195227'}?text=${encodeURIComponent(
    `Hello Guruji Property! I am interested in "${property.title}" (Ref: ${property.id}, Price: ${property.price}). Please share more details.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-md border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Gallery */}
        <div className="relative aspect-[16/9] max-h-96 w-full bg-slate-900 overflow-hidden">
          <img
            src={property.images[activeImageIndex] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              property.listingStatus === 'Available'
                ? 'bg-emerald-600 text-white'
                : property.listingStatus === 'Sold'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-700 text-white'
            }`}>
              {property.listingStatus}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-white">
              {property.propertyType}
            </span>
          </div>

          {/* Thumbnails if multiple images */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto py-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${
                    activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-1">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{property.location}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                {property.title}
              </h2>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">Price / Rent</span>
              <span className="text-2xl font-bold font-serif text-amber-700">
                {property.price}
              </span>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Total Area</span>
              <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                {property.area.toLocaleString()} sq.ft
              </span>
            </div>
            {property.bedrooms !== undefined && (
              <div>
                <span className="text-[11px] text-slate-500 block">Bedrooms</span>
                <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  {property.bedrooms} BHK
                </span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div>
                <span className="text-[11px] text-slate-500 block">Bathrooms</span>
                <span className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  {property.bathrooms} Baths
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-sm mb-2">Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm mb-2">Features & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-700"
                  >
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="tel:08447195227"
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call 084471 95227</span>
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onRequestSiteVisit(property);
              }}
              className="flex-1 min-w-[140px] py-3 rounded-lg border border-amber-600 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Book Site Visit
            </button>
          </div>

          {/* Quick In-Modal Enquiry */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-serif font-bold text-slate-900 text-xs">
              Quick Enquiry for this Property
            </h4>

            {submitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enquiry received. Our consultant will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
