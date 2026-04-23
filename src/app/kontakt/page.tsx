'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Radio } from 'lucide-react';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from '@/components/shared/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputClassName =
    'w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-white/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e63946]/25 focus:border-[#e63946]/70 text-sm 2xl:text-base transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]';

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

  const contactCards = [
    {
      icon: <MapPin className="w-5 h-5 text-[#e63946]" />,
      label: 'Adresa',
      values: ['Rruga "Ibrahim Rugova" Nr. 56', 'Istog, Kosovë'],
    },
    {
      icon: <Phone className="w-5 h-5 text-[#e63946]" />,
      label: 'Telefon',
      values: ['+383 44 150 027', '+383 44 141 294'],
    },
    {
      icon: <Mail className="w-5 h-5 text-[#e63946]" />,
      label: 'Email',
      values: ['rtvfontana@gmail.com'],
    },
    {
      icon: <Clock className="w-5 h-5 text-[#e63946]" />,
      label: 'Orari i Punës',
      values: ['E Hënë - E Premte', '08:00 - 17:00'],
    },
  ];

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/rtvfontanalive',
      icon: <FacebookIcon className="w-5 h-5" />,
      className:
        'hover:bg-[#1877F2] hover:shadow-[0_12px_26px_rgba(24,119,242,0.35)]',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/rtvfontana/',
      icon: <InstagramIcon className="w-5 h-5" />,
      className:
        'hover:bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_75%,#515bd4_100%)] hover:shadow-[0_12px_26px_rgba(221,42,123,0.38)]',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@RTVFontana',
      icon: <YoutubeIcon className="w-5 h-5" />,
      className:
        'hover:bg-red-600 hover:shadow-[0_12px_26px_rgba(220,38,38,0.35)]',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@rtvfontanalive',
      icon: <TiktokIcon className="w-5 h-5" />,
      className:
        'hover:bg-black hover:shadow-[0_12px_26px_rgba(15,23,42,0.36)]',
    },
  ];

  return (
    <div className="site-container py-7 sm:py-10 2xl:py-12 page-shell">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 sm:px-7 lg:px-10 py-7 sm:py-9 lg:py-10 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#e63946]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-slate-900/5 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <span>Kryefaqja</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">Kontakt</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e63946]/20 bg-[#e63946]/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#c01f31] mb-4">
                Studio & Redaksi
              </div>
              <h1 className="text-3xl sm:text-4xl 2xl:text-[2.8rem] leading-tight font-extrabold text-slate-900 mb-4">
                Na Kontaktoni me Besim
              </h1>
              <p className="max-w-2xl text-slate-600 text-base sm:text-lg leading-relaxed">
                Për pyetje, reklama, dërgim lajmesh apo sugjerime për programin, ekipi ynë është i gatshëm të përgjigjet shpejt dhe qartë.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#e63946] shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-400">Telefon</p>
                    <p className="text-sm font-semibold text-slate-800">+383 44 150 027</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#e63946] shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] font-extrabold text-slate-400">Email</p>
                    <p className="text-sm font-semibold text-slate-800">rtvfontana@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 mb-3">Shërbim Profesional</p>
              <div className="space-y-3.5">
                <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">Përgjigje brenda 24 orëve</p>
                  <p className="text-xs text-slate-500 mt-1">Mesazhet trajtohen nga redaksia dhe administrata.</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">Komunikim i qartë</p>
                  <p className="text-xs text-slate-500 mt-1">Do të merrni përgjigje të detajuar për secilën kërkesë.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8 2xl:gap-10">
        <aside className="xl:col-span-4 space-y-4 2xl:space-y-5">
          {contactCards.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#e63946]/6 blur-2xl" />
              <div className="relative flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#e63946]/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.16em] mb-1.5">
                    {item.label}
                  </p>
                  <div className="space-y-0.5">
                    {item.values.map((line) => (
                      <p key={line} className="text-slate-700 text-sm font-semibold">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="relative overflow-hidden rounded-2xl border border-[#e63946]/25 bg-[#e63946] p-5 text-white shadow-[0_14px_34px_rgba(230,57,70,0.34)]">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70 mb-2.5">Komuniteti</p>
              <p className="text-lg font-bold mb-3.5">Na Ndiqni Online</p>
              <div className="grid grid-cols-2 gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group touch-target inline-flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2.5 text-xs font-semibold transition-all duration-200 min-h-11 ${item.className}`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors duration-200 group-hover:bg-white/28">
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-[#e63946]" />
              <p className="font-bold text-slate-800 text-sm">Frekuenca Kryesore</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 flex items-center justify-between">
              <span className="text-slate-500 text-sm">Istog</span>
              <span className="font-bold text-[#e63946]">98.8 FM</span>
            </div>
          </div>
        </aside>

        <section className="xl:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 gradient-bar" />
            <div className="px-6 sm:px-7 py-6 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.95)_0%,rgba(255,255,255,1)_100%)]">
              <h2 className="font-bold text-xl sm:text-2xl text-slate-900">Dërgoni Mesazhin Tuaj</h2>
              <p className="text-slate-500 text-sm sm:text-base mt-1.5">
                Plotësoni formularin dhe ekipi ynë do t&apos;ju kontaktojë sa më shpejt.
              </p>
            </div>

            <div className="p-6 sm:p-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-14"
                  >
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Mesazhi u dërgua me sukses
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Faleminderit që na kontaktuat. Do t&apos;ju përgjigjemi sa më shpejt të jetë e mundur.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Emri i Plotë <span className="text-[#e63946]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Arjeta Krasniqi"
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email <span className="text-[#e63946]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="email@jote.com"
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subjekti
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={inputClassName}
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mesazhi <span className="text-[#e63946]">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={7}
                        placeholder="Shkruani mesazhin tuaj këtu..."
                        className={`${inputClassName} resize-none`}
                      />
                    </div>

                    {error && (
                      <p className="rounded-xl border border-[#e63946]/25 bg-[#e63946]/5 px-3 py-2 text-[#b81f30] text-sm font-medium">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#e63946] hover:bg-[#d32f3f] text-white rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#e63946]/25 hover:shadow-xl hover:shadow-[#e63946]/30"
                    >
                      <Send className="w-4 h-4" />
                      Dërgo Mesazhin
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
        <div className="relative h-[300px] sm:h-[340px]">
          <iframe
            title="Harta e Radio Fontana"
            src="https://maps.google.com/maps?q=Rruga%20Ibrahim%20Rugova%2056%20Istog%20Kosove&t=&z=14&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/45 to-transparent" />
          <div className="absolute left-5 sm:left-7 bottom-5 sm:bottom-7 max-w-sm rounded-2xl border border-white/20 bg-white/12 backdrop-blur-md p-4 sm:p-5 text-white">
            <p className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-white/70 mb-1.5">Lokacioni ynë</p>
            <p className="text-lg font-bold mb-1">Radio Fontana</p>
            <p className="text-sm text-white/85 mb-3">Rruga "Ibrahim Rugova" Nr. 56, Istog, Kosovë</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Rruga+Ibrahim+Rugova+56+Istog+Kosove"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Hap në Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
