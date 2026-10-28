import React, { useState, useEffect, useMemo } from 'react';
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
  Phone, 
  MessageCircle, 
  RefreshCw, 
  Eye,
  Building,
  Menu,
  X,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Send,
  CalendarCheck,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';
import { BUSINESS_INFO } from '../../data/business';
import ravinderPhoto from '../../assets/ravinder-goswami.png';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'available' | 'add' | 'manage' | 'visits' | 'enquiries' | 'settings'
  >('overview');
  
  // Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisitRequest[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Confirmation modal for deleting property
  const [deleteModalProp, setDeleteModalProp] = useState<Property | null>(null);

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

  // Search, Filter & Sort states for properties
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  
  // Visit filter
  const [visitStatusFilter, setVisitStatusFilter] = useState<string>('All');
  // Enquiry filter
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');

  // Toast trigger
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Load all data
  const loadDashboardData = async (showToast = false) => {
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
      if (showToast) {
        addToast('Dashboard data synchronized with Supabase', 'info');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      addToast('Error loading live data from Supabase', 'error');
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
      addToast('Please fill in Title, Price, and Location.', 'error');
      return;
    }

    setIsSaving(true);
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
        addToast(`"${formTitle.trim()}" updated successfully.`);
      } else {
        await DatabaseService.addProperty(propertyPayload);
        addToast(`"${formTitle.trim()}" published to website!`);
      }
      await loadDashboardData();
      setTimeout(() => {
        setActiveTab('manage');
      }, 500);
    } catch (err) {
      console.error(err);
      addToast('Failed to save property. Please check connection.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Status Change
  const handleQuickStatusChange = async (id: string, status: ListingStatus) => {
    try {
      await DatabaseService.updatePropertyStatus(id, status);
      addToast(`Status updated to ${status}`);
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to update status.', 'error');
    }
  };

  // Delete Property Confirmation
  const confirmDeleteProperty = async () => {
    if (!deleteModalProp) return;
    try {
      await DatabaseService.deleteProperty(deleteModalProp.id);
      addToast(`Deleted "${deleteModalProp.title}".`);
      setDeleteModalProp(null);
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to delete property.', 'error');
    }
  };

  // Enquiry Status Update
  const handleEnquiryStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await DatabaseService.updateEnquiryStatus(id, status);
      addToast(`Enquiry marked as ${status}`);
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to update enquiry status.', 'error');
    }
  };

  // Site Visit Status Update
  const handleSiteVisitStatusChange = async (id: string, status: SiteVisitStatus) => {
    try {
      await DatabaseService.updateSiteVisitStatus(id, status);
      addToast(`Site visit marked as ${status}`);
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to update visit status.', 'error');
    }
  };

  // Handle Reschedule Submit
  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalVisit) return;
    if (!rescheduleDate) {
      addToast('Please choose a new preferred date.', 'error');
      return;
    }

    try {
      await DatabaseService.updateSiteVisitStatus(rescheduleModalVisit.id, 'Rescheduled', {
        preferredDate: rescheduleDate,
        preferredTime: rescheduleTime,
        notes: rescheduleNotes ? `[Rescheduled] ${rescheduleNotes}` : undefined
      });
      addToast('Site visit rescheduled successfully.');
      setRescheduleModalVisit(null);
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to reschedule visit.', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessSettings) return;
    try {
      await DatabaseService.updateBusinessSettings(businessSettings);
      addToast('Business settings saved successfully.');
      await loadDashboardData();
    } catch (err) {
      addToast('Failed to save settings.', 'error');
    }
  };

  // Filtered and Sorted Properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (statusFilter !== 'All') {
      result = result.filter((p) => p.listingStatus === statusFilter);
    }
    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceNumeric - b.priceNumeric);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceNumeric - a.priceNumeric);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [properties, statusFilter, categoryFilter, searchQuery, sortBy]);

  const availableProperties = useMemo(() => {
    return properties.filter((p) => p.listingStatus === 'Available');
  }, [properties]);

  const pendingVisitsCount = useMemo(() => {
    return siteVisits.filter((v) => v.status === 'Pending').length;
  }, [siteVisits]);

  const newEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === 'New').length;
  }, [enquiries]);

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
        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
          isActive 
            ? 'bg-charcoal-900 text-champagne-300 font-bold shadow-sm' 
            : 'text-charcoal-700 hover:bg-sand-100 hover:text-charcoal-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${isActive ? 'text-champagne-400' : 'text-charcoal-500'}`} />
          <span>{label}</span>
        </div>
        {badge !== undefined && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            typeof badge === 'number' && badge > 0 
              ? isActive ? 'bg-champagne-500 text-charcoal-950' : 'bg-champagne-100 text-champagne-900 font-bold' 
              : 'bg-sand-200 text-charcoal-700'
          }`}>
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-charcoal-900 flex flex-col font-sans selection:bg-champagne-500 selection:text-charcoal-950">
      
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2.5 pointer-events-auto transition-all animate-in slide-in-from-top-2 duration-200 ${
              toast.type === 'success' 
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : 'bg-charcoal-900 text-champagne-200 border-charcoal-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-champagne-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="bg-charcoal-950 text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-charcoal-800 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-charcoal-300 hover:text-white hover:bg-charcoal-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-charcoal-900 border border-champagne-500/40 text-champagne-400 font-serif font-black text-base flex items-center justify-center">
              G
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-white tracking-wide">
                Guruji Property Gurugram
              </h1>
              <p className="text-[10px] text-champagne-400 font-semibold tracking-wider uppercase">
                Owner & Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => loadDashboardData(true)}
            title="Refresh Live Data"
            disabled={isLoading}
            className="p-1.5 rounded-lg text-charcoal-300 hover:text-champagne-300 hover:bg-charcoal-900 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-champagne-400' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-charcoal-300 hover:text-champagne-300 flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-lg hover:bg-charcoal-900 cursor-pointer border border-charcoal-800"
          >
            <Eye className="w-3.5 h-3.5 text-champagne-400" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

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
        
        {/* Left Sidebar */}
        <aside className={`
          w-full md:w-64 bg-white border-r border-sand-200 p-4 space-y-1.5 shrink-0 flex flex-col justify-between
          ${mobileMenuOpen ? 'block' : 'hidden md:flex'}
        `}>
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-charcoal-400">
              Admin Navigation
            </div>

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
              badge={pendingVisitsCount} 
            />

            <NavItem 
              tab="enquiries" 
              label="Customer Enquiries" 
              icon={Mail} 
              badge={newEnquiriesCount} 
            />

            <NavItem 
              tab="settings" 
              label="Business Settings" 
              icon={Settings} 
            />
          </div>

          {/* Sidebar Footer with Developer Badge & Cloud Status */}
          <div className="pt-4 border-t border-sand-200 mt-4 space-y-3">
            {/* Developer Credit in Sidebar */}
            <div className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center gap-2.5">
              <img 
                src={ravinderPhoto} 
                alt="Ravinder Goswami" 
                className="w-8 h-8 rounded-full object-cover border border-champagne-500 shadow-sm"
              />
              <div className="text-[10px] leading-tight">
                <span className="text-charcoal-400 block font-medium">Developed by</span>
                <span className="font-bold text-charcoal-900 font-serif">Ravinder Goswami</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center justify-between">
              <span className="font-semibold text-xs">Supabase Cloud</span>
              <span className="flex items-center gap-1 font-bold text-[10px] text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Luxury Welcome Banner & Date Header */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-900 text-[10px] font-bold uppercase tracking-wider">
                      Executive Overview
                    </span>
                    <span className="text-xs text-charcoal-400">•</span>
                    <span className="text-xs text-charcoal-500 font-medium">
                      {formattedDate}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-950">
                    {greeting}, Admin
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                    Manage your properties, enquiries, and site visits seamlessly.
                  </p>
                </div>

                {/* Quick Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Property</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('manage')}
                    className="px-3 py-2 rounded-xl border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Building className="w-3.5 h-3.5 text-charcoal-500" />
                    <span>View Listings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="px-3 py-2 rounded-xl border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-champagne-700" />
                    <span>Enquiries</span>
                    {newEnquiriesCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-champagne-600"></span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('visits')}
                    className="px-3 py-2 rounded-xl border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Site Visits</span>
                    {pendingVisitsCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Four Compact Statistic Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Total Properties */}
                <div 
                  onClick={() => setActiveTab('manage')}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-sm hover:shadow-md hover:border-champagne-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">Total Properties</span>
                    <div className="w-8 h-8 rounded-lg bg-sand-100 group-hover:bg-champagne-100 text-charcoal-700 group-hover:text-champagne-800 flex items-center justify-center transition-colors">
                      <Building className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-charcoal-900">
                    {properties.length}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-charcoal-400 mt-1">
                    <span>Registered in catalog</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* 2. Available on Site */}
                <div 
                  onClick={() => setActiveTab('available')}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Available on Site</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700">
                    {availableProperties.length}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
                    <span>Live & publicly visible</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* 3. New Enquiries */}
                <div 
                  onClick={() => setActiveTab('enquiries')}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-sm hover:shadow-md hover:border-champagne-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-champagne-900 uppercase tracking-wider">New Enquiries</span>
                    <div className="w-8 h-8 rounded-lg bg-champagne-50 group-hover:bg-champagne-100 text-champagne-800 flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-champagne-900">
                    {newEnquiriesCount}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-charcoal-400 mt-1">
                    <span>Awaiting consultation</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* 4. Upcoming Site Visits */}
                <div 
                  onClick={() => setActiveTab('visits')}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Site Visits</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-700 flex items-center justify-center transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-blue-700">
                    {pendingVisitsCount}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-blue-600 mt-1 font-medium">
                    <span>Pending confirmation</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

              </div>

              {/* Two Column Section: Recent Enquiries & Upcoming Visits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Customer Enquiries */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-champagne-700" />
                      <h3 className="font-serif font-bold text-charcoal-900 text-sm">
                        Recent Customer Enquiries
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('enquiries')} 
                      className="text-xs text-champagne-700 font-semibold hover:text-champagne-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all ({enquiries.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="py-8 text-center text-charcoal-400 space-y-2">
                      <Mail className="w-8 h-8 mx-auto text-sand-300" />
                      <p className="text-xs">No customer enquiries received yet.</p>
                      <p className="text-[11px] text-charcoal-400">Leads from website contact forms will appear here in real time.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {enquiries.slice(0, 4).map((enq) => {
                        const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                        return (
                          <div 
                            key={enq.id} 
                            className="p-3.5 rounded-xl bg-ivory-50/70 border border-sand-200 hover:border-sand-300 flex items-center justify-between gap-3 text-xs transition-colors"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-charcoal-900 truncate">{enq.customerName}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  enq.status === 'New' 
                                    ? 'bg-champagne-100 text-champagne-900 border border-champagne-200' 
                                    : enq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-sand-200 text-charcoal-700'
                                }`}>
                                  {enq.status}
                                </span>
                              </div>
                              <p className="text-charcoal-500 text-[11px] truncate">
                                {enq.propertyTitle || 'General Consultation'} • {enq.phone}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`tel:${enq.phone}`}
                                className="p-1.5 rounded-lg border border-sand-300 hover:bg-white text-charcoal-700 hover:text-charcoal-950 transition-colors"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.customerName}, thank you for contacting Guruji Property Gurugram regarding ${enq.propertyTitle || 'properties in Gurugram'}. How can we assist you?`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Site Visits */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h3 className="font-serif font-bold text-charcoal-900 text-sm">
                        Upcoming Site Visits
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('visits')} 
                      className="text-xs text-champagne-700 font-semibold hover:text-champagne-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all ({siteVisits.length})</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {siteVisits.length === 0 ? (
                    <div className="py-8 text-center text-charcoal-400 space-y-2">
                      <Calendar className="w-8 h-8 mx-auto text-sand-300" />
                      <p className="text-xs">No site visit requests received yet.</p>
                      <p className="text-[11px] text-charcoal-400">Scheduled client site inspections will appear here automatically.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {siteVisits.slice(0, 4).map((v) => {
                        const cleanPhone = v.phone.replace(/[^0-9]/g, '');
                        return (
                          <div 
                            key={v.id} 
                            className="p-3.5 rounded-xl bg-ivory-50/70 border border-sand-200 hover:border-sand-300 flex items-center justify-between gap-3 text-xs transition-colors"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-charcoal-900 truncate">{v.customerName}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  v.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                  v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                                  v.status === 'Rescheduled' ? 'bg-blue-100 text-blue-900' :
                                  'bg-sand-200 text-charcoal-700'
                                }`}>
                                  {v.status}
                                </span>
                              </div>
                              <p className="text-charcoal-500 text-[11px] truncate">
                                📅 {v.preferredDate} ({v.preferredTime}) • {v.propertyTitle || 'Property Visit'}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`tel:${v.phone}`}
                                className="p-1.5 rounded-lg border border-sand-300 hover:bg-white text-charcoal-700 hover:text-charcoal-950 transition-colors"
                                title="Call Visitor"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${v.customerName}, your site visit request with Guruji Property Gurugram on ${v.preferredDate} (${v.preferredTime}) for "${v.propertyTitle || 'Property'}" is received.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                title="WhatsApp Visitor"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Recently Added Property Quick Preview */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-champagne-700" />
                    <h3 className="font-serif font-bold text-charcoal-900 text-sm">
                      Recently Added Property Listings
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('manage')} 
                    className="text-xs text-champagne-700 font-semibold hover:text-champagne-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage all listings</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="py-8 text-center text-charcoal-400 space-y-3">
                    <Building className="w-10 h-10 mx-auto text-sand-300" />
                    <p className="text-xs">No property listings in the database yet.</p>
                    <button
                      onClick={() => {
                        resetPropertyForm();
                        setActiveTab('add');
                      }}
                      className="px-4 py-2 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      + Add First Property
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.slice(0, 3).map((p) => (
                      <div 
                        key={p.id}
                        className="rounded-xl border border-sand-200 bg-ivory-50/50 overflow-hidden hover:border-champagne-400 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-36 bg-charcoal-900">
                          <img 
                            src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'} 
                            alt={p.title} 
                            className="w-full h-full object-cover"
                          />
                          <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.listingStatus === 'Available' ? 'bg-emerald-600 text-white' :
                            p.listingStatus === 'Sold' ? 'bg-rose-600 text-white' :
                            'bg-charcoal-800 text-sand-200'
                          }`}>
                            {p.listingStatus}
                          </span>
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-charcoal-950/80 backdrop-blur-sm text-champagne-300 text-xs font-bold">
                            {p.price}
                          </span>
                        </div>

                        <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-champagne-800 uppercase tracking-wider">
                              {p.propertyType} • {p.sector}
                            </span>
                            <h4 className="font-serif font-bold text-charcoal-900 text-xs line-clamp-1">
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-charcoal-500 line-clamp-1">
                              {p.location}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                            <span className="text-[11px] text-charcoal-600">
                              {p.area} sq.ft {p.bedrooms ? `• ${p.bedrooms} BHK` : ''}
                            </span>
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="text-xs text-champagne-800 font-bold hover:underline cursor-pointer"
                            >
                              Edit →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: AVAILABLE PROPERTIES ONLY */}
          {activeTab === 'available' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                      Publicly Active
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                    Available Listings ({availableProperties.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                    These properties are currently visible to prospective buyers on the live website.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="py-2 px-3.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Property</span>
                  </button>
                </div>
              </div>

              {availableProperties.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-sand-200 space-y-3 shadow-sm">
                  <Building className="w-10 h-10 text-charcoal-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No properties marked Available.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    Add new properties or change status of existing properties in "Manage Properties" to publish them.
                  </p>
                  <button
                    onClick={() => {
                      resetPropertyForm();
                      setActiveTab('add');
                    }}
                    className="px-4 py-2 rounded-xl bg-charcoal-900 text-champagne-300 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-800 transition-colors cursor-pointer"
                  >
                    Create First Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableProperties.map((p) => (
                    <div 
                      key={p.id}
                      className="rounded-2xl border border-sand-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-44 bg-charcoal-900">
                        <img 
                          src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'} 
                          alt={p.title} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          Available
                        </span>
                        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-charcoal-950/85 backdrop-blur-sm text-champagne-300 text-xs font-bold shadow">
                          {p.price}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-champagne-800 uppercase tracking-wider">
                            {p.propertyType} • {p.sector}
                          </span>
                          <h4 className="font-serif font-bold text-charcoal-900 text-sm mt-0.5">
                            {p.title}
                          </h4>
                          <p className="text-xs text-charcoal-500 line-clamp-1 mt-0.5">
                            {p.location}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
                          <select
                            value={p.listingStatus}
                            onChange={(e) => handleQuickStatusChange(p.id, e.target.value as ListingStatus)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-medium focus:outline-none"
                          >
                            <option value="Available">Available</option>
                            <option value="Sold">Mark Sold</option>
                            <option value="Rented">Mark Rented</option>
                            <option value="Unavailable">Take Offline</option>
                          </select>

                          <button
                            onClick={() => handleStartEdit(p)}
                            className="px-3 py-1 rounded-lg border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
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
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                  {editingPropertyId ? 'Edit Property Details' : 'Add New Property Listing'}
                </h2>
                <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                  Add genuine property specifications. Listings saved here will sync to Supabase and immediately appear on the live website.
                </p>
              </div>

              <form onSubmit={handleSaveProperty} className="p-6 sm:p-8 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-6">
                
                {/* Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Property Headline / Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Luxury 4 BHK Builder Floor in Sushant Lok 2"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Property Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formPropertyType}
                      onChange={(e) => setFormPropertyType(e.target.value as PropertyType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Available">Available (Visible to Public)</option>
                      <option value="Sold">Sold (Marked Sold)</option>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      placeholder="e.g. ₹ 2.50 Cr"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Property Description & Key Highlights
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about structural quality, lift, flooring, ventilation, registration status, etc."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500 resize-none"
                  ></textarea>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lift, Gated Security, 100% Power Backup, Covered Parking, Vastu Compliant"
                    value={formAmenitiesText}
                    onChange={(e) => setFormAmenitiesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                      placeholder="Enter direct image URL..."
                      value={formImageUrlInput}
                      onChange={(e) => setFormImageUrlInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
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
                    <span className="text-xs text-charcoal-500">Or upload local image:</span>
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
                    Feature this listing prominently on the homepage
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-sand-200 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Saving to Database...' : editingPropertyId ? 'Save & Update Property' : 'Publish Property to Website'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('manage')}
                    className="px-4 py-2.5 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-sand-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 4: MANAGE PROPERTIES (INTERACTIVE MANAGEMENT) */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                    Inventory Control
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                    Manage Properties ({filteredProperties.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                    Update listing status, modify pricing, upload photographs, or delete property listings.
                  </p>
                </div>

                <button
                  onClick={() => {
                    resetPropertyForm();
                    setActiveTab('add');
                  }}
                  className="py-2 px-3.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors self-start"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Property</span>
                </button>
              </div>

              {/* Search, Filter, Sort Toolbar */}
              <div className="p-3.5 rounded-2xl bg-white border border-sand-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Search */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, location, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-ivory-50/70 text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-charcoal-400 hover:text-charcoal-700 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-ivory-50/70 text-charcoal-900 focus:outline-none focus:border-champagne-500 font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="sm:col-span-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-ivory-50/70 text-charcoal-900 focus:outline-none focus:border-champagne-500 font-medium"
                  >
                    <option value="All">All Types</option>
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="sm:col-span-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-ivory-50/70 text-charcoal-900 focus:outline-none focus:border-champagne-500 font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                </div>

              </div>

              {/* Property Rows */}
              {filteredProperties.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-sand-200 text-charcoal-500 text-xs shadow-sm space-y-2">
                  <Building className="w-8 h-8 text-sand-300 mx-auto" />
                  <p>No properties match your active search or filter criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setCategoryFilter('All');
                    }}
                    className="text-xs text-champagne-700 font-bold hover:underline cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProperties.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 shadow-sm hover:shadow-md hover:border-sand-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                          alt={p.title}
                          className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0 border border-sand-200 shadow-sm"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              p.listingStatus === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                              p.listingStatus === 'Sold' ? 'bg-rose-100 text-rose-800' :
                              p.listingStatus === 'Rented' ? 'bg-blue-100 text-blue-800' : 'bg-sand-200 text-charcoal-700'
                            }`}>
                              {p.listingStatus}
                            </span>
                            <span className="text-[11px] text-charcoal-500 font-medium">
                              {p.propertyType} • {p.sector} • {p.category === 'buy' ? 'Sale' : p.category === 'rent' ? 'Rent' : 'Commercial'}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-charcoal-900 text-sm truncate">
                            {p.title}
                          </h4>
                          <p className="text-xs text-champagne-800 font-semibold">
                            {p.price} • {p.area} sq.ft {p.bedrooms ? `• ${p.bedrooms} BHK` : ''}
                          </p>
                          <p className="text-[11px] text-charcoal-500 truncate">
                            {p.location}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                        <select
                          value={p.listingStatus}
                          onChange={(e) => handleQuickStatusChange(p.id, e.target.value as ListingStatus)}
                          className="px-2.5 py-1.5 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-medium focus:outline-none"
                        >
                          <option value="Available">Available</option>
                          <option value="Sold">Sold</option>
                          <option value="Rented">Rented</option>
                          <option value="Unavailable">Unavailable</option>
                        </select>

                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => setDeleteModalProp(p)}
                          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
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
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                    Site Visit Requests ({siteVisits.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                    Manage appointments scheduled by buyers. Confirm, reschedule, complete, or cancel requests.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={visitStatusFilter}
                    onChange={(e) => setVisitStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-white text-charcoal-800 font-semibold focus:outline-none shadow-sm"
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

              {siteVisits.filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter).length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-sand-200 space-y-2 shadow-sm">
                  <Calendar className="w-10 h-10 text-sand-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No site visits found.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    When visitors click "Schedule a Visit" on the website, their appointment requests will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {siteVisits
                    .filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter)
                    .map((v) => {
                      const cleanPhone = v.phone.replace(/[^0-9]/g, '');
                      return (
                        <div
                          key={v.id}
                          className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:shadow transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                            <div>
                              <span className="font-serif font-bold text-charcoal-900 text-base">{v.customerName}</span>
                              <span className="text-xs text-charcoal-500 ml-2">Phone: {v.phone}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider self-start sm:self-center ${
                              v.status === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                              v.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                              v.status === 'Rescheduled' ? 'bg-blue-100 text-blue-900' :
                              v.status === 'Completed' ? 'bg-slate-100 text-slate-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {v.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-charcoal-700">
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Property</span>
                              <span className="font-semibold text-charcoal-900">{v.propertyTitle || 'General Site Visit'}</span>
                            </div>
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Scheduled Time</span>
                              <span className="font-semibold text-charcoal-900">📅 {v.preferredDate} ({v.preferredTime})</span>
                            </div>
                            <div>
                              <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Notes</span>
                              <span className="text-charcoal-600">{v.notes || 'No notes provided.'}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-sand-100">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${v.phone}`}
                                className="px-3 py-1.5 rounded-lg border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-champagne-700" />
                                <span>Call Customer</span>
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${v.customerName}! Your site visit request with Guruji Property Gurugram on ${v.preferredDate} (${v.preferredTime}) for "${v.propertyTitle || 'Property'}" is confirmed. Please call 084471 95227 for directions.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Send WhatsApp</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <select
                                value={v.status}
                                onChange={(e) => handleSiteVisitStatusChange(v.id, e.target.value as SiteVisitStatus)}
                                className="px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-medium focus:outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Mark Confirmed</option>
                                <option value="Rescheduled">Reschedule...</option>
                                <option value="Completed">Mark Completed</option>
                                <option value="Cancelled">Cancel Visit</option>
                              </select>

                              <button
                                onClick={() => {
                                  setRescheduleModalVisit(v);
                                  setRescheduleDate(v.preferredDate);
                                  setRescheduleTime(v.preferredTime);
                                  setRescheduleNotes('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-sand-300 hover:bg-sand-50 text-charcoal-700 text-xs font-medium cursor-pointer"
                              >
                                Reschedule
                              </button>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-champagne-700 block mb-1">
                    Direct Leads
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                    Customer Enquiries ({enquiries.length})
                  </h2>
                  <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                    Consultation requests submitted by potential buyers and tenants.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-sand-300 bg-white text-charcoal-800 font-semibold focus:outline-none shadow-sm"
                  >
                    <option value="All">All Enquiries</option>
                    <option value="New">New Only</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {enquiries.filter(e => enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter).length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-sand-200 space-y-2 shadow-sm">
                  <Mail className="w-10 h-10 text-sand-300 mx-auto" />
                  <h3 className="font-serif font-bold text-charcoal-900 text-base">No enquiries found.</h3>
                  <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                    Direct leads from website visitors will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {enquiries
                    .filter(e => enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter)
                    .map((enq) => {
                      const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                      return (
                        <div
                          key={enq.id}
                          className="p-5 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-3 hover:shadow transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
                            <div>
                              <span className="font-serif font-bold text-charcoal-900 text-base">{enq.customerName}</span>
                              <span className="text-xs text-charcoal-500 ml-2">Phone: {enq.phone} {enq.email ? `• ${enq.email}` : ''}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider self-start sm:self-center ${
                              enq.status === 'New' ? 'bg-champagne-100 text-champagne-900 border border-champagne-200' :
                              enq.status === 'Contacted' ? 'bg-blue-100 text-blue-900' :
                              'bg-sand-200 text-charcoal-700'
                            }`}>
                              {enq.status}
                            </span>
                          </div>

                          <div className="text-xs text-charcoal-700 space-y-1">
                            <span className="text-charcoal-400 block text-[10px] uppercase font-bold">Property / Subject</span>
                            <span className="font-semibold text-charcoal-900">{enq.propertyTitle || 'General Real Estate Consultation'}</span>
                            {enq.message && (
                              <p className="mt-1 p-2.5 rounded-xl bg-ivory-50 border border-sand-200 text-charcoal-700">
                                "{enq.message}"
                              </p>
                            )}
                          </div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-sand-100">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${enq.phone}`}
                                className="px-3 py-1.5 rounded-lg border border-sand-300 hover:bg-sand-50 text-charcoal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-champagne-700" />
                                <span>Call Lead</span>
                              </a>
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.customerName}, thank you for enquiring with Guruji Property Gurugram regarding ${enq.propertyTitle || 'properties in Sector 57, Gurugram'}. How can we assist you today?`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>

                            <select
                              value={enq.status}
                              onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as EnquiryStatus)}
                              className="px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-ivory-50 text-charcoal-800 font-medium focus:outline-none"
                            >
                              <option value="New">Mark New</option>
                              <option value="Contacted">Mark Contacted</option>
                              <option value="Closed">Mark Closed</option>
                            </select>
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
                  Agency Profile
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-charcoal-900">
                  Business Settings & Office Info
                </h2>
                <p className="text-xs text-charcoal-600 mt-0.5 font-light">
                  Manage agency name, office address, hotline numbers, and operating schedule.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-5">
                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Agency Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessSettings.businessName}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Contact Hotline Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.phone}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Official WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.whatsapp}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                    Physical Office Address
                  </label>
                  <input
                    type="text"
                    required
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Business Operating Hours
                    </label>
                    <input
                      type="text"
                      required
                      value={businessSettings.hours}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, hours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-800 block mb-1.5">
                      Google Maps URL
                    </label>
                    <input
                      type="text"
                      value={businessSettings.googleMapsUrl || ''}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, googleMapsUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-ivory-50/70 text-xs text-charcoal-900 focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-sand-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Save Business Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* CUSTOM CONFIRMATION MODAL FOR DELETING PROPERTY */}
      {deleteModalProp && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-sand-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-charcoal-950 text-base">
                Delete Property Listing?
              </h3>
              <p className="text-xs text-charcoal-600">
                Are you sure you want to delete <span className="font-bold text-charcoal-900">"{deleteModalProp.title}"</span>? This will permanently remove it from both Supabase and the live website.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProp(null)}
                className="flex-1 py-2.5 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-sand-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProperty}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE SITE VISIT MODAL */}
      {rescheduleModalVisit && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-sand-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="font-serif font-bold text-charcoal-950 text-sm">
                  Reschedule Site Visit
                </h3>
              </div>
              <button
                onClick={() => setRescheduleModalVisit(null)}
                className="text-charcoal-400 hover:text-charcoal-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3.5">
              <p className="text-xs text-charcoal-600">
                Rescheduling visit for <span className="font-bold">{rescheduleModalVisit.customerName}</span> ({rescheduleModalVisit.phone}).
              </p>

              <div>
                <label className="text-[11px] font-semibold text-charcoal-700 block mb-1">
                  New Preferred Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-charcoal-700 block mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
                >
                  <option value="10:00 AM">10:00 AM - Morning Slot</option>
                  <option value="11:30 AM">11:30 AM - Morning Slot</option>
                  <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                  <option value="04:00 PM">04:00 PM - Evening Slot</option>
                  <option value="05:30 PM">05:30 PM - Sunset Slot</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-charcoal-700 block mb-1">
                  Reschedule Note / Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Buyer requested Sunday slot"
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-ivory-50 text-charcoal-900 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-sand-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalVisit(null)}
                  className="flex-1 py-2 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-sand-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-champagne-500 hover:bg-champagne-600 text-charcoal-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
