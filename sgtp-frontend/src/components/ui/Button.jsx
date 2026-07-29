import { Loader } from "../ui/Loader";
import { forwardRef } from "react";

const variantes = {
  primary: "bg-emerald-950/95 text-emerald-100 hover:bg-emerald-950",
  secondary: "bg-white text-green-700 border border-green-700 hover:bg-bg-neutral",
  perigo: "bg-[crimson] text-white hover:opacity-90",
  ghost: "text-verde-mata hover:bg-verde-mata/10",
};

const tamanhos = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon: Icon,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${variantes[variant]} ${tamanhos[size]} ${className}`}
        {...props}
      >
        {loading && <Loader size={16} />}
        {!loading && Icon && <Icon size={16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
