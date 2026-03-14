export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-card-dark text-text-main dark:text-text-inverse border border-gray-200 dark:border-gray-700 hover:border-brand-secondary hover:text-brand-secondary dark:hover:border-brand-secondary dark:hover:text-brand-accent shadow-sm hover:-translate-y-0.5",
    outline: "bg-transparent border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10 hover:-translate-y-0.5",
    ghost: "bg-transparent text-text-main dark:text-text-inverse hover:bg-gray-100 dark:hover:bg-gray-800"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} px-6 py-2.5 ${className}`} {...props}>
      {children}
    </button>
  );
}
