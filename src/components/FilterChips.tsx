import { motion } from 'framer-motion';

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <motion.div
      className="flex gap-3 py-2 overflow-x-auto thin-scrollbar pb-3 -mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter;

        return (
          <motion.button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04, duration: 0.16, ease: 'easeOut' }}
            whileHover={{ scale: 1.08, transition: { duration: 0.1, ease: 'easeOut' } }}
            whileTap={{ scale: 0.96, transition: { duration: 0.08, ease: 'easeOut' } }}
            className={`relative px-2 py-1.5 rounded-full text-base font-semibold transition-all duration-150 ${
              isActive ? 'text-sky-300' : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeFilterUnderline"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            )}
            <span>{filter}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FilterChips;
