export type PropertyType = 'Residential' | 'Commercial' | 'Land' | 'Rental';

export type ListingStatus = 'Available' | 'Sold' | 'Rented' | 'Unavailable';

export type PropertyCategory = 'buy' | 'rent' | 'commercial';

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  category: PropertyCategory;
  listingStatus: ListingStatus;
  location: string;
  sector: string;
  price: string;
  priceNumeric: number;
  area: number; // in sq ft
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  amenities: string[];
  images: string[];
  isFeatured: boolean;
  contactPhone?: string;
  contactWhatsApp?: string;
  createdAt: string;
  updatedAt?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  budget?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export type SiteVisitStatus = 'Pending' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface SiteVisitRequest {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  preferredDate: string;
  preferredTime: string;
  numberOfVisitors?: number;
  notes?: string;
  status: SiteVisitStatus;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  googleMapsUrl: string;
}
