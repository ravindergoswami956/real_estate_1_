import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../services/database';
import { Property, PropertyCategory } from '../../types/property';
import { Header } from '../../components/public/Header';
import { Hero } from '../../components/public/Hero';
import { PropertyList } from '../../components/public/PropertyList';
import { WhyChooseUs } from '../../components/public/WhyChooseUs';
import { Services } from '../../components/public/Services';
import { About } from '../../components/public/About';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { Contact } from '../../components/public/Contact';
import { Footer } from '../../components/public/Footer';
import { SiteVisitModal } from '../../components/public/SiteVisitModal';
import { PropertyDetailModal } from '../../components/public/PropertyDetailModal';
import { Phone, MessageCircle, Calendar, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | PropertyCategory>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [siteVisitProperty, setSiteVisitProperty] = useState<Property | null>(null);

  const loadProperties = async () => {
    try {
      const data = await DatabaseService.getPublicProperties();
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
    }
  };

  useEffect(() => {
    loadProperties();
    const handleDbChange = () => loadProperties();
    window.addEventListener('guruji_db_change', handleDbChange);
    return () => window.removeEventListener('guruji_db_change', handleDbChange);
  }, []);

  const handleOpenSiteVisit = (prop?: Property) => {
    setSiteVisitProperty(prop || null);
    setIsSiteVisitOpen(true);
  };

  const handleExploreClick = () => {
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 flex flex-col font-sans selection:bg-champagne-500 selection:text-charcoal-950 pb-16 sm:pb-0">
      
      {/* 1. Refined Navigation Bar */}
      <Header 
        onOpenSiteVisit={() => handleOpenSiteVisit()} 
        onOpenEnquiry={() => handleOpenSiteVisit()} 
      />

      {/* 2. Stunning Luxury Hero Section */}
      <Hero
        onExploreClick={handleExploreClick}
        onOpenSiteVisit={() => handleOpenSiteVisit()}
      />

      {/* 3. Curated Property Listings with Buy, Rent, and Commercial Filters */}
      <PropertyList
        properties={properties}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSelectProperty={(p) => setSelectedProperty(p)}
        onRequestVisit={(p) => handleOpenSiteVisit(p)}
      />

      {/* 4. Why Choose Guruji Property Section */}
      <WhyChooseUs />

      {/* 5. Our Core Services */}
      <Services onSelectService={() => handleOpenSiteVisit()} />

      {/* 6. About Us & Leadership */}
      <About />

      {/* 7. Client Testimonials (Genuine 5.0 Google Reviews) */}
      <TestimonialsSection />

      {/* 8. Office Location & Contact Section */}
      <Contact />

      {/* 9. Luxury Brand Footer */}
      <Footer />

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal-950/95 backdrop-blur-md border-t border-charcoal-800 p-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href={`tel:${BUSINESS_INFO.phone}`}
          className="flex-1 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 text-champagne-400" />
          <span>Call Office</span>
        </a>
        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Guruji Property Gurugram! I would like to consult about properties.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={() => handleOpenSiteVisit()}
          className="px-3.5 py-2.5 rounded-lg bg-champagne-500 text-charcoal-950 font-bold text-xs whitespace-nowrap flex items-center gap-1"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Visit</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 text-champagne-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          title="Admin Portal"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onRequestSiteVisit={(p) => handleOpenSiteVisit(p)}
      />

      <SiteVisitModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        selectedProperty={siteVisitProperty}
        properties={properties}
      />

    </div>
  );
};
