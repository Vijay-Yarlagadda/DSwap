import { MessageCircle, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  name: string;
}

const ContactModal = ({ isOpen, onClose, phone, name }: ContactModalProps) => {
  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${phone}`;
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
              mass: 0.8,
              duration: 0.35,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-6 shadow-2xl backdrop-blur-xl transform-gpu"
            style={{ willChange: 'transform' }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">Contact {name}</h2>
                <p className="text-sm text-slate-400">{phone}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Contact Options */}
            <div className="space-y-3">
              {/* WhatsApp Option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="group relative w-full overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-teal-500/15 px-5 py-4 text-left transition duration-200 hover:border-green-500/60 hover:bg-gradient-to-r hover:from-green-500/25 hover:via-emerald-500/20 hover:to-teal-500/25 hover:shadow-[0_12px_32px_rgba(16,185,129,0.15)] transform-gpu"
                style={{ willChange: 'transform' }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 via-emerald-400/10 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-300">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-100">WhatsApp</p>
                    <p className="text-xs text-green-400/70">Send message on WhatsApp</p>
                  </div>
                </div>
              </motion.button>

              {/* Phone Call Option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePhoneCall}
                className="group relative w-full overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-blue-500/15 px-5 py-4 text-left transition duration-200 hover:border-sky-500/60 hover:bg-gradient-to-r hover:from-sky-500/25 hover:via-cyan-500/20 hover:to-blue-500/25 hover:shadow-[0_12px_32px_rgba(56,189,248,0.15)] transform-gpu"
                style={{ willChange: 'transform' }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/20 via-cyan-400/10 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sky-100">Phone Call</p>
                    <p className="text-xs text-sky-400/70">Make a phone call</p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Footer - Cancel Option */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
              onClick={onClose}
              className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-300 transition duration-200 hover:bg-white/10 hover:text-white transform-gpu"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
