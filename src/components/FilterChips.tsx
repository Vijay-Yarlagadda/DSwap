import { motion } from 'framer-motion';

interface FilterChipsProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterChips = ({ filters, activeFilter, onFilterChange }: FilterChipsProps) => {
  return (
    <motion.div
      className="flex space-x-3 overflow-x-auto pb-3 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative"
      initial={{ opacity: 0, y: 12 }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/35 focus:ring-offset-2 focus:ring-offset-slate-950 ${isActive ? 'text-white' : 'text-slate-300'}`}
          >
            <span className="absolute inset-0 rounded-full bg-slate-900/70 shadow-[0_18px_40px_rgba(14,165,233,0.12)]" />
            {isActive && (
              <motion.span
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/80 via-blue-500/80 to-cyan-400/70"
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              />
            )}
            {isActive && (
              <motion.span
                className="absolute inset-0 rounded-full bg-white/10"
                animate={{ opacity: [0.6, 0.85, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 px-1">
              <span className={`${isActive ? 'block' : 'hidden'} h-2.5 w-2.5 rounded-full bg-sky-300/90 shadow-[0_0_18px_rgba(56,189,248,0.25)]`} />
              <span>{filter}</span>
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FilterChips;
