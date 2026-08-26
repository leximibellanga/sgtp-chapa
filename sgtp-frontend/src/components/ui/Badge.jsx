const variantes = {
  sucesso: "bg-green-700/10 text-green-700",
  erro: "bg-red-700/10 text-red-700",
  info: "bg-blue-700/10 text-blue-700/90",
  alerta: "bg-yellow-700/10 text-yellow-600",
  neutro: "bg-slate-700/10 text-slate-700",
};

export default function Badge({ variant = "neutro", children }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variantes[variant]}`}
    >
      {children}
    </span>
  );
}
