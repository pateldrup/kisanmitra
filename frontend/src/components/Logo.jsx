export default function Logo({ className = "h-8" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full aspect-square drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="white" />
        {/* K shape using a leaf concept */}
        <path d="M 30 20 L 30 80" stroke="#166534" strokeWidth="12" strokeLinecap="round" />
        <path d="M 70 20 C 55 35 30 50 30 50" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" />
        <path d="M 30 50 C 45 55 70 80 70 80" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" />
        {/* Little sprouting leaf decoration */}
        <path d="M 70 20 C 60 15 50 25 55 35 C 65 35 75 25 70 20 Z" fill="#4ADE80" />
      </svg>
      <span className="font-heading font-bold text-xl tracking-tight text-brand-primary dark:text-brand-accent">
        Kisan<span className="text-brand-secondary">Mitra</span>
      </span>
    </div>
  );
}
