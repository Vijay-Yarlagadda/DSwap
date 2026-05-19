import { motion } from 'framer-motion';
import AuthForm from '../components/AuthForm';
import ParticleBackground from '../components/ParticleBackground';

const AuthPage = () => {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Smooth uniform background to prevent banding lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a1128] to-slate-950" />
      <ParticleBackground />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay auth-noise" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <motion.section
          className="relative flex flex-col justify-center overflow-hidden px-7 pb-10 pt-24 sm:px-12 lg:px-16"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
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