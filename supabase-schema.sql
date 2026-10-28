-- ========================================================
-- GURUJI PROPERTY GURUGRAM — SUPABASE DATABASE SCHEMA
-- ========================================================
-- Run this script in your Supabase Project > SQL Editor
-- to set up all tables, security policies, and permissions.

-- 1. Create Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    category TEXT NOT NULL,
    "listingStatus" TEXT NOT NULL DEFAULT 'Available',
    location TEXT NOT NULL,
    sector TEXT NOT NULL,
    price TEXT NOT NULL,
    "priceNumeric" NUMERIC NOT NULL,
    area NUMERIC NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    description TEXT,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    "isFeatured" BOOLEAN DEFAULT false,
    "contactPhone" TEXT DEFAULT '084471 95227',
    "contactWhatsApp" TEXT DEFAULT '918447195227',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Customer Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id TEXT PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    "propertyId" TEXT,
    "propertyTitle" TEXT,
    budget TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Site Visit Requests Table
CREATE TABLE IF NOT EXISTS public.site_visits (
    id TEXT PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    "propertyId" TEXT,
    "propertyTitle" TEXT,
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Business Settings Table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "businessName" TEXT NOT NULL DEFAULT 'Guruji Property Gurugram',
    phone TEXT NOT NULL DEFAULT '084471 95227',
    whatsapp TEXT NOT NULL DEFAULT '918447195227',
    address TEXT NOT NULL DEFAULT 'SHOP-54, MKM Market Road, Block G, Sushant Lok 2, Sector 57, Gurugram, Haryana 122011',
    hours TEXT NOT NULL DEFAULT 'Monday – Sunday: 9:30 AM – 8:30 PM',
    "googleMapsUrl" TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Guruji+Property+SHOP-54+MKM+Market+Road+Block+G+Sushant+Lok+2+Sector+57+Gurugram+Haryana+122011'
);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Properties
-- Public can view published listings (except Unavailable)
DROP POLICY IF EXISTS "Public can view published properties" ON public.properties;
CREATE POLICY "Public can view published properties"
    ON public.properties FOR SELECT
    USING ("listingStatus" != 'Unavailable' OR auth.role() = 'authenticated');

-- Authenticated admins can insert, update, and delete
DROP POLICY IF EXISTS "Admins can manage properties" ON public.properties;
CREATE POLICY "Admins can manage properties"
    ON public.properties FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. RLS Policies: Customer Enquiries
-- Anyone can submit an enquiry
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries;
CREATE POLICY "Public can submit enquiries"
    ON public.enquiries FOR INSERT
    WITH CHECK (true);

-- Only authenticated admins can read and update enquiries (protects customer privacy!)
DROP POLICY IF EXISTS "Admins can view and update enquiries" ON public.enquiries;
CREATE POLICY "Admins can view and update enquiries"
    ON public.enquiries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. RLS Policies: Site Visit Requests
-- Anyone can submit a site visit request
DROP POLICY IF EXISTS "Public can submit site visit requests" ON public.site_visits;
CREATE POLICY "Public can submit site visit requests"
    ON public.site_visits FOR INSERT
    WITH CHECK (true);

-- Only authenticated admins can read and manage site visits
DROP POLICY IF EXISTS "Admins can view and update site visits" ON public.site_visits;
CREATE POLICY "Admins can view and update site visits"
    ON public.site_visits FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 9. RLS Policies: Business Settings
-- Public can view business settings
DROP POLICY IF EXISTS "Public can view business settings" ON public.business_settings;
CREATE POLICY "Public can view business settings"
    ON public.business_settings FOR SELECT
    USING (true);

-- Only admins can modify business settings
DROP POLICY IF EXISTS "Admins can update business settings" ON public.business_settings;
CREATE POLICY "Admins can update business settings"
    ON public.business_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_properties_sector ON public.properties(sector);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties("listingStatus");
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_site_visits_status ON public.site_visits(status);
