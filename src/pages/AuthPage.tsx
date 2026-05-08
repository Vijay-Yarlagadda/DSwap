import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(96,165,250,0.25),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(14,116,144,0.25),transparent_40%)]" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay auth-noise" />

      <motion.div
        className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary-500/35 blur-[100px]"
        animate={{ x: [0, 45, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-cyan-400/30 blur-[120px]"
        animate={{ x: [0, -36, 0], y: [0, -22, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <motion.section
          className="relative flex flex-col justify-center overflow-hidden px-7 pb-10 pt-24 sm:px-12 lg:px-16"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <motion.div
            className="absolute left-20 top-24 h-36 w-36 rounded-full bg-primary-400/25 blur-3xl"
            animate={{ y: [0, -18, 0], opacity: [0.28, 0.45, 0.28] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-16 top-1/2 h-28 w-28 rounded-full bg-cyan-300/20 blur-3xl"
            animate={{ y: [0, 16, 0], x: [0, 8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />

          <div className="relative max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-200"
            >
              Campus finance network
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              DSwap
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.65 }}
              className="mt-6 max-w-lg text-lg text-slate-200 sm:text-xl"
            >
              Find nearby cash. Exchange instantly.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="mt-3 max-w-lg text-sm text-slate-300/90 sm:text-base"
            >
              Campus-based digital cash exchange with trusted peers and fast secure handoffs.
            </motion.p>
          </div>
        </motion.section>

        <motion.section
          className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <AuthForm />
        </motion.section>
      </div>
    </motion.div>
  );
};

export default AuthPage;