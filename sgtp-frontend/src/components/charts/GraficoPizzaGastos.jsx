import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CORES_CATEGORIA = {
  MANUTENCAO: "#FF4696",
  COMBUSTIVEL: "#6A00F4",
  DOCUMENTACAO: "#FFD6A5",
  OUTROS: "#B6FF2E",
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
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium" style={{ color: item.payload.fill }}>
        {item.name}
      </p>
      <p className="text-verde-mata">
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
      <div className="flex items-center justify-center h-70 text-sm text-text-muted">
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
              fill={CORES_CATEGORIA[entry.categoria] || "#6B7568"}
            />
          ))}
        </Pie>
        <Tooltip content={<TooltipCustom />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
