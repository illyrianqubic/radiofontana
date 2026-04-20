'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Ju lutem shkruani një email të vlefshëm.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e63946]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#e63946]/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#e63946]" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Qëndro i Informuar</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Abonohu tek buletini ynë ditor dhe merr lajmet kryesore nga Peja dhe Kosova.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-xl font-semibold text-white">Faleminderit!</p>
              <p className="text-slate-400 text-sm">Do të marrësh buletinin tonë së shpejti.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Emaili juaj..."
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#e63946]/40 focus:border-[#e63946]/50 text-sm transition-all"
                />
                {error && <p className="text-red-400 text-xs mt-1.5 text-left">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#e63946] hover:bg-[#d32f3f] text-white rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-[#e63946]/20"
              >
                Abonohu
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-slate-600 text-xs mt-6">
          Nuk dërgojmë spam. Mund të çabonohesh në çdo kohë.
        </p>
      </div>
    </section>
  );
}
