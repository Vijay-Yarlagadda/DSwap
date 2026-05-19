import { motion } from 'framer-motion';

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <motion.div 
      className="flex space-x-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
    >
      {filters.map((filter, index) => {
        const isActive = activeFilter === filter;
        
        return (
          <motion.button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/30 overflow-hidden ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            {/* Border for inactive items, hidden on active */}
            {!isActive && (
              <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-colors duration-300 bg-slate-900/50" />
            )}

            {/* Glowing dot for active item */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300/20 to-blue-400/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            
            <span className="relative z-10 flex items-center space-x-2">
              <span>{filter}</span>
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FilterChips;
