'use client';

export default function FooterNewsletter() {
  return (
    <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="emaili@jote.com"
        className="flex-1 md:w-72 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
        required
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-white text-[#1a3a6b] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        Abonohu
      </button>
    </form>
  );
}
