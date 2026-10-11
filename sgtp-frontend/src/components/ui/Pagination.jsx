import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ paginaAtual, totalPaginas, onChange }) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(paginaAtual - 1)}
          disabled={paginaAtual === 0}
          className="bg-emerald-800 p-1.5 rounded-lg text-white cursor-pointer hover:bg-emerald-900 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-gray-500 px-2">
          Prev
        </span>
      </div>
      <span className="text-gray-500">
        Pagina {paginaAtual + 1} de {totalPaginas}
      </span>
      <div className="flex items-center gap-1">
        <span className="text-gray-500 px-2">
          Next
        </span>
        <button
          onClick={() => onChange(paginaAtual + 1)}
          disabled={paginaAtual >= totalPaginas - 1}
          className="bg-emerald-800 p-1.5 rounded-lg text-white cursor-pointer hover:bg-emerald-900 disabled:opacity-80 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}