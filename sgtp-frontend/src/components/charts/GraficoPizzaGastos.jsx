import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CORES_CATEGORIA = {
  MANUTENCAO: "#f43f5e",
  COMBUSTIVEL: "#2563eb",
  DOCUMENTACAO: "#f5930b",
  OUTROS: "#94a3b8",
};

const LABEL_CATEGORIA = {
  MANUTENCAO: "Manutencao",
  COMBUSTIVEL: "Combustivel",
  DOCUMENTACAO: "Documentacao",
  OUTROS: "Outros",
};

function TooltipCustom({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium" style={{ color: item.payload.fill }}>
        {item.name}
      </p>
      <p className="text-gray-900">
        {Number(item.value).toLocaleString("pt-PT")} MT
      </p>
    </div>
  );
}

export default function GraficoPizzaGastos({ dados }) {
  const dadosFormatados = dados.map((d) => ({
    name: LABEL_CATEGORIA[d.categoria] || d.categoria,
    value: Number(d.total),
    categoria: d.categoria,
  }));

  if (dadosFormatados.length === 0) {
    return (
      <div className="flex items-center justify-center h-70 text-sm text-gray-500">
        Nenhum gasto registado neste periodo.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={dadosFormatados}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          // outerRadius={90}
          paddingAngle={1}
        >
          {dadosFormatados.map((entry) => (
            <Cell
              key={entry.categoria}
              fill={CORES_CATEGORIA[entry.categoria] || "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip content={<TooltipCustom />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
