import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Star, Code2 } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';
import ravinderPhoto from '../../assets/ravinder-goswami.png';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    if (window.location.hash.includes('/admin')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal-950 text-charcoal-400 text-xs pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-charcoal-800/80">
          
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
              <li>
                <button type="button" onClick={() => scrollTo('home')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('properties')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Curated Properties
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('services')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Our Advisory Services
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('why-choose-us')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Why Guruji Property
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('about')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Leadership & Office
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('testimonials')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Client Testimonials
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('contact')} className="hover:text-champagne-400 transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
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

        {/* Developer Credit Section: Developed by Ravinder Goswami */}
        <div className="py-6 border-b border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 bg-charcoal-900/90 border border-charcoal-800 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="relative">
              <img 
                src={ravinderPhoto} 
                alt="Ravinder Goswami" 
                className="w-11 h-11 rounded-full object-cover border-2 border-champagne-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-charcoal-900 rounded-full" title="Active Developer"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-charcoal-400 font-medium">Developed by</span>
                <span className="text-xs font-bold text-champagne-400 font-serif">Ravinder Goswami</span>
              </div>
              <p className="text-[10px] text-charcoal-400">Full-Stack Real Estate Web Solutions</p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-charcoal-400">
            <p className="text-charcoal-300 font-medium">Crafted with luxury precision for Guruji Property Gurugram</p>
            <p className="text-champagne-500/80 text-[10px]">High Performance • Instant Cloud Sync • Secure Portal</p>
          </div>
        </div>

        {/* Bottom copyright & Working Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-500">
          <div>
            © {new Date().getFullYear()} Guruji Property Gurugram. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={() => scrollTo('contact')} className="hover:text-charcoal-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" onClick={() => scrollTo('contact')} className="hover:text-charcoal-300 transition-colors cursor-pointer">
              Legal Disclaimer
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => navigate('/admin/login')}
              className="text-champagne-500 hover:text-champagne-400 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-md bg-charcoal-900 border border-charcoal-800"
              title="Admin Portal Login"
            >
              <Lock className="w-3 h-3 text-champagne-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
