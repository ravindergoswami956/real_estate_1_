import React from 'react';
import { Home, Building2, Crown, Key, MapPin, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const services = [
    {
      title: 'Residential Buying & Selling',
      desc: 'Guiding families and investors in acquiring premier builder floors, gated community apartments, and luxury villas across Sushant Lok 2, Sector 57, and Golf Course Road.',
      icon: <Home className="w-5 h-5 text-champagne-600" />
    },
    {
      title: 'Luxury Estates & Penthouses',
      desc: 'Confidential mandate representation for high-net-worth clients seeking signature duplexes, penthouses, and private villas in Gurugram’s prime developments.',
      icon: <Crown className="w-5 h-5 text-champagne-600" />
    },
    {
      title: 'Commercial Properties & SCO',
      desc: 'Strategic acquisition of Grade-A office floors, pre-leased corporate assets, and Shop-Cum-Office (SCO) plots with dependable rental yields (7% - 9%).',
      icon: <Building2 className="w-5 h-5 text-champagne-600" />
    },
    {
      title: 'Land & Freehold Plots',
      desc: 'Transparent facilitation of freehold residential plots and collaboration opportunities with complete zoning checks, mutation audits, and demarcation.',
      icon: <MapPin className="w-5 h-5 text-champagne-600" />
    },
    {
      title: 'Rental & Corporate Relocation',
      desc: 'Seamless lease advisory connecting corporate executives, multinational employees, and families with vetted turnkey residences.',
      icon: <Key className="w-5 h-5 text-champagne-600" />
    }
  ];

  return (
    <section id="services" className="py-24 bg-ivory-100 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest block mb-2">
            Professional Practice
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
            Our Services
          </h2>
          <p className="text-sm text-charcoal-700/80 mt-3 font-light leading-relaxed">
            Boutique real estate advisory tailored to buyers, sellers, landlords, and institutional investors in Gurugram.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white border border-sand-200/80 shadow-luxury hover:border-champagne-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-ivory-200 border border-champagne-500/30 flex items-center justify-center mb-6">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-serif font-semibold text-charcoal-900 mb-3">
                  {svc.title}
                </h3>
                <p className="text-xs text-charcoal-700/80 leading-relaxed font-light">
                  {svc.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-sand-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectService(svc.title)}
                  className="text-xs font-bold text-champagne-700 hover:text-champagne-800 flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                >
                  <span>Enquire for this service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
