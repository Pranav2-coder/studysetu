import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  PhoneCall,
  MessageSquare,
  Save,
  CheckCircle2,
  Building2,
  BarChart3,
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { getInstitutes, saveInstitute, deleteInstitute, getAnalytics } from '../lib/db';
import { SectionPreloader } from '../components/Preloader';

// Helper to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');         // Replace multiple - with single -
};

export default function AdminDashboard() {
  const [institutes, setInstitutes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, manage, analytics, form

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Tuition Classes',
    description: '',
    area: '',
    address: '',
    subjects: '',
    classesCovered: '',
    fees: '',
    timings: '',
    experience: '',
    phone: '',
    whatsapp: '',
    coverImage: '',
    galleryImages: '',
    featured: false,
    published: true
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Load Database and Analytics
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const instList = await getInstitutes();
      const analyticsRecords = await getAnalytics();
      setInstitutes(instList);
      setAnalytics(analyticsRecords || {});
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Merge institute with its analytics
  const getMetrics = (instId) => {
    const defaultMetrics = { views: 0, whatsappClicks: 0, callClicks: 0, qrScans: 0 };
    return analytics[instId] || defaultMetrics;
  };

  // Aggregated Stats
  const totalInstitutes = institutes.length;
  const totalViews = Object.values(analytics).reduce((sum, item) => sum + (item.views || 0), 0);
  const totalWhatsApp = Object.values(analytics).reduce((sum, item) => sum + (item.whatsappClicks || 0), 0);
  const totalCalls = Object.values(analytics).reduce((sum, item) => sum + (item.callClicks || 0), 0);

  // Form Handlers
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: val,
      // Auto-generate slug from name if not editing an existing listing
      slug: editingId ? prev.slug : slugify(val)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditClick = (inst) => {
    setEditingId(inst.id);
    setFormData({
      name: inst.name,
      slug: inst.slug,
      category: inst.category,
      description: inst.description || '',
      area: inst.area || '',
      address: inst.address || '',
      subjects: inst.subjects ? inst.subjects.join(', ') : '',
      classesCovered: inst.classesCovered ? inst.classesCovered.join(', ') : '',
      fees: inst.fees || '',
      timings: inst.timings || '',
      experience: inst.experience || '',
      phone: inst.phone || '',
      whatsapp: inst.whatsapp || '',
      coverImage: inst.coverImage || '',
      galleryImages: inst.images ? inst.images.join(', ') : '',
      featured: inst.featured || false,
      published: inst.published ?? true
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('form');
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Tuition Classes',
      description: '',
      area: '',
      address: '',
      subjects: '',
      classesCovered: '',
      fees: '',
      timings: '',
      experience: '',
      phone: '',
      whatsapp: '',
      coverImage: '',
      galleryImages: '',
      featured: false,
      published: true
    });
    setFormError('');
    setFormSuccess('');
    setActiveTab('form');
  };

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will delete the listing and its analytics permanently.`)) {
      await deleteInstitute(id);
      loadDashboardData();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Basic Validation
    if (!formData.name.trim()) return setFormError('Name is required');
    if (!formData.slug.trim()) return setFormError('Slug is required');
    if (!formData.area.trim()) return setFormError('Area is required');
    if (!formData.phone.trim()) return setFormError('Phone number is required');
    if (!formData.whatsapp.trim()) return setFormError('WhatsApp number is required');

    // Parse subjects and classes covered
    const parsedSubjects = formData.subjects
      ? formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const parsedClasses = formData.classesCovered
      ? formData.classesCovered.split(',').map(c => c.trim()).filter(Boolean)
      : [];
    const parsedGallery = formData.galleryImages
      ? formData.galleryImages.split(',').map(img => img.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      id: editingId || undefined,
      subjects: parsedSubjects,
      classesCovered: parsedClasses,
      images: parsedGallery
    };

    try {
      await saveInstitute(payload);
      setFormSuccess(editingId ? 'Listing updated successfully!' : 'New institute created successfully!');
      
      // Reload and redirect
      await loadDashboardData();
      setTimeout(() => {
        setActiveTab('manage');
      }, 1200);
    } catch (err) {
      setFormError('Failed to save listing: ' + err.message);
    }
  };

  // Analytics Ranker (Sort by views desc)
  const rankedInstitutes = [...institutes].sort((a, b) => {
    const viewsA = getMetrics(a.id).views || 0;
    const viewsB = getMetrics(b.id).views || 0;
    return viewsB - viewsA;
  });

  return (
    <>
      <SEOHead title="Founder Admin Dashboard — StudySetu" />

      <div className="min-h-screen bg-bg py-8">
        <div className="container max-w-6xl px-4">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl text-primary flex items-center gap-2.5">
                <Building2 className="text-accent" size={32} />
                Founder Dashboard
              </h1>
              <p className="text-sm text-text-muted mt-1 font-body">
                Internal management console for listing verification and analytics tracking.
              </p>
            </div>
            
            {activeTab !== 'form' && (
              <button
                type="button"
                onClick={handleAddNewClick}
                className="btn btn-accent inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Add New Institute
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border mb-8 overflow-x-auto gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'manage', label: 'Manage Listings', icon: Building2 },
              { id: 'analytics', label: 'Analytics Reports', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-muted hover:text-primary hover:border-border'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
            
            {activeTab === 'form' && (
              <button
                className="px-4 py-3 text-sm font-semibold border-b-2 border-accent text-accent flex items-center gap-2 whitespace-nowrap"
                disabled
              >
                <Edit size={16} />
                {editingId ? 'Edit Listing' : 'Create Listing'}
              </button>
            )}
          </div>

          {/* Loading Vibe */}
          {loading && activeTab !== 'form' ? (
            <div className="bg-white rounded-2xl border border-border/40 min-h-[300px]">
              <SectionPreloader message="Fetching database metrics..." />
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* ==================== OVERVIEW TAB ==================== */}
              {activeTab === 'overview' && (
                <>
                  {/* Aggregated Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Institutes', value: totalInstitutes, icon: Building2, color: 'text-primary bg-primary/10' },
                      { label: 'Profile Views', value: totalViews, icon: TrendingUp, color: 'text-accent bg-accent-light/75' },
                      { label: 'WhatsApp Clicks', value: totalWhatsApp, icon: MessageSquare, color: 'text-emerald-700 bg-emerald-100' },
                      { label: 'Call Clicks', value: totalCalls, icon: PhoneCall, color: 'text-indigo-700 bg-indigo-100' }
                    ].map((stat, i) => (
                      <div key={i} className="card p-5 bg-white flex items-center gap-4 border border-border/40">
                        <div className={`p-3.5 rounded-xl ${stat.color} flex-shrink-0`}>
                          <stat.icon size={22} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</h4>
                          <p className="font-heading text-2xl text-primary font-bold mt-1">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Performers Preview */}
                  <div className="card p-6 bg-white border-border/45">
                    <h3 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-accent" />
                      Top Performing Institutes
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border/60 text-xs text-text-muted uppercase tracking-wider font-bold">
                            <th className="pb-3 font-semibold">Institute Name</th>
                            <th className="pb-3 font-semibold">Category</th>
                            <th className="pb-3 font-semibold text-right">Views</th>
                            <th className="pb-3 font-semibold text-right">WhatsApp Clicks</th>
                            <th className="pb-3 font-semibold text-right">Call Clicks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-sm">
                          {rankedInstitutes.slice(0, 5).map((inst) => {
                            const metrics = getMetrics(inst.id);
                            return (
                              <tr key={inst.id} className="hover:bg-bg/25">
                                <td className="py-3 font-semibold text-primary">{inst.name}</td>
                                <td className="py-3 text-text-muted">{inst.category}</td>
                                <td className="py-3 text-right font-bold text-primary">{metrics.views}</td>
                                <td className="py-3 text-right text-emerald-700 font-semibold">{metrics.whatsappClicks}</td>
                                <td className="py-3 text-right text-indigo-700 font-semibold">{metrics.callClicks}</td>
                              </tr>
                            );
                          })}
                          {rankedInstitutes.length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-6 text-center text-text-muted italic">No listing data available. Add some institutes to see analytics.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ==================== MANAGE LISTINGS TAB ==================== */}
              {activeTab === 'manage' && (
                <div className="card bg-white border-border/45 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-heading text-lg text-primary">All Registered Listings</h3>
                    <span className="text-xs bg-surface text-text font-semibold px-3 py-1 rounded-full">
                      {totalInstitutes} Listings
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 text-xs text-text-muted uppercase tracking-wider font-bold">
                          <th className="pb-3 font-semibold">Name</th>
                          <th className="pb-3 font-semibold">Category</th>
                          <th className="pb-3 font-semibold">Area</th>
                          <th className="pb-3 font-semibold text-center">Status</th>
                          <th className="pb-3 font-semibold text-right">Views</th>
                          <th className="pb-3 font-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-sm">
                        {institutes.map((inst) => {
                          const metrics = getMetrics(inst.id);
                          const isPub = inst.published ?? true;
                          return (
                            <tr key={inst.id} className="hover:bg-bg/25">
                              <td className="py-3">
                                <span className="font-semibold text-primary block">{inst.name}</span>
                                <span className="text-[10px] text-text-muted font-mono">{inst.slug}</span>
                              </td>
                              <td className="py-3 text-text-muted">{inst.category}</td>
                              <td className="py-3 font-medium text-text">{inst.area}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isPub ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {isPub ? <Eye size={10} /> : <EyeOff size={10} />}
                                  {isPub ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="py-3 text-right font-bold text-primary">{metrics.views}</td>
                              <td className="py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <a
                                    href={`/institutes/${inst.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-surface transition-colors"
                                    title="View Public Profile"
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                  <button
                                    onClick={() => handleEditClick(inst)}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                                    title="Edit Listing"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(inst.id, inst.name)}
                                    className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Listing"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {institutes.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-text-muted italic">No listings found. Get started by adding a new one!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== ANALYTICS REPORTS TAB ==================== */}
              {activeTab === 'analytics' && (
                <div className="card bg-white border-border/45 p-6">
                  <div className="mb-5">
                    <h3 className="font-heading text-lg text-primary">Performance Conversion Analysis</h3>
                    <p className="text-xs text-text-muted mt-0.5">Conversion rate equals (WhatsApp Clicks + Call Clicks) / Views. Also includes future-ready QR scan slots.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/60 text-xs text-text-muted uppercase tracking-wider font-bold">
                          <th className="pb-3 font-semibold">Institute Name</th>
                          <th className="pb-3 font-semibold text-right">Views</th>
                          <th className="pb-3 font-semibold text-right">WhatsApp</th>
                          <th className="pb-3 font-semibold text-right">Calls</th>
                          <th className="pb-3 font-semibold text-right">QR Scans</th>
                          <th className="pb-3 font-semibold text-right">Conversion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-sm">
                        {rankedInstitutes.map((inst) => {
                          const metrics = getMetrics(inst.id);
                          const totalInteractions = (metrics.whatsappClicks || 0) + (metrics.callClicks || 0);
                          const conversion = metrics.views > 0
                            ? ((totalInteractions / metrics.views) * 100).toFixed(1)
                            : '0.0';
                          return (
                            <tr key={inst.id} className="hover:bg-bg/25">
                              <td className="py-3">
                                <span className="font-semibold text-primary block">{inst.name}</span>
                                <span className="text-[10px] text-text-muted block">{inst.area} • {inst.category}</span>
                              </td>
                              <td className="py-3 text-right font-bold text-primary">{metrics.views}</td>
                              <td className="py-3 text-right text-emerald-700 font-semibold">{metrics.whatsappClicks || 0}</td>
                              <td className="py-3 text-right text-indigo-700 font-semibold">{metrics.callClicks || 0}</td>
                              <td className="py-3 text-right text-text-muted">{metrics.qrScans || 0} <span className="text-[9px] font-bold text-accent uppercase tracking-wider ml-1 bg-accent-light px-1.5 py-0.25 rounded">Future</span></td>
                              <td className="py-3 text-right">
                                <span className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${
                                  Number(conversion) >= 30
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : Number(conversion) >= 10
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-surface text-text-muted'
                                }`}>
                                  {conversion}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {institutes.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-text-muted italic">No analytics summaries available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== ADD/EDIT FORM VIEW ==================== */}
              {activeTab === 'form' && (
                <div className="card bg-white border-border/45 p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
                  <h3 className="font-heading text-xl text-primary mb-6 pb-2 border-b border-border/30 flex items-center gap-2">
                    <Edit size={22} className="text-accent" />
                    {editingId ? `Edit Listing: ${formData.name}` : 'Register New Institute'}
                  </h3>

                  {/* Form Messages */}
                  {formError && (
                    <div className="p-4 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="p-4 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      {formSuccess}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Institute Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleNameChange}
                          className="form-input"
                          placeholder="e.g. Sharma Classes"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">URL Slug *</label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="form-input font-mono text-xs"
                          placeholder="e.g. sharma-classes-nagpur"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="form-input form-select"
                        >
                          <option value="Tuition Classes">Tuition Classes</option>
                          <option value="Computer Classes">Computer Classes</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Experience Rating (Years) *</label>
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. 12 years"
                        />
                      </div>
                    </div>

                    {/* Detailed Metadata */}
                    <div className="form-group">
                      <label className="form-label">Short Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="form-input leading-relaxed"
                        placeholder="Sharma Classes has been a trusted name in Nagpur for..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Area (Neighborhood) *</label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. Dharampeth"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Fees Range *</label>
                        <input
                          type="text"
                          name="fees"
                          value={formData.fees}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. ₹2,500/month or ₹3,000/course"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g. Plot 23, Near Dharampeth High School, Nagpur 440010"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Subjects Taught (Comma Separated) *</label>
                        <input
                          type="text"
                          name="subjects"
                          value={formData.subjects}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. Mathematics, Science, Physics"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Classes Covered (Comma Separated) *</label>
                        <input
                          type="text"
                          name="classesCovered"
                          value={formData.classesCovered}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. 8th, 9th, 10th, JEE, NEET"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Class Timings / Schedule *</label>
                        <input
                          type="text"
                          name="timings"
                          value={formData.timings}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. Mon–Sat, 4:00 PM – 8:00 PM"
                        />
                      </div>

                      <div className="form-group flex-row gap-8 items-center pt-8">
                        <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-accent"
                          />
                          Feature on Home Page
                        </label>

                        <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                          <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-accent"
                          />
                          Publish Immediately
                        </label>
                      </div>
                    </div>

                    {/* Contact & Cover Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Phone Number (Call link) *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. 9371742672"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">WhatsApp Number (with Country Code) *</label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. 919371742672"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-group">
                        <label className="form-label">Cover Image URL (Optional)</label>
                        <input
                          type="text"
                          name="coverImage"
                          value={formData.coverImage}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="e.g. https://images.unsplash.com/..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Gallery Image URLs (Optional, Comma Separated)</label>
                        <input
                          type="text"
                          name="galleryImages"
                          value={formData.galleryImages}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="URL1, URL2, URL3"
                        />
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => setActiveTab('manage')}
                        className="btn btn-outline cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                        className="btn bg-surface text-primary border border-border cursor-pointer hover:bg-border"
                      >
                        Save Draft
                      </button>

                      <button
                        type="submit"
                        onClick={() => setFormData(prev => ({ ...prev, published: true }))}
                        className="btn btn-accent cursor-pointer"
                      >
                        <Save size={16} />
                        Publish Listing
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </>
  );
}
