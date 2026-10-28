import React from 'react';
import { ArrowDown, Phone, MessageCircle, Star, ShieldCheck, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

interface HeroProps {
  onExploreClick: () => void;
  onOpenSiteVisit: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenSiteVisit }) => {
  return (
    <section id="home" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-charcoal-950">
      
      {/* Full-width Luxury Architectural Photograph */}
      <img
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
        alt="Exceptional Luxury Real Estate in Gurugram"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Subtle Sophisticated Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/65 to-charcoal-950/40"></div>
      <div className="absolute inset-0 bg-charcoal-950/30 backdrop-blur-[1px]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        
        {/* Subtle Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-900/80 border border-champagne-500/35 text-champagne-300 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current text-champagne-400" />
          <span>Rated 5.0 (374 Reviews)</span>
          <span className="text-charcoal-600">•</span>
          <span className="text-sand-100">Sector 57, Gurugram</span>
        </div>

        {/* Required Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-white tracking-tight leading-[1.12] mb-6">
          Exceptional Properties. <br className="hidden sm:inline" />
          <span className="italic font-light text-champagne-300">Extraordinary Living.</span>
        </h1>

        {/* Required Subtitle */}
        <p className="text-base sm:text-xl text-sand-100/90 max-w-2xl mx-auto font-light leading-relaxed mb-10 tracking-wide">
          Discover premium homes, commercial spaces, and investment opportunities in Gurugram with Guruji Property.
        </p>

        {/* Required Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-champagne-500/20"
          >
            Explore Properties
          </button>

          <button
            onClick={onOpenSiteVisit}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-charcoal-900/80 hover:bg-charcoal-850 text-white border border-champagne-500/40 font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer backdrop-blur-md"
          >
            Schedule a Visit
          </button>
        </div>

        {/* Discreet Micro-Footer Stats */}
        <div className="pt-16 mt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
          <div>
            <span className="block font-serif text-2xl font-bold text-white">Sector 57</span>
            <span className="text-[11px] text-sand-200 uppercase tracking-wider">MKM Market Office</span>
          </div>
          <div>
            <span className="block font-serif text-2xl font-bold text-champagne-400">100%</span>
            <span className="text-[11px] text-sand-200 uppercase tracking-wider">Title Verified</span>
          </div>
          <div>
            <span className="block font-serif text-2xl font-bold text-white">5.0 ★</span>
            <span className="text-[11px] text-sand-200 uppercase tracking-wider">374 Google Reviews</span>
          </div>
          <div>
            <span className="block font-serif text-2xl font-bold text-champagne-400">084471 95227</span>
            <span className="text-[11px] text-sand-200 uppercase tracking-wider">Direct Consultation</span>
          </div>
        </div>

      </div>

      {/* Gentle Scroll Prompt */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-sand-200/70">
          <ArrowDown className="w-3.5 h-3.5 text-champagne-400 animate-bounce" />
        </div>
      </div>

    </section>
  );
};
