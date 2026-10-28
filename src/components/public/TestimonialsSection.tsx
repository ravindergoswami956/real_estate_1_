import React from 'react';
import { Star, CheckCircle, Quote, ExternalLink } from 'lucide-react';
import { GENUINE_TESTIMONIALS } from '../../data/testimonials';
import { BUSINESS_INFO } from '../../data/business';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Rating Highlight */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-50 border border-champagne-300 mb-4 shadow-sm">
            <div className="flex items-center gap-0.5 text-champagne-600">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-champagne-500 text-champagne-500" />
              ))}
            </div>
            <span className="text-xs font-bold text-charcoal-900 tracking-wide">
              {BUSINESS_INFO.rating} Rating on Google Reviews
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
            Client Trust & Genuine Experiences
          </h2>
          <p className="text-sm text-charcoal-700/80 mt-3 font-light max-w-xl mx-auto">
            Transparent real-estate consulting backed by {BUSINESS_INFO.totalReviews} verified homeowner and investor reviews across Gurugram.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GENUINE_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-8 rounded-2xl bg-ivory-50 border border-sand-200 shadow-luxury flex flex-col justify-between relative group hover:border-champagne-400 hover:shadow-luxury-hover transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-champagne-300 absolute top-6 right-6 opacity-40 group-hover:opacity-70 transition-opacity" />

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-champagne-500 text-champagne-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed font-light italic mb-6">
                  "{testimonial.review}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-5 border-t border-sand-200 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-charcoal-900 text-sm">
                    {testimonial.author}
                  </h4>
                  <p className="text-[11px] text-champagne-700 font-medium">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-charcoal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-charcoal-800">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-champagne-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-champagne-400 text-champagne-400" />
              ))}
              <span className="font-bold text-white text-sm ml-2">5.0 / 5.0 Star Track Record</span>
            </div>
            <p className="text-xs text-charcoal-300 max-w-lg">
              Read all {BUSINESS_INFO.totalReviews} customer experiences on Google Maps or visit our office at SHOP-54, MKM Market, Sector 57, Gurugram.
            </p>
          </div>

          <a
            href={BUSINESS_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-champagne-500 hover:bg-champagne-400 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-sm"
          >
            <span>View All Google Reviews</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
