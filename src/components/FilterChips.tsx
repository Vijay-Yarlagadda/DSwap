import { motion } from 'framer-motion';

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <motion.div 
      className="flex space-x-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {filters.map((filter, index) => (
        <motion.button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className={`group relative whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/30 overflow-hidden ${
            activeFilter === filter
              ? 'border-sky-400/40 bg-gradient-to-r from-sky-500/20 to-sky-600/10 text-white shadow-[0_8px_32px_rgba(14,116,144,0.25)] ring-1 ring-sky-400/30'
              : 'border-white/15 bg-slate-900/50 text-slate-300 hover:border-sky-400/40 hover:bg-slate-800/70 shadow-[0_4px_16px_rgba(15,23,42,0.3)]'
          }`}
        >
          {/* Floating glow effect */}
          <div className="pointer-events-none absolute -inset-0.5 rounded-full bg-gradient-to-r from-sky-400/20 via-sky-300/10 to-sky-400/20 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Animated inner gradient on active */}
          {activeFilter === filter && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/10 via-transparent to-sky-600/10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          <span className="relative">{filter}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default FilterChips;