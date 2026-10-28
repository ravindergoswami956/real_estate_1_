import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService, AdminUser } from '../../services/auth';
import { DatabaseService } from '../../services/database';
import { 
  Property, 
  CustomerEnquiry, 
  SiteVisitRequest, 
  BusinessSettings, 
  ListingStatus, 
  PropertyType, 
  PropertyCategory, 
  EnquiryStatus, 
  SiteVisitStatus 
} from '../../types/property';
import { 
  LayoutDashboard,
  CheckCircle2,
  PlusCircle, 
  ListFilter, 
  Calendar, 
  Mail, 
  Settings, 
  LogOut, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Eye,
  Clock,
  UserCheck,
  Building,
  Menu,
  X,
  Users
} from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'available' | 'add' | 'manage' | 'visits' | 'enquiries' | 'settings'
  >('overview');
  
  // Mobile sidebar drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisitRequest[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reschedule Modal State
  const [rescheduleModalVisit, setRescheduleModalVisit] = useState<SiteVisitRequest | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  // Property Form State (for Add / Edit)
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formPropertyType, setFormPropertyType] = useState<PropertyType>('Residential');
  const [formCategory, setFormCategory] = useState<PropertyCategory>('buy');
  const [formStatus, setFormStatus] = useState<ListingStatus>('Available');
  const [formLocation, setFormLocation] = useState('');
  const [formSector, setFormSector] = useState('Sector 57');
  const [formPrice, setFormPrice] = useState('');
  const [formPriceNumeric, setFormPriceNumeric] = useState<number>(0);
  const [formArea, setFormArea] = useState<number>(1800);
  const [formBedrooms, setFormBedrooms] = useState<number | undefined>(3);
  const [formBathrooms, setFormBathrooms] = useState<number | undefined>(3);
  const [formDescription, setFormDescription] = useState('');
  const [formAmenitiesText, setFormAmenitiesText] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Search & Filter states
  const [adminPropSearch, setAdminPropSearch] = useState('');
  const [adminPropStatusFilter, setAdminPropStatusFilter] = useState<string>('All');
  const [visitStatusFilter, setVisitStatusFilter] = useState<string>('All');

  // Load all data
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [props, enqs, visits, settings] = await Promise.all([
        DatabaseService.getAllProperties(),
        DatabaseService.getEnquiries(),
        DatabaseService.getSiteVisits(),
        DatabaseService.getBusinessSettings()
      ]);
      setProperties(props);
      setEnquiries(enqs);
      setSiteVisits(visits);
      setBusinessSettings(settings);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AuthService.getCurrentUser().then((user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setCurrentUser(user);
        loadDashboardData();
      }
    });

    const handleDataChange = () => loadDashboardData();
    window.addEventListener('guruji_db_change', handleDataChange);
    return () => window.removeEventListener('guruji_db_change', handleDataChange);
  }, [navigate]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/admin/login');
  };

  // Reset Property Form
  const resetPropertyForm = () => {
    setEditingPropertyId(null);
    setFormTitle('');
    setFormPropertyType('Residential');
    setFormCategory('buy');
    setFormStatus('Available');
    setFormLocation('Block G, Sushant Lok 2, Sector 57, Gurugram');
    setFormSector('Sector 57');
    setFormPrice('₹ 2.50 Cr');
    setFormPriceNumeric(25000000);
    setFormArea(2200);
    setFormBedrooms(3);
    setFormBathrooms(3);
    setFormDescription('');
    setFormAmenitiesText('Gated Security, Lift, 100% Power Backup, Covered Parking');
    setFormImages([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ]);
    setFormImageUrlInput('');
    setFormIsFeatured(false);
    setFormSuccessMessage(null);
  };

  // Open Edit Form
  const handleStartEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormTitle(prop.title);
    setFormPropertyType(prop.propertyType);
    setFormCategory(prop.category);
    setFormStatus(prop.listingStatus);
    setFormLocation(prop.location);
    setFormSector(prop.sector);
    setFormPrice(prop.price);
    setFormPriceNumeric(prop.priceNumeric);
    setFormArea(prop.area);
    setFormBedrooms(prop.bedrooms);
    setFormBathrooms(prop.bathrooms);
    setFormDescription(prop.description);
    setFormAmenitiesText(prop.amenities ? prop.amenities.join(', ') : '');
    setFormImages(prop.images && prop.images.length > 0 ? prop.images : []);
    setFormIsFeatured(prop.isFeatured || false);
    setFormSuccessMessage(null);
    setActiveTab('add');
    setMobileMenuOpen(false);
  };

  // Image helpers
  const handleAddImageUrl = () => {
    if (formImageUrlInput.trim()) {
      setFormImages([...formImages, formImageUrlInput.trim()]);
      setFormImageUrlInput('');
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormImages([...formImages, uploadEvent.target.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  // Save or Create Property
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice.trim() || !formLocation.trim()) {
      alert('Please fill in Title, Price, and Location.');
      return;
    }

    const amenitiesArray = formAmenitiesText
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const propertyPayload = {
      title: formTitle.trim(),
      propertyType: formPropertyType,
      category: formCategory,
      listingStatus: formStatus,
      location: formLocation.trim(),
      sector: formSector.trim() || 'Sector 57',
      price: formPrice.trim(),
      priceNumeric: formPriceNumeric || 0,
      area: formArea || 1000,
      bedrooms: formBedrooms,
      bathrooms: formBathrooms,
      description: formDescription.trim(),
      amenities: amenitiesArray,
      images: formImages.length > 0 ? formImages : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      isFeatured: formIsFeatured,
      contactPhone: BUSINESS_INFO.phone,
      contactWhatsApp: BUSINESS_INFO.whatsappRaw
    };

    try {
      if (editingPropertyId) {
        await DatabaseService.updateProperty(editingPropertyId, propertyPayload);
        setFormSuccessMessage('Property updated successfully.');
      } else {
        await DatabaseService.addProperty(propertyPayload);
        setFormSuccessMessage('Property published successfully to website.');
      }
      await loadDashboardData();
      setTimeout(() => {
        setFormSuccessMessage(null);
        setActiveTab('manage');
      }, 1200);
    } catch (err) {
      alert('Failed to save property. Please check connection.');
    }
  };

  // Quick Status Change
  const handleQuickStatusChange = async (id: string, status: ListingStatus) => {
    try {
      await DatabaseService.updatePropertyStatus(id, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await DatabaseService.deleteProperty(id);
        await loadDashboardData();
      } catch (err) {
        alert('Failed to delete property.');
      }
    }
  };

  // Enquiry Status Update
  const handleEnquiryStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await DatabaseService.updateEnquiryStatus(id, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update enquiry status.');
    }
  };

  // Site Visit Status Update
  const handleSiteVisitStatusChange = async (id: string, status: SiteVisitStatus) => {
    try {
      await DatabaseService.updateSiteVisitStatus(id, status);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to update visit status.');
    }
  };

  // Handle Reschedule Submit
  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalVisit) return;
    if (!rescheduleDate) {
      alert('Please choose a new preferred date.');
      return;
    }

    try {
      await DatabaseService.updateSiteVisitStatus(rescheduleModalVisit.id, 'Rescheduled', {
        preferredDate: rescheduleDate,
        preferredTime: rescheduleTime,
        notes: rescheduleNotes ? `[Rescheduled] ${rescheduleNotes}` : undefined
      });
      setRescheduleModalVisit(null);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to reschedule visit.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessSettings) return;
    try {
      await DatabaseService.updateBusinessSettings(businessSettings);
      alert('Business Settings updated successfully.');
      await loadDashboardData();
    } catch (err) {
      alert('Failed to save settings.');
    }
  };

  // Filtering for Manage Properties
  const filteredAdminProps = properties.filter((p) => {
    if (adminPropStatusFilter !== 'All' && p.listingStatus !== adminPropStatusFilter) {
      return false;
    }
    if (adminPropSearch.trim() !== '') {
      const q = adminPropSearch.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Available Properties List (Only Available)
  const availableProperties = properties.filter((p) => p.listingStatus === 'Available');

  // Filtered Site Visits
  const filteredSiteVisits = siteVisits.filter((v) => {
    if (visitStatusFilter !== 'All' && v.status !== visitStatusFilter) {
      return false;
    }
    return true;
  });

  // Sidebar navigation item component
  const NavItem = ({ 
    tab, 
    label, 
    icon: Icon, 
    badge 
  }: { 
    tab: typeof activeTab; 
    label: string; 
    icon: any; 
    badge?: number | string; 
  }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => {
          if (tab === 'add' && activeTab !== 'add') {
            resetPropertyForm();
          }
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
          isActive 
            ? 'bg-charcoal-900 text-champagne-300 font-bold shadow-sm' 
            : 'text-charcoal-700 hover:bg-ivory-100 hover:text-charcoal-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${isActive ? 'text-champagne-400' : 'text-champagne-700'}`} />
          <span>{label}</span>
        </div>
        {badge !== undefined && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            typeof badge === 'number' && badge > 0 
              ? isActive ? 'bg-champagne-500 text-charcoal-950' : 'bg-champagne-100 text-champagne-900' 
              : 'bg-sand-200 text-charcoal-700'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="bg-charcoal-950 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-charcoal-800 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-charcoal-300 hover:text-white hover:bg-charcoal-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
              Guruji Property Gurugram
            </h1>
            <p className="text-[10px] text-champagne-400 font-semibold tracking-wider uppercase">
              Admin Management Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-charcoal-300 hover:text-champagne-300 flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-lg hover:bg-charcoal-900"
          >
            <Eye className="w-3.5 h-3.5 text-champagne-400" />
            <span className="hidden sm:inline">View Public Website</span>
          </a>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-rose-950 text-charcoal-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-charcoal-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout with Persistent Left Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Persistent Sidebar (Responsive on Mobile) */}
        <aside className={`
          w-full md:w-64 bg-white border-r border-sand-200 p-4 space-y-1.5 shrink-0 flex flex-col justify-between
          ${mobileMenuOpen ? 'block' : 'hidden md:flex'}
        `}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-charcoal-400">
              Admin Navigation
            </div>

            {/* Exact Requested Menu Items */}
            <NavItem 
              tab="overview" 
              label="Dashboard Overview" 
              icon={LayoutDashboard} 
            />

            <NavItem 
              tab="available" 
              label="Available Properties" 
              icon={CheckCircle2} 
              badge={availableProperties.length} 
            />

            <NavItem 
              tab="add" 
              label={editingPropertyId ? 'Edit Property' : 'Add New Property'} 
              icon={PlusCircle} 
            />

            <NavItem 
              tab="manage" 
              label="Manage Properties" 
              icon={ListFilter} 
              badge={properties.length} 
            />

            <NavItem 
              tab="visits" 
              label="Site Visit Requests" 
              icon={Calendar} 
              badge={siteVisits.filter(v => v.status === 'Pending').length} 
            />

            <NavItem 
              tab="enquiries" 
              label="Customer Enquiries" 
              icon={Mail} 
              badge={enquiries.filter(e => e.status === 'New').length} 
            />

            <NavItem 
              tab="settings" 
              label="Business Settings" 
              icon={Settings} 
            />
          </div>

          <div className="pt-6 border-t border-sand-200 mt-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </button>

            <div className="p-3 rounded-xl bg-ivory-50 border border-sand-200 text-[11px] text-charcoal-600 space-y-1">
              <span className="font-semibold text-charcoal-900 block">Supabase Connection:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                ● Live Cloud Synced
              </span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto max-w-7xl">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                  Live Operations
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                  Dashboard Overview
                </h2>
                <p className="text-xs text-charcoal-600 mt-1 font-light">
                  Live status of published properties, customer leads, and upcoming property site visits.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('manage')}
                  className="p-5 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-1 cursor-pointer hover:border-champagne-400 transition-all"
                >
                  <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider">Total Properties</span>
                  <div className="text-3xl font-bold font-serif text-charcoal-900">{properties.length}</div>
                  <span className="text-[11px] text-charcoal-400">All registered listings</span>
                </div>

                <div 
                  onClick={() => setActiveTab('available')}
                  className="p-5 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-1 cursor-pointer hover:border-emerald-400 transition-all"
                >
                  <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Available on Site</span>
                  <div className="text-3xl font-bold font-serif text-emerald-700">
                    {availableProperties.length}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Publicly active</span>
                </div>

                <div 
                  onClick={() => setActiveTab('enquiries')}
                  className="p-5 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-1 cursor-pointer hover:border-champagne-400 transition-all"
                >
                  <span className="text-xs text-champagne-800 font-semibold uppercase tracking-wider">New Enquiries</span>
                  <div className="text-3xl font-bold font-serif text-champagne-800">
                    {enquiries.filter(e => e.status === 'New').length}
                  </div>
                  <span className="text-[11px] text-charcoal-400">Awaiting consultation</span>
                </div>

                <div 
                  onClick={() => setActiveTab('visits')}
                  className="p-5 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-1 cursor-pointer hover:border-blue-400 transition-all"
                >
                  <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider">Site Visits</span>
                  <div className="text-3xl font-bold font-serif text-blue-700">
                    {siteVisits.filter(v => v.status === 'Pending').length}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">Pending confirmation</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-4">
                <h3 className="font-serif font-bold text-charcoal-900 text-sm">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add New Property</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('available')}
                    className="py-2.5 px-4 rounded-xl border border-sand-300 hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>View Available Listings ({availableProperties.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('visits')}
                    className="py-2.5 px-4 rounded-xl border border-sand-300 hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Inspect Visit Requests ({siteVisits.length})</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Customer Enquiries */}
                <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-100 pb-3">
                    <h3 className="font-serif font-bold text-charcoal-900 text-sm">Recent Customer Enquiries</h3>
                    <button onClick={() => setActiveTab('enquiries')} className="text-xs text-champagne-700 font-semibold hover:underline">
                      View all ({enquiries.length})
                    </button>
                  </div>
                  {enquiries.length === 0 ? (
                    <p className="text-xs text-charcoal-400 py-4">No enquiries submitted yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {enquiries.slice(0, 4).map((enq) => (
                        <div key={enq.id} className="p-3.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-charcoal-900 block">{enq.customerName}</span>
                            <span className="text-charcoal-500 text-[11px]">{enq.phone} • {enq.propertyTitle || 'General Enquiry'}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            enq.status === 'New' ? 'bg-champagne-100 text-champagne-900' : 'bg-sand-200 text-charcoal-700'
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Site Visits */}
                <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-100 pb-3">
                    <h3 className="font-serif font-bold text-charcoal-900 text-sm">Site Visit Requests</h3>
                    <button onClick={() => setActiveTab('visits')} className="text-xs text-champagne-700 font-semibold hover:underline">
                      View all ({siteVisits.length})
                    </button>
                  </div>
                  {siteVisits.length === 0 ? (
                    <p className="text-xs text-charcoal-400 py-4">No site visit requests received yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {siteVisits.slice(0, 4).map((v) => (
                        <div key={v.id} className="p-3.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-charcoal-900 block">{v.customerName}</span>
                            <span className="text-charcoal-500 text-[11px]">{v.preferredDate} ({v.preferredTime})</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            v.status === 'Pending' ? 'bg-amber-100 text-amber-900' :
                            v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-900' :
                            v.status === 'Rescheduled' ? 'bg-blue-100 text-blue-900' :
                            'bg-sand-200 text-charcoal-700'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AVAILABLE PROPERTIES */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block mb-1">
                    Live On Website
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                    Available Properties ({availableProperties.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-1 font-light">
                    These listings are currently published and visible to buyers on the public website.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/#properties"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl border border-sand-300 hover:bg-white text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-champagne-600" />
                    <span>View on Website</span>
                  </a>

                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add Property</span>
                  </button>
                </div>
              </div>

              {availableProperties.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-sand-200 space-y-3 shadow-luxury">
                  <Building className="w-10 h-10 text-charcoal-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No properties are currently marked Available.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    Add new properties or change status of existing properties in "Manage Properties" to publish them.
                  </p>
                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-charcoal-900 text-champagne-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-800 transition-colors"
                  >
                    Create First Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProperties.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl bg-white border border-sand-200 overflow-hidden shadow-luxury flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-charcoal-900 overflow-hidden">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-sm">
                              Available
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-900/90 text-champagne-300 backdrop-blur-sm border border-champagne-500/30">
                              {p.propertyType}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 bg-charcoal-950/85 backdrop-blur-sm px-3 py-1 rounded-lg text-champagne-300 font-serif font-bold text-sm">
                            {p.price}
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="font-serif font-bold text-charcoal-900 text-base line-clamp-1 mb-1">
                            {p.title}
                          </h4>
                          <p className="text-xs text-charcoal-500 mb-3">{p.location}</p>
                          <div className="text-xs text-charcoal-700 font-medium flex items-center gap-3">
                            <span>{p.area} sq.ft</span>
                            {p.bedrooms && <span>• {p.bedrooms} BHK</span>}
                            <span>• {p.sector}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-sand-100 mt-2 flex items-center gap-2">
                        <select
                          value={p.listingStatus}
                          onChange={(e) => handleQuickStatusChange(p.id, e.target.value as ListingStatus)}
                          className="flex-1 px-2.5 py-2 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-semibold focus:outline-none"
                        >
                          <option value="Available">Keep Available</option>
                          <option value="Sold">Mark Sold</option>
                          <option value="Rented">Mark Rented</option>
                          <option value="Unavailable">Take Offline</option>
                        </select>

                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-2 rounded-lg border border-sand-300 hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold flex items-center gap-1"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD / EDIT PROPERTY */}
          {activeTab === 'add' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                  {editingPropertyId ? 'Property Editor' : 'New Listing'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                  {editingPropertyId ? 'Edit Property Details' : 'Add New Property Listing'}
                </h2>
                <p className="text-xs text-charcoal-600 mt-1 font-light">
                  Add genuine property specifications. Properties saved here will immediately reflect on the public website.
                </p>
              </div>

              {formSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProperty} className="p-6 sm:p-8 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-6">
                
                {/* Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Property Headline / Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ultra Luxury 4 BHK Builder Floor"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Property Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formPropertyType}
                      onChange={(e) => setFormPropertyType(e.target.value as PropertyType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land / Plot</option>
                      <option value="Rental">Rental</option>
                    </select>
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Listing Purpose <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as PropertyCategory)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    >
                      <option value="buy">For Sale (Buy)</option>
                      <option value="rent">For Rent</option>
                      <option value="commercial">Commercial Space</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Current Listing Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ListingStatus)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Available">Available (Visible to Public)</option>
                      <option value="Sold">Sold (Hidden or Marked Sold)</option>
                      <option value="Rented">Rented</option>
                      <option value="Unavailable">Unavailable / Draft</option>
                    </select>
                  </div>
                </div>

                {/* Location & Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Full Address / Landmark <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Block G, Sushant Lok 2, Sector 57, Gurugram"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Sector / Micro-Market
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 57"
                      value={formSector}
                      onChange={(e) => setFormSector(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                {/* Price & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Display Price <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹ 2.50 Cr or ₹ 45,000 / mo"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Area (Sq. Ft.)
                    </label>
                    <input
                      type="number"
                      value={formArea}
                      onChange={(e) => setFormArea(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Bedrooms (BHK)
                    </label>
                    <input
                      type="number"
                      value={formBedrooms ?? ''}
                      onChange={(e) => setFormBedrooms(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formBathrooms ?? ''}
                      onChange={(e) => setFormBathrooms(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Property Description & Highlights
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide authentic details about the structure, Italian marble flooring, orientation, builder repute, registration status, etc."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 resize-none"
                  ></textarea>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lift, Gated Security, 100% Power Backup, Covered Stilt Parking, Vastu Compliant"
                    value={formAmenitiesText}
                    onChange={(e) => setFormAmenitiesText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                {/* Image URLs & Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-charcoal-800 block">
                    Property Photography & Images
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Enter direct image URL (Unsplash or external CDN)..."
                      value={formImageUrlInput}
                      onChange={(e) => setFormImageUrlInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 rounded-xl bg-charcoal-900 text-champagne-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-800 cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-charcoal-500">Or choose image file:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="text-xs text-charcoal-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-champagne-100 file:text-charcoal-950 hover:file:bg-champagne-200 cursor-pointer"
                    />
                  </div>

                  {formImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {formImages.map((img, i) => (
                        <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden border border-sand-300 group shadow-sm">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-[10px] opacity-90 hover:opacity-100 cursor-pointer"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Highlight Checkbox */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-champagne-600 focus:ring-champagne-500 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-charcoal-800 cursor-pointer">
                    Highlight as Featured Property on Homepage
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-sand-100 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    {editingPropertyId ? 'Save & Update Property' : 'Publish Property to Website'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('manage')}
                    className="px-4 py-3 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-ivory-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 4: MANAGE PROPERTIES */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                    Inventory Control
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                    Manage Properties ({filteredAdminProps.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-1 font-light">
                    Update listing status, modify pricing, upload photographs, or delete property listings.
                  </p>
                </div>

                <button
                  onClick={() => {
                    resetPropertyForm();
                    setActiveTab('add');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-colors self-start"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Property</span>
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-sand-200 shadow-sm">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by title, location, or sector..."
                    value={adminPropSearch}
                    onChange={(e) => setAdminPropSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-sand-300 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <div>
                  <select
                    value={adminPropStatusFilter}
                    onChange={(e) => setAdminPropStatusFilter(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-sand-300 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500 font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Property Rows */}
              {filteredAdminProps.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-sand-200 text-charcoal-500 text-xs shadow-luxury">
                  No properties found matching your filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAdminProps.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-white border border-sand-200 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={p.title}
                          className="w-20 h-16 rounded-xl object-cover shrink-0 border border-sand-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              p.listingStatus === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                              p.listingStatus === 'Sold' ? 'bg-rose-100 text-rose-800' :
                              p.listingStatus === 'Rented' ? 'bg-blue-100 text-blue-800' : 'bg-sand-200 text-charcoal-700'
                            }`}>
                              {p.listingStatus}
                            </span>
                            <span className="text-[11px] text-charcoal-500 font-medium">
                              {p.propertyType} • {p.sector}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-charcoal-900 text-sm mt-0.5">
                            {p.title}
                          </h4>
                          <p className="text-xs text-champagne-800 font-semibold mt-0.5">
                            {p.price} • {p.area} sq.ft {p.bedrooms ? `• ${p.bedrooms} BHK` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                        <select
                          value={p.listingStatus}
                          onChange={(e) => handleQuickStatusChange(p.id, e.target.value as ListingStatus)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-medium focus:outline-none"
                        >
                          <option value="Available">Mark Available</option>
                          <option value="Sold">Mark Sold</option>
                          <option value="Rented">Mark Rented</option>
                          <option value="Unavailable">Mark Unavailable</option>
                        </select>

                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-2 rounded-lg border border-sand-300 hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Edit Property"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProperty(p.id, p.title)}
                          className="p-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SITE VISIT REQUESTS */}
          {activeTab === 'visits' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                    Client Inspections
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                    Site Visit Requests ({siteVisits.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-1 font-light">
                    Manage appointments scheduled by buyers. Confirm, reschedule, complete, or cancel requests.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={visitStatusFilter}
                    onChange={(e) => setVisitStatusFilter(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl border border-sand-300 bg-white text-charcoal-800 font-semibold focus:outline-none shadow-sm"
                  >
                    <option value="All">All Visit Statuses</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredSiteVisits.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-sand-200 space-y-3 shadow-luxury">
                  <Calendar className="w-10 h-10 text-charcoal-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No site visit requests found.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    When visitors click "Schedule a Visit" on the website, their appointment requests will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSiteVisits.map((v) => {
                    const waConfirmLink = `https://wa.me/${v.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${v.customerName}! Your site visit request for "${v.propertyTitle || 'Guruji Property'}" on ${v.preferredDate} (${v.preferredTime}) is confirmed by Guruji Property Gurugram (Sector 57). Please call 084471 95227 if you need directions.`
                    )}`;

                    return (
                      <div
                        key={v.id}
                        className="p-6 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-4"
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                          <div>
                            <span className="font-serif font-bold text-charcoal-900 text-base">{v.customerName}</span>
                            <span className="text-xs text-charcoal-400 ml-2">
                              Submitted: {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg self-start ${
                            v.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            v.status === 'Rescheduled' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                            v.status === 'Completed' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                            'bg-rose-100 text-rose-900 border border-rose-200'
                          }`}>
                            {v.status}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-charcoal-700">
                          <div>
                            <span className="text-charcoal-400 block mb-0.5">Phone Number:</span>
                            <a href={`tel:${v.phone}`} className="font-bold text-champagne-800 hover:underline text-sm">
                              {v.phone}
                            </a>
                          </div>

                          <div>
                            <span className="text-charcoal-400 block mb-0.5">Preferred Date:</span>
                            <strong className="text-charcoal-900">{v.preferredDate}</strong>
                          </div>

                          <div>
                            <span className="text-charcoal-400 block mb-0.5">Preferred Slot:</span>
                            <strong className="text-charcoal-900">{v.preferredTime}</strong>
                          </div>

                          {v.email && (
                            <div>
                              <span className="text-charcoal-400 block mb-0.5">Email Address:</span>
                              <span className="text-charcoal-800">{v.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Property Of Interest */}
                        {v.propertyTitle && (
                          <div className="p-3 rounded-xl bg-ivory-50 border border-sand-200 text-xs">
                            <span className="text-charcoal-500 font-medium">Property of Interest:</span>{' '}
                            <strong className="text-charcoal-900">{v.propertyTitle}</strong>
                          </div>
                        )}

                        {/* Customer Notes / Message */}
                        {v.notes && (
                          <div className="p-3 rounded-xl bg-sand-50 border border-sand-100 text-xs text-charcoal-700">
                            <span className="text-charcoal-500 font-medium block mb-0.5">Customer Message / Notes:</span>
                            <span className="italic">{v.notes}</span>
                          </div>
                        )}

                        {/* Action Buttons: Confirm, Reschedule, Completed, Cancel */}
                        <div className="pt-2 border-t border-sand-100 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleSiteVisitStatusChange(v.id, 'Confirmed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              v.status === 'Confirmed' 
                                ? 'bg-emerald-700 text-white shadow-sm' 
                                : 'border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Visit</span>
                          </button>

                          <button
                            onClick={() => {
                              setRescheduleModalVisit(v);
                              setRescheduleDate(v.preferredDate);
                              setRescheduleTime(v.preferredTime);
                              setRescheduleNotes('');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              v.status === 'Rescheduled' 
                                ? 'bg-blue-700 text-white shadow-sm' 
                                : 'border border-blue-300 text-blue-800 hover:bg-blue-50'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            onClick={() => handleSiteVisitStatusChange(v.id, 'Completed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              v.status === 'Completed' 
                                ? 'bg-purple-700 text-white shadow-sm' 
                                : 'border border-purple-300 text-purple-800 hover:bg-purple-50'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>

                          <button
                            onClick={() => handleSiteVisitStatusChange(v.id, 'Cancelled')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              v.status === 'Cancelled' 
                                ? 'bg-rose-700 text-white shadow-sm' 
                                : 'border border-rose-300 text-rose-800 hover:bg-rose-50'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Visit</span>
                          </button>

                          <div className="ml-auto flex items-center gap-2">
                            <a
                              href={`tel:${v.phone}`}
                              className="px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-charcoal-800 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Call</span>
                            </a>

                            <a
                              href={waConfirmLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CUSTOMER ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                  Inbound Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                  Customer Enquiries ({enquiries.length})
                </h2>
                <p className="text-xs text-charcoal-600 mt-1 font-light">
                  Enquiries received through public website forms. Mark status as New, Contacted, or Closed.
                </p>
              </div>

              {enquiries.length === 0 ? (
                <div className="p-16 text-center rounded-2xl bg-white border border-sand-200 space-y-3 shadow-luxury">
                  <Mail className="w-10 h-10 text-charcoal-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No enquiries recorded yet.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    When visitors submit requirements from the contact section or property modal, they appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => {
                    const waLink = `https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${enq.customerName}, this is Guruji Property Gurugram regarding your property enquiry.`
                    )}`;

                    return (
                      <div
                        key={enq.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                          <div>
                            <span className="font-bold text-charcoal-900 text-base font-serif">{enq.customerName}</span>
                            <span className="text-xs text-charcoal-400 ml-2">
                              {new Date(enq.createdAt).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-charcoal-500">Status:</span>
                            <select
                              value={enq.status}
                              onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as EnquiryStatus)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                                enq.status === 'New' ? 'bg-champagne-50 text-champagne-900 border-champagne-300' :
                                enq.status === 'Contacted' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                                'bg-sand-100 text-charcoal-700 border-sand-300'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-charcoal-700">
                          <div>
                            <span className="text-charcoal-400 block">Phone:</span>
                            <a href={`tel:${enq.phone}`} className="font-bold text-champagne-800 hover:underline">
                              {enq.phone}
                            </a>
                          </div>
                          {enq.email && (
                            <div>
                              <span className="text-charcoal-400 block">Email:</span>
                              <span className="text-charcoal-800">{enq.email}</span>
                            </div>
                          )}
                          {enq.budget && (
                            <div>
                              <span className="text-charcoal-400 block">Target Budget:</span>
                              <span className="font-semibold text-charcoal-900">{enq.budget}</span>
                            </div>
                          )}
                        </div>

                        {enq.propertyTitle && (
                          <div className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 text-xs">
                            <span className="text-charcoal-500">Interested Property:</span>{' '}
                            <strong className="text-charcoal-900">{enq.propertyTitle}</strong>
                          </div>
                        )}

                        {enq.message && (
                          <p className="text-xs text-charcoal-700 bg-sand-50 p-3 rounded-xl italic">
                            "{enq.message}"
                          </p>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                          <a
                            href={`tel:${enq.phone}`}
                            className="px-3.5 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-charcoal-800 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BUSINESS SETTINGS */}
          {activeTab === 'settings' && businessSettings && (
            <div className="max-w-3xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                  Profile & Configuration
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                  Business Settings
                </h2>
                <p className="text-xs text-charcoal-600 mt-1 font-light">
                  Update primary phone, address, and consulting hours displayed on the website.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-white border border-sand-200 shadow-luxury space-y-5">
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Official Business Name
                  </label>
                  <input
                    type="text"
                    value={businessSettings.businessName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Primary Phone Number
                    </label>
                    <input
                      type="text"
                      value={businessSettings.phone}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      WhatsApp Number (918447195227)
                    </label>
                    <input
                      type="text"
                      value={businessSettings.whatsapp}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Office Address
                  </label>
                  <textarea
                    rows={2}
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Consulting Hours
                  </label>
                  <input
                    type="text"
                    value={businessSettings.hours}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, hours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-ivory-50 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Save Business Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Reschedule Visit Modal */}
      {rescheduleModalVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-sand-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <h3 className="font-serif font-bold text-charcoal-900 text-lg">
                Reschedule Site Visit
              </h3>
              <button
                onClick={() => setRescheduleModalVisit(null)}
                className="text-charcoal-400 hover:text-charcoal-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-charcoal-600">
              Rescheduling visit for <strong className="text-charcoal-900">{rescheduleModalVisit.customerName}</strong> ({rescheduleModalVisit.propertyTitle || 'Property'}).
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-800 block mb-1">
                  New Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800 block mb-1">
                  New Preferred Time Slot *
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 font-medium"
                >
                  <option value="10:00 AM">10:00 AM – Morning Slot</option>
                  <option value="11:30 AM">11:30 AM – Late Morning</option>
                  <option value="02:30 PM">02:30 PM – Afternoon Slot</option>
                  <option value="04:30 PM">04:30 PM – Late Afternoon</option>
                  <option value="06:00 PM">06:00 PM – Evening Sunset Slot</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-800 block mb-1">
                  Reason or Note for Rescheduling (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Buyer requested afternoon slot instead; agreed via phone."
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save Rescheduled Visit
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleModalVisit(null)}
                  className="px-4 py-2.5 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-ivory-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
