interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <div className="flex gap-3 py-2 overflow-x-auto thin-scrollbar pb-3 -mb-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`relative px-3 py-1.5 rounded-full text-base font-semibold transition-colors duration-200 ${
              isActive
                ? 'text-sky-300'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            {filter}
            {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;
