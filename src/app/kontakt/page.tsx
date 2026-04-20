'use client';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span>Kryefaqja</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Kontakt</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-red-600 rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Na Kontaktoni</h1>
        </div>
        <p className="text-slate-500 text-base">
          Jemi gjithmonë të gatshëm të dëgjojmë nga ju. Dërgoni mesazhin tuaj dhe do t&apos;ju përgjigjemi sa më shpejt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-[#e63946]" />,
              label: 'Adresa',
              value: 'Rruga "Ibrahim Rugova" Nr. 56\nPejë, Kosovë',
            },
            {
              icon: <Phone className="w-5 h-5 text-[#e63946]" />,
              label: 'Telefon',
              value: '+383 44 150 027\n+383 44 141 294',
            },
            {
              icon: <Mail className="w-5 h-5 text-[#e63946]" />,
              label: 'Email',
              value: 'rtvfontana@gmail.com',
            },
            {
              icon: <Clock className="w-5 h-5 text-[#e63946]" />,
              label: 'Orari i Punës',
              value: 'E Hënë – E Premte\n08:00 – 17:00',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-[#e63946]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-1">
                  {item.label}
                </p>
                <p className="text-slate-700 text-sm font-medium whitespace-pre-line">
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="p-5 bg-[#e63946] rounded-2xl text-white">
            <p className="font-bold text-sm mb-3">Na Ndiqni</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.facebook.com/rtvfontanalive" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-[#1877F2] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200">
                <FacebookIcon className="w-4 h-4" /> Facebook
              </a>
              <a href="https://www.instagram.com/rtvfontana/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-pink-600 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200">
                <InstagramIcon className="w-4 h-4" /> Instagram
              </a>
              <a href="https://www.youtube.com/@RTVFontana" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-red-800 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200">
                <YoutubeIcon className="w-4 h-4" /> YouTube
              </a>
            </div>
          </div>

          {/* Radio frequencies */}
          <div className="p-5 bg-white rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-[#e63946]" />
              <p className="font-bold text-slate-800 text-sm">Frekuencat</p>
            </div>
            <div className="space-y-2.5">
              {[
                { location: 'Pejë', freq: '98.8 FM' },
              ].map((f) => (
                <div key={f.location} className="flex justify-between text-sm">
                  <span className="text-slate-400">{f.location}</span>
                  <span className="font-semibold text-[#e63946]">{f.freq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#e63946] px-7 py-5 text-white">
              <h2 className="font-bold text-lg">Dërgoni Mesazh</h2>
              <p className="text-white/70 text-sm">Do t&apos;ju përgjigjemi brenda 24 orëve.</p>
            </div>

            <div className="p-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-14"
                  >
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Mesazhi u dërgua!
                    </h3>
                    <p className="text-slate-400">
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
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Emri i Plotë <span className="text-[#e63946]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Arjeta Krasniqi"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Email <span className="text-[#e63946]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="email@jote.com"
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Subjekti
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-sm transition-all"
                      >
                        <option value="">Zgjidhni temën...</option>
                        <option value="info">Informacion i Përgjithshëm</option>
                        <option value="ads">Reklamat &amp; Sponsorimet</option>
                        <option value="news">Dërgim Lajmi</option>
                        <option value="request">Kërkesë Muzikore</option>
                        <option value="feedback">Koment &amp; Sugjerim</option>
                        <option value="other">Tjetër</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Mesazhi <span className="text-[#e63946]">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Shkruani mesazhin tuaj këtu..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/30 focus:border-[#e63946] text-sm resize-none transition-all"
                      />
                    </div>

                    {error && (
                      <p className="text-[#e63946] text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#e63946] hover:bg-[#d32f3f] text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#e63946]/20 hover:shadow-xl hover:shadow-[#e63946]/25"
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
      <div className="mt-10 h-64 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200">
        <div className="text-center text-slate-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-[#e63946]" />
          <p className="font-semibold text-slate-600">Radio Fontana</p>
          <p className="text-sm">Rruga &quot;Ibrahim Rugova&quot; Nr. 56, Pejë</p>
        </div>
      </div>
    </div>
  );
}
