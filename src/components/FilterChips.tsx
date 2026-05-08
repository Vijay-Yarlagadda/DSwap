interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
            activeFilter === filter
              ? 'border-primary-300 bg-slate-950/95 text-white'
              : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-white/20 hover:bg-white/10'
          } focus:outline-none focus:ring-2 focus:ring-primary-400/20 focus:ring-offset-2 focus:ring-offset-slate-950`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;