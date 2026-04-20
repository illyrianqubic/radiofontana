'use client';

export default function FooterNewsletter() {
  return (
    <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="emaili@jote.com"
        className="flex-1 md:w-72 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#e63946]/40 focus:border-[#e63946]/50 text-sm transition-all"
        required
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-[#e63946] hover:bg-[#d32f3f] text-white rounded-xl font-semibold text-sm transition-colors duration-200"
      >
        Abonohu
      </button>
    </form>
  );
}
