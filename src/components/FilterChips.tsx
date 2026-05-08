interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? 'bg-primary-600 text-white'
              : 'bg-white text-primary-700 hover:bg-primary-50 border border-primary-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;