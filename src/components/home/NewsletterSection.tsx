import { Mail, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-[#e63946] py-10 sm:py-16 lg:py-20 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Qëndro i Informuar</h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Abonohu tek buletini ynë ditor dhe merr lajmet kryesore nga Peja dhe Kosova.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" method="get" action="/kontakt/">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              placeholder="Emaili juaj..."
              required
              className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-white hover:bg-white/90 text-[#e63946] rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-black/10"
          >
            Abonohu
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-white/50 text-xs mt-6">
          Nuk dërgojmë spam. Mund të çabonohesh në çdo kohë.
        </p>
      </div>
    </section>
  );
}
