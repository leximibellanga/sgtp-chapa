import { useEffect, useState } from "react";
import { toast } from "sonner";
// import Breadcrumb from "../../../components/ui/Breadcrumb";
import { Loader } from "../../../components/ui/Loader";
import GraficoEvolucaoMensal from "../../../components/charts/GraficoEvolucaoMensal";
import GraficoPizzaGastos from "../../../components/charts/GraficoPizzaGastos";
import {
  buscarEvolucaoMensal,
  buscarGastosPorCategoria,
  buscarComparativoPorCarro,
} from "../../../api/dashboardApi";

export default function RelatoriosPage() {
  const [evolucao, setEvolucao] = useState([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [comparativo, setComparativo] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const [evolucaoRes, categoriaRes, comparativoRes] = await Promise.all([
          buscarEvolucaoMensal(6),
          buscarGastosPorCategoria(),
          buscarComparativoPorCarro(),
        ]);
        setEvolucao(evolucaoRes.data);
        setGastosPorCategoria(categoriaRes.data);
        setComparativo(comparativoRes.data);
      } catch {
        toast.error("Erro ao carregar relatorios");
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
      {/* <Breadcrumb items={[{ label: "Relatorios" }]} /> */}
      <h1 className="font-display text-2xl font-bold text-emerald-950 mb-6">
        Relatorios
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-base text-gray-900 mb-4">
            Evolucao mensal
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

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-bold text-base text-gray-900 mb-4">
          Comparativo entre carros (mes atual)
        </h2>
        <div className="space-y-3">
          {comparativo.map((c) => (
            <div
              key={c.carroId}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium text-gray-900 w-32">
                {c.matricula}
              </span>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-800"
                  style={{
                    width: `${Math.min(100, (c.saldo / Math.max(...comparativo.map((x) => x.saldo || 1))) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-gray-500 w-24 text-right">
                {Number(c.saldo).toLocaleString("pt-PT")} MT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
