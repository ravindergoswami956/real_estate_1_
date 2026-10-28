import React, { useState } from 'react';
import { Property, PropertyCategory } from '../../types/property';
import { Search, MapPin, Bed, Bath, Maximize2, ArrowRight, Calendar, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

interface PropertyListProps {
  properties: Property[];
  activeCategory: 'all' | PropertyCategory;
  onSelectCategory: (cat: 'all' | PropertyCategory) => void;
  onSelectProperty: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  activeCategory,
  onSelectCategory,
  onSelectProperty,
  onRequestVisit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');

  const sectors = [
    'All Sectors',
    'Sector 57',
    'Sushant Lok 2',
    'Golf Course Road',
    'Golf Course Extension Road',
    'Dwarka Expressway',
    'Cyber City',
    'Southern Peripheral Road'
  ];

  const filtered = properties.filter((p) => {
    // Only published Available properties
    if (p.listingStatus !== 'Available') return false;

    // Category filter
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }

    // Sector filter
    if (selectedSector !== 'All Sectors') {
      const matchSector = 
        p.sector.toLowerCase().includes(selectedSector.toLowerCase()) || 
        p.location.toLowerCase().includes(selectedSector.toLowerCase());
      if (!matchSector) return false;
    }

    // Keyword search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const match = 
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.propertyType.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);
      if (!match) return false;
    }

    return true;
  });

  return (
    <section id="properties" className="py-24 bg-ivory-50 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-champagne-700 uppercase tracking-widest block mb-2">
              Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-tight">
              Featured Properties in Gurugram
            </h2>
            <p className="text-sm text-charcoal-700/80 mt-2 font-light">
              Refined builder floors, luxury residences, and commercial real estate managed through our Sector 57 office.
            </p>
          </div>

          {/* Clean Buy / Rent / Commercial Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-ivory-200/80 border border-sand-200 self-start lg:self-auto">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-charcoal-900 text-champagne-300 shadow-sm font-bold'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              All Listings ({properties.filter(p => p.listingStatus === 'Available').length})
            </button>
            <button
              onClick={() => onSelectCategory('buy')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === 'buy'
                  ? 'bg-charcoal-900 text-champagne-300 shadow-sm font-bold'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => onSelectCategory('rent')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === 'rent'
                  ? 'bg-charcoal-900 text-champagne-300 shadow-sm font-bold'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => onSelectCategory('commercial')}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeCategory === 'commercial'
                  ? 'bg-charcoal-900 text-champagne-300 shadow-sm font-bold'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Clean Search & Sector Refinement Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 p-4 rounded-xl bg-white border border-sand-200 shadow-sm">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-charcoal-600 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, location, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-sand-200 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-sand-200 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Properties Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="py-20 px-8 text-center rounded-2xl bg-white border border-sand-200 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-ivory-200 text-champagne-700 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-charcoal-900 font-semibold">
              No Published Properties Matching Criteria
            </h3>
            <p className="text-xs text-charcoal-700/80 leading-relaxed">
              We manage exclusive off-market residences and commercial mandates that are not listed online. Contact Guruji Property at <strong className="text-charcoal-900">084471 95227</strong> for live private inventory.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setSearchTerm('');
                  setSelectedSector('All Sectors');
                }}
                className="px-5 py-2.5 rounded-lg bg-charcoal-900 text-champagne-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-850 cursor-pointer transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((property) => {
              const waLink = `https://wa.me/${property.contactWhatsApp || BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
                `Hello Guruji Property! I am interested in exploring "${property.title}" (Ref: ${property.id}, Price: ${property.price}). Please share more details.`
              )}`;

              return (
                <div
                  key={property.id}
                  className="group rounded-2xl bg-white border border-sand-200 overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Large Photograph */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-900">
                      <img
                        src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'}
                        alt={property.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* Status & Type Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-charcoal-900/90 text-champagne-300 backdrop-blur-sm border border-champagne-500/30">
                          {property.propertyType}
                        </span>
                        {property.isFeatured && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-champagne-500 text-charcoal-950 shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-4 left-4 bg-charcoal-950/85 backdrop-blur-sm px-3.5 py-1.5 rounded-lg text-white border border-white/10">
                        <span className="text-base sm:text-lg font-serif font-bold text-champagne-300">
                          {property.price}
                        </span>
                      </div>
                    </div>

                    {/* Property Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 text-xs text-champagne-700 font-semibold mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <h3
                        onClick={() => onSelectProperty(property)}
                        className="text-lg font-serif text-charcoal-900 group-hover:text-champagne-700 transition-colors cursor-pointer line-clamp-1 font-semibold"
                      >
                        {property.title}
                      </h3>

                      <p className="text-xs text-charcoal-700/80 mt-2 line-clamp-2 leading-relaxed font-light">
                        {property.description}
                      </p>

                      {/* Key Details Row */}
                      <div className="mt-5 pt-4 border-t border-sand-100 flex items-center justify-between text-xs text-charcoal-700 font-medium">
                        {property.bedrooms !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-champagne-600" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.bathrooms !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-champagne-600" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Maximize2 className="w-4 h-4 text-champagne-600" />
                          <span>{property.area.toLocaleString()} sq.ft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="p-6 pt-0 border-t border-sand-100 mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 py-2.5 px-3 rounded-lg border border-sand-300 hover:border-charcoal-900 hover:bg-charcoal-900 hover:text-white text-charcoal-800 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onRequestVisit(property)}
                      className="py-2.5 px-3 rounded-lg bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Visit</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-sand-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
