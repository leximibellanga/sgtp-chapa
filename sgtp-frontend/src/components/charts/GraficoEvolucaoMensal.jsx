import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-verde-mata mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} style={{ color: item.color }}>
          {item.name}: {Number(item.value).toLocaleString("pt-PT")} MT
        </p>
      ))}
    </div>
  );
}

export default function GraficoEvolucaoMensal({ dados }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D6" />
        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#6B7568" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6B7568" }} />
        <Tooltip content={<TooltipCustom />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="receita"
          name="Receita"
          stroke="#064E3B"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="gasto"
          name="Gastos"
          stroke="#FF4696"
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}