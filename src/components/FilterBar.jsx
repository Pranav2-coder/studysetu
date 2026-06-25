import { categories, areas, allSubjects, budgetRanges } from '../lib/seedData';

export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (key) => (e) => {
    onFilterChange({ ...filters, [key]: e.target.value });
  };

  const hasActiveFilters =
    filters.category || filters.area || filters.subject || filters.budgetRange;

  const clearFilters = () => {
    onFilterChange({ category: '', area: '', subject: '', budgetRange: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 md:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category */}
        <select
          className="form-input form-select"
          value={filters.category}
          onChange={handleChange('category')}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Area */}
        <select
          className="form-input form-select"
          value={filters.area}
          onChange={handleChange('area')}
          aria-label="Filter by area"
        >
          <option value="">All Areas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          className="form-input form-select"
          value={filters.subject}
          onChange={handleChange('subject')}
          aria-label="Filter by subject"
        >
          <option value="">All Subjects</option>
          {allSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Budget */}
        <select
          className="form-input form-select"
          value={filters.budgetRange}
          onChange={handleChange('budgetRange')}
          aria-label="Filter by budget"
        >
          <option value="">Any Budget</option>
          {budgetRanges.map((b) => (
            <option key={b.label} value={b.label}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-accent font-semibold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
