import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  ({ label, error, children, className = "", ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-verde-mata mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none border border-emerald-950/20 rounded-lg px-3.5 py-2.5 pr-9 text-sm text-emerald-950/80 outline-none transition bg-emerald-950/5 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-950/60 focus:bg-white ${
              error ? "border-coral" : "border-border"
            }`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-coral mt-1">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
