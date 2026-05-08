import { motion } from 'framer-motion';

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((filter) => (
        <motion.button
          key={filter}
          onClick={() => onFilterChange(filter)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
            activeFilter === filter
              ? 'border-primary-300/60 bg-primary-500/30 text-white shadow-[0_6px_18px_rgba(59,130,246,0.25)]'
              : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
          }`}
        >
          {filter}
        </motion.button>
      ))}
    </div>
  );
};

export default FilterChips;