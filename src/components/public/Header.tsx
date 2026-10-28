import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Lock, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

interface HeaderProps {
  onOpenSiteVisit: () => void;
  onOpenEnquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSiteVisit, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Properties', href: '#properties' },
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/95 backdrop-blur-md border-b border-sand-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-charcoal-900 border border-champagne-500/40 flex items-center justify-center text-champagne-400 font-serif font-black text-xl shadow-sm transition-transform group-hover:scale-105">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 tracking-wider uppercase">
                Guruji Property
              </span>
              <span className="text-[10px] font-semibold text-champagne-700 tracking-widest uppercase">
                Gurugram • Sector 57 • ★ 5.0
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-charcoal-700 hover:text-champagne-700 transition-colors uppercase tracking-widest"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenEnquiry}
              className="px-3.5 py-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-850 text-champagne-300 hover:text-champagne-200 border border-champagne-500/40 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              Enquire
            </button>

            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="px-3.5 py-2 rounded-lg bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Guruji Property Gurugram! I would like to enquire about properties.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Clear Admin Option */}
            <a
              href="/admin/login"
              className="px-3 py-2 rounded-lg border border-sand-300 hover:border-champagne-500 bg-white hover:bg-ivory-50 text-charcoal-800 hover:text-champagne-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
              title="Admin Portal Login"
            >
              <Lock className="w-3.5 h-3.5 text-champagne-700" />
              <span>Admin</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="/admin/login"
              className="p-2 rounded-lg border border-sand-300 bg-white text-charcoal-800"
              title="Admin Login"
            >
              <Lock className="w-4 h-4 text-champagne-700" />
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="p-2 rounded-lg bg-champagne-500 text-charcoal-950 font-bold"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-sand-300 text-charcoal-800 hover:bg-ivory-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-ivory-100 border-t border-sand-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase font-bold text-charcoal-800 hover:text-champagne-600 tracking-wider py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-sand-300 space-y-2.5">
            {/* Mobile Admin Button */}
            <a
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-white border border-champagne-500/50 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-champagne-700" />
              <span>Admin Portal Access</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-2.5 rounded-lg bg-charcoal-900 text-champagne-300 font-bold text-xs uppercase tracking-wider"
            >
              Enquire Now
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSiteVisit();
              }}
              className="w-full py-2.5 rounded-lg border border-champagne-600 text-champagne-700 font-bold text-xs uppercase tracking-wider"
            >
              Schedule a Visit
            </button>

            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="w-full py-2.5 rounded-lg bg-champagne-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              Call {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
