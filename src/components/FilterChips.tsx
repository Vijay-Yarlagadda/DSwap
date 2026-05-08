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
          className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-200 ${
            activeFilter === filter
              ? 'border-sky-400/30 bg-slate-900 text-white shadow-[0_10px_30px_rgba(14,116,144,0.14)]'
              : 'border-white/10 bg-slate-900/70 text-slate-300 hover:border-slate-200/30 hover:bg-slate-800/90'
          } focus:outline-none focus:ring-2 focus:ring-sky-500/30`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;