import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import FilterBar from '../components/FilterBar';
import InstituteCard from '../components/InstituteCard';
import { SkeletonGrid } from '../components/Preloader';
import { getInstitutes } from '../lib/db';
import { Search } from 'lucide-react';

const budgetRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
  { label: '₹5,000+', min: 5000, max: Infinity },
];

export default function BrowsePage() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    area: '',
    subject: '',
    budgetRange: '',
  });

  useEffect(() => {
    async function loadBrowseData() {
      try {
        const list = await getInstitutes();
        // Only show published institutes to users
        setInstitutes(list.filter(inst => inst.published ?? true));
      } catch (err) {
        console.error('Error loading browse data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBrowseData();
  }, []);

  const results = institutes.filter(inst => {
    if (filters.category && inst.category !== filters.category) return false;
    if (filters.area && inst.area !== filters.area) return false;
    if (filters.subject && !inst.subjects.includes(filters.subject)) return false;
    if (filters.budgetRange) {
      const range = budgetRanges.find(r => r.label === filters.budgetRange);
      if (range) {
        const val = inst.feesValue !== undefined ? inst.feesValue : (parseInt(inst.fees) || 0);
        if (val < range.min || val >= range.max) return false;
      }
    }
    return true;
  });

  return (
    <>
      <SEOHead title="Browse Institutes — StudySetu Nagpur" />

      <section className="section bg-bg min-h-screen">
        <div className="container">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="section-title">Browse Institutes</h1>
            <p className="section-subtitle">
              Find the best tuition classes and computer training institutes near you in Nagpur.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Loading spinner */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-text-muted mb-5">
                Showing{' '}
                <span className="font-semibold text-text">{results.length}</span>{' '}
                of {institutes.length} published institutes
              </p>

              {/* Results grid */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((institute) => (
                    <InstituteCard key={institute.id} institute={institute} />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-16 bg-white rounded-2xl border border-border/40 max-w-2xl mx-auto shadow-sm">
                  <Search size={44} className="mx-auto text-text-muted/40 mb-4" />
                  <h3 className="font-heading text-lg text-primary mb-2">
                    No matching institutes found
                  </h3>
                  <p className="text-text-muted text-sm max-w-sm mx-auto px-4">
                    Try adjusting your filters (category, area, subject, or budget) to see more results.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
