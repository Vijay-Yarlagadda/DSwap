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
          className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
            activeFilter === filter
              ? 'border-primary-300/60 bg-primary-500/25 text-white shadow-[0_18px_40px_rgba(59,130,246,0.15)]'
              : 'border-white/10 bg-slate-900/60 text-slate-200 hover:border-white/20 hover:bg-white/10'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;