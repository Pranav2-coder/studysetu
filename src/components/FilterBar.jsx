

// We map categories to standard chips, and add a few explicit ones based on requirements
const QUICK_FILTERS = [
  'All',
  'School Tuition',
  'JEE',
  'NEET',
  'Commerce',
  'Computer',
  'English Speaking',
  'Home Tuition'
];

export default function FilterBar({ filters, onFilterChange }) {
  const currentFilter = filters.category || 'All';

  const handleChipClick = (chipName) => {
    if (chipName === 'All') {
      onFilterChange({ ...filters, category: '' });
    } else {
      // Map back to standard category if needed, but for MVP let's assume it maps directly to category
      onFilterChange({ ...filters, category: chipName });
    }
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-2">
      <div className="flex items-center gap-2.5 whitespace-nowrap min-w-max pb-1">
        {QUICK_FILTERS.map((chip) => {
          const isSelected = currentFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border shadow-sm ${isSelected
                  ? 'bg-accent text-white border-accent shadow-[0_4px_12px_rgba(200,116,42,0.25)]'
                  : 'bg-white text-text-muted border-border/60 hover:border-border hover:bg-bg/50'
                }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </div>
  );
}
