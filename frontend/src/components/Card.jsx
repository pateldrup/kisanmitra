export default function Card({ children, className = '', hoverEffect = true, ...props }) {
  return (
    <div 
      className={`bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300
        ${hoverEffect ? 'hover:shadow-lg hover:-translate-y-1 hover:border-brand-secondary/40 dark:hover:border-brand-accent/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)]' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
