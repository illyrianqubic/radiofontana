'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Radio } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Ju lutem plotësoni të gjitha fushat e detyrueshme.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Kryefaqja</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Kontakt</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white section-title mb-2">Na Kontaktoni</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Jemi gjithmonë të gatshëm të dëgjojmë nga ju. Dërgoni mesazhin tuaj dhe do t&apos;ju përgjigjemi sa më shpejt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          {/* Info cards */}
          {[
            {
              icon: <MapPin className="w-5 h-5 text-[#1a3a6b] dark:text-blue-400" />,
              label: 'Adresa',
              value: 'Rr. Mbretëresha Teuta, Nr. 15\nPejë 30000, Kosovë',
            },
            {
              icon: <Phone className="w-5 h-5 text-[#1a3a6b] dark:text-blue-400" />,
              label: 'Telefon',
              value: '+383 39 123 456',
            },
            {
              icon: <Mail className="w-5 h-5 text-[#1a3a6b] dark:text-blue-400" />,
              label: 'Email',
              value: 'info@radiofontana.com',
            },
            {
              icon: <Clock className="w-5 h-5 text-[#1a3a6b] dark:text-blue-400" />,
              label: 'Orari i Punës',
              value: 'E Hënë – E Premte\n08:00 – 17:00',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-gray-900 dark:text-white text-sm font-medium whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="p-4 bg-[#1a3a6b] rounded-xl text-white">
            <p className="font-bold mb-3">Na Ndiqni</p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm transition-colors">
                <FacebookIcon className="w-4 h-4" /> Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-pink-600 px-3 py-2 rounded-lg text-sm transition-colors">
                <InstagramIcon className="w-4 h-4" /> Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-red-600 px-3 py-2 rounded-lg text-sm transition-colors">
                <YoutubeIcon className="w-4 h-4" /> YouTube
              </a>
            </div>
          </div>

          {/* Radio frequencies */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-[#1a3a6b] dark:text-blue-400" />
              <p className="font-bold text-gray-900 dark:text-white text-sm">Frekuencat</p>
            </div>
            <div className="space-y-2">
              {[
                { location: 'Pejë', freq: '96.5 FM' },
                { location: 'Deçan', freq: '97.2 FM' },
                { location: 'Gjakovë', freq: '98.1 FM' },
              ].map((f) => (
                <div key={f.location} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{f.location}</span>
                  <span className="font-semibold text-[#1a3a6b] dark:text-blue-400">{f.freq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-[#1a3a6b] px-6 py-4 text-white">
              <h2 className="font-bold text-lg">Dërgoni Mesazh</h2>
              <p className="text-blue-200 text-sm">Do t&apos;ju përgjigjemi brenda 24 orëve.</p>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Mesazhi u dërgua!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Faleminderit që na kontaktuat. Do t&apos;ju përgjigjemi sa më shpejt të jetë e mundur.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Emri i Plotë <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Arjeta Krasniqi"
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="email@jote.com"
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Subjekti
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-sm"
                      >
                        <option value="">Zgjidhni temën...</option>
                        <option value="info">Informacion i Përgjithshëm</option>
                        <option value="ads">Reklamat & Sponsorimet</option>
                        <option value="news">Dërgim Lajmi</option>
                        <option value="request">Kërkesë Muzikore</option>
                        <option value="feedback">Koment & Sugjerim</option>
                        <option value="other">Tjetër</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Mesazhi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Shkruani mesazhin tuaj këtu..."
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-sm resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-[#1a3a6b] hover:bg-[#0f2347] text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      Dërgo Mesazhin
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-8 h-64 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MapPin className="w-10 h-10 mx-auto mb-2 text-[#1a3a6b] dark:text-blue-400" />
          <p className="font-semibold">Radio Fontana</p>
          <p className="text-sm">Rr. Mbretëresha Teuta, Nr. 15, Pejë</p>
        </div>
      </div>
    </div>
  );
}
