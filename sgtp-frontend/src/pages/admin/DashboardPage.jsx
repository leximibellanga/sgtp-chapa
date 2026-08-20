import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Wallet, Car } from "lucide-react";
import { Loader } from "../../components/ui/Loader";
import GraficoEvolucaoMensal from "../../components/charts/GraficoEvolucaoMensal";
import {
  buscarResumoMensal,
  buscarEvolucaoMensal,
} from "../../api/dashboardApi";
import GraficoMensal from "../../components/charts/GraficoMensal";

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
]

function StatCard({ icon: Icon, label, valor, destaque }) {
  return (
    <div
      className={`rounded-xl p-5 ${
        destaque
          ? "bg-emerald-950 text-white"
          : "border border-emerald-950/30 text-emerald-950"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs ${destaque ? "text-white" : "text-text-muted"}`}
        >
          {label}
        </span>
        <Icon
          size={18}
          className={destaque ? "text-white" : "text-text-muted"}
        />
      </div>
      <p className="font-display text-2xl font-bold">
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
        Resumo mensal referente ao mes de <strong>{MESES[Number((resumo?.mes).slice(5, 7) - 1)]} de {(resumo?.mes).slice(0, 4)}</strong>.
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
          valor={resumo.CarrosAtivos}
        />
      </div>

    </div>
  );
}
