import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Wallet, Car } from "lucide-react";
import { Loader } from "../../components/ui/Loader";
import GraficoEvolucaoMensal from "../../components/charts/GraficoEvolucaoMensal";
import {
  buscarResumoMensal,
  buscarEvolucaoMensal,
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
          className={`text-xs ${destaque ? "text-white" : "text-emerald-950/70"}`}
        >
          {label}
        </span>
        <div className={`p-2 rounded-lg bg-emerald-950/10 ${destaque ? "bg-white/10" : ""}`}>
          <Icon
            size={18}
            className={destaque ? "text-white" : "text-emerald-950/70 "}
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
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [resumoRes, evolucaoRes] = await Promise.all([
          buscarResumoMensal(),
          buscarEvolucaoMensal(6),
        ]);
        setResumo(resumoRes.data);
        setEvolucao(evolucaoRes.data);
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
        <strong>
          {MESES[Number((resumo?.mes).slice(5, 7) - 1)]} de{" "}
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
        />
        <StatCard icon={Wallet} label="Saldo" valor={Number(resumo.saldo)} />
        <StatCard
          icon={Car}
          label="Carros ativos"
          valor={`${resumo.CarrosAtivos}`}
        />
      </div>

      <div className="border border-emerald-950/30 rounded-xl p-5">
        <h2 className="font-display text-base font-bold text-emerald-950 mb-4">
          Evolucao dos ultimos 6 meses
        </h2>
        <GraficoEvolucaoMensal dados={evolucao} />

        {/* <GraficoMensal dados={evolucao} /> */}
      </div>
    </div>
  );
}
