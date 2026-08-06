import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-verde-mata/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-verde-mata">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-verde-mata p-1 rounded-full hover:bg-bg-neutral cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}

