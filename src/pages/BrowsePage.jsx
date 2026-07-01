import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ArrowUpDown, ChevronDown } from 'lucide-react';
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

export default function BrowsePage() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      if (filters.area && inst.area !== filters.area) return false;
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

      {/* Sticky Compact Header */}
      <header className="sticky top-16 z-40 bg-bg/90 backdrop-glass px-4 pt-1 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* Location Selector */}
          <button aria-label="Select location" className="flex items-center gap-1.5 text-text hover:opacity-80 transition-opacity">
            <MapPin size={18} className="text-accent" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider leading-none">Your Location</span>
              <span className="text-sm font-bold flex items-center gap-1 leading-tight">
                Nagpur, MH <ChevronDown size={14} />
              </span>
            </div>
          </button>

          {/* Logo Centered (Optional in mobile, but good for branding) */}
          {/* <Link to="/" className="font-heading text-xl text-primary font-bold absolute left-1/2 -translate-x-1/2">
            StudySetu
          </Link> */}

        </div>

        {/* Apple Maps Style Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input
            id="search-input"
            aria-label="Search institute, course or area"
            type="text"
            className="w-full bg-white border border-border/50 rounded-2xl py-3.5 pl-10 pr-4 text-[15px] font-medium text-text placeholder:text-text-muted/70 shadow-[0_2px_12px_rgba(31,42,68,0.04)] focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all"
            placeholder="Search institute, course or area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="bg-bg min-h-screen pb-28 pt-2">
        <div className="container px-4">


          {/* Result Bar */}
          {!loading && (
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-lg font-heading text-primary">
                {results.length} <span className="text-text-muted font-sans text-[15px] font-medium">Institutes</span>
              </h2>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-sm font-semibold text-text hover:text-accent transition-colors">
                  <ArrowUpDown size={16} /> Sort
                </button>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <>
              {/* Results grid */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
                  {results.map((institute) => (
                    <InstituteCard key={institute.id} institute={institute} />
                  ))}
                </div>
              ) : (
                /* Premium Empty State */
                <div className="text-center py-16 px-6 bg-white rounded-[24px] border border-border/40 max-w-md mx-auto shadow-soft flex flex-col items-center mt-8">
                  <div className="w-24 h-24 bg-accent-light/30 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-accent" />
                  </div>
                  <h3 className="font-heading text-[22px] text-primary mb-2">
                    No institutes found
                  </h3>
                  <p className="text-text-muted text-[15px] max-w-sm mx-auto mb-8 leading-relaxed">
                    We couldn't find any institutes matching your current filters. Try exploring other areas or subjects.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: 'All', area: '', subject: '', budgetRange: '' });
                      setSearchQuery('');
                    }}
                    className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold shadow-soft active:scale-[0.98] transition-transform"
                  >
                    Clear All Filters
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
