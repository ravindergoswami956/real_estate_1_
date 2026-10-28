import { supabase, isSupabaseConfigured } from './supabase';
import { 
  Property, 
  CustomerEnquiry, 
  SiteVisitRequest, 
  BusinessSettings, 
  ListingStatus, 
  EnquiryStatus, 
  SiteVisitStatus 
} from '../types/property';

const STORAGE_KEYS = {
  PROPERTIES: 'guruji_properties_v2',
  ENQUIRIES: 'guruji_customer_enquiries_v2',
  SITE_VISITS: 'guruji_site_visits_v2',
  SETTINGS: 'guruji_business_settings_v2'
};

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Guruji Property Gurugram',
  phone: '084471 95227',
  whatsapp: '918447195227',
  address: 'SHOP-54, MKM Market Road, Block G, Sushant Lok 2, Sector 57, Gurugram, Haryana 122011',
  hours: 'Monday – Sunday: 9:30 AM – 8:30 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Guruji+Property+SHOP-54+MKM+Market+Road+Block+G+Sushant+Lok+2+Sector+57+Gurugram+Haryana+122011'
};

const INITIAL_PROPERTIES: Property[] = [];

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('guruji_db_change'));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export const DatabaseService = {
  isUsingCloudDatabase(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  // PROPERTIES
  async getPublicProperties(): Promise<Property[]> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('properties')
          .select('*')
          .eq('listingStatus', 'Available')
          .order('isFeatured', { ascending: false })
          .order('createdAt', { ascending: false });
        if (!error && data) return data as Property[];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local database:', err);
      }
    }
    const all = getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    return all.filter(p => p.listingStatus === 'Available');
  },

  async getAllProperties(): Promise<Property[]> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('properties')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data) return data as Property[];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local database:', err);
      }
    }
    return getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  },

  async addProperty(property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('properties')
          .insert([newProperty])
          .select()
          .single();
        if (!error && data) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return data as Property;
        } else if (error) {
          console.error('Supabase add error:', error);
          throw error;
        }
      } catch (err) {
        console.warn('Supabase add failed, saving locally:', err);
        throw err;
      }
    }

    const current = getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const updated = [newProperty, ...current];
    setLocal(STORAGE_KEYS.PROPERTIES, updated);
    return newProperty;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const updatedAt = new Date().toISOString();

    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('properties')
          .update({ ...updates, updatedAt })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return data as Property;
        }
      } catch (err) {
        console.warn('Supabase update failed, updating locally:', err);
      }
    }

    const current = getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const index = current.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedProp = { ...current[index], ...updates, updatedAt };
    current[index] = updatedProp;
    setLocal(STORAGE_KEYS.PROPERTIES, [...current]);
    return updatedProp;
  },

  async deleteProperty(id: string): Promise<boolean> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { error } = await supabase!
          .from('properties')
          .delete()
          .eq('id', id);
        if (!error) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return true;
        }
      } catch (err) {
        console.warn('Supabase delete failed, deleting locally:', err);
      }
    }

    const current = getLocal<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    const filtered = current.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PROPERTIES, filtered);
    return true;
  },

  async updatePropertyStatus(id: string, status: ListingStatus): Promise<boolean> {
    const res = await this.updateProperty(id, { listingStatus: status });
    return res !== null;
  },

  // ENQUIRIES
  async submitEnquiry(enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<CustomerEnquiry> {
    const newEnquiry: CustomerEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };

    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('enquiries')
          .insert([newEnquiry])
          .select()
          .single();
        if (!error && data) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return data as CustomerEnquiry;
        } else if (error) {
          console.error('Supabase enquiry submit error:', error);
          throw error;
        }
      } catch (err) {
        console.error('Supabase enquiry submit failed:', err);
        throw err;
      }
    }

    const current = getLocal<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    setLocal(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...current]);
    return newEnquiry;
  },

  async getEnquiries(): Promise<CustomerEnquiry[]> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('enquiries')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data) return data as CustomerEnquiry[];
      } catch (err) {
        console.warn('Supabase get enquiries failed, returning local:', err);
      }
    }
    return getLocal<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<boolean> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { error } = await supabase!
          .from('enquiries')
          .update({ status })
          .eq('id', id);
        if (!error) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return true;
        }
      } catch (err) {
        console.warn('Supabase update enquiry failed, updating locally:', err);
      }
    }

    const current = getLocal<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const idx = current.findIndex(e => e.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      setLocal(STORAGE_KEYS.ENQUIRIES, [...current]);
      return true;
    }
    return false;
  },

  // SITE VISITS
  async submitSiteVisit(request: Omit<SiteVisitRequest, 'id' | 'createdAt' | 'status'>): Promise<SiteVisitRequest> {
    const newRequest: SiteVisitRequest = {
      ...request,
      id: `visit-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (this.isUsingCloudDatabase()) {
      try {
        let formattedNotes = newRequest.notes || '';
        if (newRequest.numberOfVisitors && !formattedNotes.includes('Visitors:')) {
          formattedNotes = `[Visitors: ${newRequest.numberOfVisitors}] ${formattedNotes}`.trim();
        }

        const payload = {
          id: newRequest.id,
          customerName: newRequest.customerName,
          phone: newRequest.phone,
          email: newRequest.email || null,
          propertyId: newRequest.propertyId || null,
          propertyTitle: newRequest.propertyTitle || null,
          preferredDate: newRequest.preferredDate,
          preferredTime: newRequest.preferredTime,
          notes: formattedNotes || null,
          status: newRequest.status
        };

        const { data, error } = await supabase!
          .from('site_visits')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return {
            ...newRequest,
            ...data
          };
        } else if (error) {
          console.error('Supabase visit submit error:', error);
          throw error;
        }
      } catch (err) {
        console.error('Supabase site visit submit failed:', err);
        throw err;
      }
    }

    const current = getLocal<SiteVisitRequest[]>(STORAGE_KEYS.SITE_VISITS, []);
    setLocal(STORAGE_KEYS.SITE_VISITS, [newRequest, ...current]);
    return newRequest;
  },

  async getSiteVisits(): Promise<SiteVisitRequest[]> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('site_visits')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data) return data as SiteVisitRequest[];
      } catch (err) {
        console.warn('Supabase get site visits failed, returning local:', err);
      }
    }
    return getLocal<SiteVisitRequest[]>(STORAGE_KEYS.SITE_VISITS, []);
  },

  async updateSiteVisitStatus(
    id: string, 
    status: SiteVisitStatus,
    rescheduledData?: { preferredDate?: string; preferredTime?: string; notes?: string }
  ): Promise<boolean> {
    if (this.isUsingCloudDatabase()) {
      try {
        const payload: any = { status };
        if (rescheduledData?.preferredDate) payload.preferredDate = rescheduledData.preferredDate;
        if (rescheduledData?.preferredTime) payload.preferredTime = rescheduledData.preferredTime;
        if (rescheduledData?.notes) payload.notes = rescheduledData.notes;

        const { error } = await supabase!
          .from('site_visits')
          .update(payload)
          .eq('id', id);
        if (!error) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return true;
        }
      } catch (err) {
        console.warn('Supabase update site visit failed, updating locally:', err);
      }
    }

    const current = getLocal<SiteVisitRequest[]>(STORAGE_KEYS.SITE_VISITS, []);
    const idx = current.findIndex(v => v.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      if (rescheduledData?.preferredDate) current[idx].preferredDate = rescheduledData.preferredDate;
      if (rescheduledData?.preferredTime) current[idx].preferredTime = rescheduledData.preferredTime;
      if (rescheduledData?.notes) current[idx].notes = rescheduledData.notes;
      setLocal(STORAGE_KEYS.SITE_VISITS, [...current]);
      return true;
    }
    return false;
  },

  // BUSINESS SETTINGS
  async getBusinessSettings(): Promise<BusinessSettings> {
    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('business_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (!error && data) return data as BusinessSettings;
      } catch (err) {
        console.warn('Supabase get settings failed, returning local:', err);
      }
    }
    return getLocal<BusinessSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const current = await this.getBusinessSettings();
    const updated = { ...current, ...settings };

    if (this.isUsingCloudDatabase()) {
      try {
        const { data, error } = await supabase!
          .from('business_settings')
          .upsert([updated])
          .select()
          .maybeSingle();
        if (!error && data) {
          window.dispatchEvent(new Event('guruji_db_change'));
          return data as BusinessSettings;
        }
      } catch (err) {
        console.warn('Supabase update settings failed, updating locally:', err);
      }
    }

    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }
};
