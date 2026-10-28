import React from 'react';
import { MapPin, Phone, MessageCircle, Lock, Shield, Star } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 text-charcoal-400 text-xs pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800/80">
          
          {/* Brand & Reputation */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-lg tracking-wide">
                {BUSINESS_INFO.name}
              </span>
            </div>
            
            <p className="text-charcoal-400 text-xs leading-relaxed max-w-md font-light">
              Premier real estate consultancy specializing in luxury builder floors, residences, and commercial assets across Sushant Lok 2, Sector 57, Golf Course Extension Road, and prestigious micro-markets in Gurugram.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-800 text-champagne-400">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-champagne-400 text-champagne-400" />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-charcoal-200">
                5.0 Google Rating • 374 Client Reviews
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-sm tracking-wide">
              Portfolio & Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-champagne-400 transition-colors">Home</a></li>
              <li><a href="#properties" className="hover:text-champagne-400 transition-colors">Curated Properties</a></li>
              <li><a href="#services" className="hover:text-champagne-400 transition-colors">Our Advisory Services</a></li>
              <li><a href="#why-choose-us" className="hover:text-champagne-400 transition-colors">Why Guruji Property</a></li>
              <li><a href="#about" className="hover:text-champagne-400 transition-colors">Leadership & Office</a></li>
              <li><a href="#testimonials" className="hover:text-champagne-400 transition-colors">Client Testimonials</a></li>
              <li><a href="#contact" className="hover:text-champagne-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Office & Direct Hotline */}
          <div className="space-y-3">
            <h4 className="text-white font-serif font-semibold text-sm tracking-wide">
              Office Location
            </h4>
            <p className="leading-relaxed text-charcoal-300 text-xs">
              {BUSINESS_INFO.address.full}
            </p>
            <div className="pt-1 space-y-1.5">
              <p className="text-charcoal-200">
                Hotline: <a href={`tel:${BUSINESS_INFO.phone}`} className="text-champagne-400 font-bold hover:underline">{BUSINESS_INFO.phoneDisplay}</a>
              </p>
              <p className="text-[11px] text-charcoal-400">
                Hours: {BUSINESS_INFO.hours}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Discreet Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-500">
          <div>
            © {new Date().getFullYear()} Guruji Property Gurugram. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#contact" className="hover:text-charcoal-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#contact" className="hover:text-charcoal-300 transition-colors">Legal Disclaimer</a>
            <span>•</span>
            <a 
              href="#/admin/login" 
              className="text-charcoal-500 hover:text-champagne-400 flex items-center gap-1 transition-colors"
              title="Admin Portal Login"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
