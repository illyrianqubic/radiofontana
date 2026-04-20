'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

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
    <section className="bg-gradient-to-r from-[#1a3a6b] to-[#2563eb] text-white py-14 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Qëndro i Informuar</h2>
        <p className="text-blue-100 mb-8">
          Abonohu tek buletini ynë ditor dhe merr lajmet kryesore nga Peja dhe Kosova.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-xl font-semibold">Faleminderit për abonimin!</p>
              <p className="text-blue-200 text-sm">Do të marrësh buletinin tonë së shpejti.</p>
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
                  className="w-full px-4 py-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/60 text-sm"
                />
                {error && <p className="text-red-300 text-xs mt-1 text-left">{error}</p>}
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#1a3a6b] rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Abonohu
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-blue-300 text-xs mt-5">
          Nuk dërgojmë spam. Mund të çabonohesh në çdo kohë.
        </p>
      </div>
    </section>
  );
}
