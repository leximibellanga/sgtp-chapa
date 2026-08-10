import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const isSenha = type === "password";
    const tipoReal = isSenha && mostrarSenha ? "text" : type;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-emerald-950/90 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={tipoReal}
            className={`w-full bg-emerald-950/5 border border-emerald-950/20 rounded-lg px-3.5 py-2.5 text-sm text-emerald-950/80 outline-none transition focus:ring-2 focus:ring-emerald-950/30 focus:border-verde-mata ${isSenha ? "pr-10" : ""}`}
            {...props}
          />

          {isSenha && (
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-950/60 cursor-pointer hover:text-emerald-950/80"
              tabIndex={-1}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;