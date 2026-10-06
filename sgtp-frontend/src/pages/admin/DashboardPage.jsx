import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Wallet, Car } from "lucide-react";
import { Loader } from "../../components/ui/Loader";
import GraficoEvolucaoMensal from "../../components/charts/GraficoEvolucaoMensal";
import GraficoPizzaGastos from "../../components/charts/GraficoPizzaGastos";
import MapaActividade from "../../components/charts/MapaActividade";
import {
  buscarResumoMensal,
  buscarEvolucaoMensal,
  buscarGastosPorCategoria,
} from "../../api/dashboardApi";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function StatCard({ icon: Icon, label, valor, destaque }) {
  return (
    <div
      className={`h-30 flex flex-col justify-between rounded-xl p-5 hover:-translate-1.25 cursor-pointer transition-all duration-300 ${
        destaque
          ? "bg-emerald-950 text-white"
          : "border border-emerald-950/10 shadow shadow-emerald-100/20 bg-white text-emerald-950"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs ${
            destaque ? "text-white" : "text-emerald-950/70"
          }`}
        >
          {label}
        </span>
        <div
          className={`p-2 rounded-lg bg-emerald-950/10 ${destaque ? "bg-white/10" : ""}`}
        >
          <Icon
            size={18}
            className={destaque ? "text-white" : "text-emerald-950/70"}
          />
        </div>
      </div>
      <p className="text-2xl font-bold">
        {typeof valor === "number"
          ? `${valor.toLocaleString("pt-PT")} MT`
          : valor}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [evolucao, setEvolucao] = useState([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // const mesAtual = new Date().toISOString().slice(0, 7);
    async function carregar() {
      try {
        const [resumoRes, evolucaoRes, categoriaRes] = await Promise.all([
          buscarResumoMensal(),
          buscarEvolucaoMensal(9),
          buscarGastosPorCategoria(),
        ]);
        setResumo(resumoRes.data);
        setEvolucao(evolucaoRes.data);
        setGastosPorCategoria(categoriaRes.data);
      } catch {
        toast.error("Erro ao carregar o dashboard");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center py-16">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-emerald-950">Dashboard</h1>
      <p className="text-sm text-emerald-950/60 mb-6">
        Resumo mensal referente ao mes de{" "}
        <strong className="text-black/70">
          {MESES[Number((resumo?.mes).slice(5, 7)) - 1]} de{" "}
          {(resumo?.mes).slice(0, 4)}
        </strong>
        .
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          label="Receita"
          valor={Number(resumo.receitaTotal)}
          destaque
        />
        <StatCard
          icon={TrendingDown}
          label="Gastos"
          valor={Number(resumo.gastoTotal)}
          destaque
        />
        <StatCard
          icon={Wallet}
          label="Saldo"
          valor={Number(resumo.saldo)}
          destaque
        />
        <StatCard
          icon={Car}
          label="Carros ativos"
          valor={`${resumo.CarrosAtivos}`}
          destaque
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-base text-gray-900 mb-4">
            Evolucao mensal dos ultimos 9 meses
          </h2>
          <GraficoEvolucaoMensal dados={evolucao} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-base text-gray-900 mb-4">
            Gastos por categoria
          </h2>
          <GraficoPizzaGastos dados={gastosPorCategoria} />
        </div>
      </div>
      {/* Mapa */}
      <div className="mt-6">
        <MapaActividade />
      </div>
    </div>
  );
}
