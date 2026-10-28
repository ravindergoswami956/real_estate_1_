import React from 'react';
import { Star, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Authentic Portrait in Luxury Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Subtle Champagne Accent Halo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-champagne-300/30 to-sand-300/30 rounded-3xl blur-xl opacity-75"></div>

              <div className="relative rounded-2xl overflow-hidden border border-sand-300 bg-ivory-50 shadow-luxury">
                <img
                  src="/founder.png"
                  alt="Principal Consultant - Guruji Property Gurugram"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />

                <div className="p-5 bg-white border-t border-sand-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-charcoal-900 text-sm">
                        Guruji Property Leadership
                      </h4>
                      <p className="text-xs text-champagne-700 font-medium mt-0.5">
                        Principal Real Estate Consultant
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-charcoal-900 bg-ivory-200 border border-sand-300 px-3 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-current text-champagne-600" />
                      <span>5.0 (374 Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-7 space-y-6 text-charcoal-700 text-sm leading-relaxed font-light">
            <div>
              <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest block mb-2">
                About The Firm
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
                Deep Gurugram Roots. <br />
                <span className="italic font-light text-champagne-700">Uncompromising Ethics.</span>
              </h2>
            </div>

            <p>
              Operating from our established consulting office at <strong className="text-charcoal-900 font-semibold">{BUSINESS_INFO.address.full}</strong>, 
              <strong> Guruji Property</strong> represents buyers, sellers, landlords, and investors with fiduciary rigor.
            </p>

            <p>
              Gurugram’s real estate landscape requires street-level precision. From independent builder floors in Sushant Lok 2 and Sector 57 to trophy penthouses on Golf Course Road and Grade-A commercial floors in Cyber City, we provide our clients with accurate pricing data, clean legal vetting, and discreet representation.
            </p>

            {/* Micro Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-ivory-50 border border-sand-200 space-y-1">
                <div className="flex items-center gap-2 font-serif font-semibold text-charcoal-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physical Office at MKM Market</span>
                </div>
                <p className="text-xs text-charcoal-600 font-light">
                  Always accessible 7 days a week for in-person consultations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-sand-200 space-y-1">
                <div className="flex items-center gap-2 font-serif font-semibold text-charcoal-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine Inventory</span>
                </div>
                <p className="text-xs text-charcoal-600 font-light">
                  Direct owner and builder alignments without deceptive intermediaries.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="px-6 py-3 rounded-lg bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3 rounded-lg border border-sand-300 hover:border-charcoal-900 bg-white text-charcoal-900 font-semibold text-xs uppercase tracking-wider transition-all"
              >
                Get Directions to Office
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
