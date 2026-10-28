import React from 'react';
import { ShieldCheck, Award, MapPin, Scale, Star, CheckCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <MapPin className="w-6 h-6 text-champagne-600" />,
      title: 'Sector 57 Native Authority',
      desc: 'Headquartered at MKM Market, Sushant Lok 2, Sector 57. We possess comprehensive street-by-street command over builder floors, plots, and luxury high-rises.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-champagne-600" />,
      title: '100% Legal Due Diligence',
      desc: 'Every property represented undergoes complete verification: mutation records, approved TCP plans, encumbrance checks, and RERA registration.'
    },
    {
      icon: <Scale className="w-6 h-6 text-champagne-600" />,
      title: 'Fiduciary Client Representation',
      desc: 'We advocate strictly for our clients at the negotiation table, securing fair valuations for buyers and optimal exits for sellers without hidden margins.'
    },
    {
      icon: <Award className="w-6 h-6 text-champagne-600" />,
      title: '5.0★ Verified Track Record',
      desc: 'Consistently rated 5.0 out of 5 across 374 genuine client Google reviews. Trust and transparent dealings remain our core benchmark.'
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest block mb-2">
            The Guruji Difference
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
            Why Choose Guruji Property
          </h2>
          <p className="text-sm text-charcoal-700/80 mt-3 font-light leading-relaxed">
            Personalized advisory built upon local integrity, rigorous legal auditing, and unwavering client advocacy.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-ivory-50 border border-sand-200/80 shadow-sm hover:shadow-luxury hover:border-champagne-400 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-ivory-200 border border-champagne-500/30 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-serif font-semibold text-charcoal-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-700/80 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand-200 text-[11px] text-champagne-700 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
