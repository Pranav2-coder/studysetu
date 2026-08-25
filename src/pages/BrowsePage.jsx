import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import InstituteCard from '../components/InstituteCard';
import { SkeletonGrid } from '../components/Preloader';
import { getInstitutes } from '../lib/db';

const budgetRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
  { label: '₹5,000+', min: 5000, max: Infinity },
];

const nagpurAreas = [
  'All Areas',
  'Dharampeth',
  'Ramdaspeth',
  'Sadar',
  'Manewada',
  'Sitabuldi',
  'Nandanvan',
  'Medical Square',
  'Laxmi Nagar'
];

export default function BrowsePage() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Nagpur');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    area: '',
    subject: '',
    budgetRange: '',
  });

  useEffect(() => {
    async function loadBrowseData() {
      try {
        const list = await getInstitutes();
        setInstitutes(list.filter(inst => inst.published ?? true));
      } catch (err) {
        console.error('Error loading browse data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrowseData();
  }, []);

  const results = useMemo(() => {
    return institutes.filter(inst => {
      if (filters.category && filters.category !== 'All' && inst.category !== filters.category) return false;
      if (filters.area && filters.area !== 'All Areas' && inst.area !== filters.area) return false;
      if (filters.subject && !inst.subjects.includes(filters.subject)) return false;
      if (filters.budgetRange) {
        const range = budgetRanges.find(r => r.label === filters.budgetRange);
        if (range) {
          const val = inst.feesValue !== undefined ? inst.feesValue : (parseInt(inst.fees) || 0);
          if (val < range.min || val >= range.max) return false;
        }
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return inst.name.toLowerCase().includes(q) ||
          inst.subjects.some(s => s.toLowerCase().includes(q)) ||
          inst.area.toLowerCase().includes(q);
      }
      return true;
    });
  }, [institutes, filters, searchQuery]);

  const dynamicTitle = searchQuery 
    ? `Search Results for "${searchQuery}" — StudySetu`
    : filters.area 
    ? `Institutes in ${filters.area} — StudySetu` 
    : "Browse Institutes — StudySetu";

  return (
    <>
      <SEOHead 
        title={dynamicTitle} 
        description="Browse and compare tuition classes and computer training institutes in Nagpur." 
        url="/browse"
      />

      {/* Modern Ultra-Compact Sticky Search Header (Height reduced by >40%) */}
      <div className="sticky top-16 z-40 bg-[#F8FAFC]/90 backdrop-blur-md px-4 py-3 border-b border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.03)] animate-fade-in-up">
        <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
          {/* 52px Search Bar immediately below Navbar */}
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search size={20} strokeWidth={2.2} />
            </div>
            <input
              id="search-input"
              aria-label="Search institutes, courses..."
              type="text"
              className="w-full h-[52px] bg-white border border-slate-200 rounded-[16px] pl-12 pr-10 text-[15px] font-medium text-[#0F172A] placeholder:text-slate-400 shadow-[0_2px_10px_rgba(15,23,42,0.04)] focus:outline-none focus:border-[#F97316]/60 focus:ring-4 focus:ring-[#F97316]/10 transition-all"
              placeholder="Search institutes, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Compact Location Chip & Category Pills Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar py-0.5">
            <div className="flex items-center gap-2 shrink-0">
              {/* Location Pill: 📍 Nagpur ▼ */}
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#0F172A] shadow-xs hover:border-[#F97316]/40 hover:bg-orange-50/40 active:scale-95 transition-all cursor-pointer"
                aria-label="Change Location"
              >
                <span className="text-[#F97316] text-xs">📍</span>
                <span>{selectedArea}</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {/* Filter Area Pill if active */}
              {filters.area && filters.area !== 'All Areas' && (
                <span className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-xs font-bold text-[#F97316]">
                  {filters.area}
                  <button onClick={() => setFilters(prev => ({ ...prev, area: '' }))} className="hover:opacity-75">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            {/* Quick Category Selector Chips */}
            <div className="flex items-center gap-1.5 shrink-0">
              {['All', 'Tuition Classes', 'Computer Classes'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                  className={`h-8 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filters.category === cat
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Selector Dropdown Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowLocationPicker(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xs p-4 shadow-2xl border border-slate-100 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-1.5">
                <MapPin size={16} className="text-[#F97316]" /> Select Area in Nagpur
              </h3>
              <button onClick={() => setShowLocationPicker(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {nagpurAreas.map(area => (
                <button
                  key={area}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, area: area === 'All Areas' ? '' : area }));
                    setSelectedArea(area === 'All Areas' ? 'Nagpur' : area);
                    setShowLocationPicker(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    (filters.area === area || (area === 'All Areas' && !filters.area))
                      ? 'bg-[#F97316]/10 text-[#F97316] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Institute Listing Area */}
      <main className="bg-[#F8FAFC] min-h-screen pb-28 pt-3 animate-fade-in-up">
        <div className="max-w-4xl mx-auto px-4">

          {/* Results Summary Header */}
          {!loading && (
            <div className="flex items-center justify-between mb-3 px-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                  {results.length} <span className="text-slate-500 font-medium text-sm">Institutes Available</span>
                </h2>
              </div>
              
              {(searchQuery || filters.category !== 'All' || filters.area) && (
                <button
                  onClick={() => {
                    setFilters({ category: 'All', area: '', subject: '', budgetRange: '' });
                    setSearchQuery('');
                    setSelectedArea('Nagpur');
                  }}
                  className="text-xs font-semibold text-[#F97316] hover:underline"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Loading Skeleton or Cards */}
          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((institute) => (
                    <InstituteCard key={institute.id} institute={institute} />
                  ))}
                </div>
              ) : (
                /* Premium Empty State */
                <div className="text-center py-12 px-6 bg-white rounded-2xl border border-slate-200/80 max-w-sm mx-auto shadow-sm flex flex-col items-center my-6">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-[#F97316]">
                    <Search size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F172A] mb-1">
                    No institutes found
                  </h3>
                  <p className="text-slate-500 text-xs max-w-xs mb-6 leading-relaxed">
                    We couldn't find any listings matching your search. Try checking another area or subject.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: 'All', area: '', subject: '', budgetRange: '' });
                      setSearchQuery('');
                      setSelectedArea('Nagpur');
                    }}
                    className="w-full py-3 bg-[#0F172A] text-white rounded-xl text-xs font-bold shadow-sm active:scale-98 transition-transform cursor-pointer"
                  >
                    Show All Institutes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
