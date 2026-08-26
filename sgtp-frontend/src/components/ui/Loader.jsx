import { Loader2 } from "lucide-react";

export function Loader({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin" />;
}

export function LoaderFullPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-green-600" />
        <p className="text-sm text-gray-300">A carregar...</p>
      </div>
    </div>
  );
}
