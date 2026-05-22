import { motion } from 'framer-motion';

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
          <motion.button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: 0.15, 
              ease: 'easeOut'
            }}
            className={`relative px-3 py-1.5 rounded-full text-base font-semibold transition-colors duration-200 transform-gpu ${
              isActive
                ? 'text-sky-300'
                : 'text-slate-300 hover:text-slate-100'
            }`}
            style={{ willChange: 'color' }}
          >
            {filter}
            {isActive && (
              <motion.span
                layoutId="activeFilter"
                className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ willChange: 'opacity' }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterChips;
