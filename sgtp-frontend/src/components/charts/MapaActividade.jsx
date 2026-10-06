import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buscarMapaAtividade } from "../../api/dashboardApi";
import { Loader } from "../ui/Loader";

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const CORES_NIVEL = [
  "bg-gray-100",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

function nivelIntensidade(trabalharam, total) {
  if (total === 0 || trabalharam === 0) return 0;
  const ratio = trabalharam / total;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function isFuturo(dataStr) {
  const hoje = new Date().toISOString().slice(0, 10);
  return dataStr > hoje;
}

export default function MapaAtividade() {
  const anoAtual = new Date().getFullYear();
  const [ano, setAno] = useState(anoAtual);
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    setCarregando(true);
    buscarMapaAtividade(ano)
      .then(({ data }) => setDados(data))
      .finally(() => setCarregando(false));
  }, [ano]);

  const diaSemanaInicio =
    dados.length > 0 ? new Date(dados[0].data).getDay() : 0;
  const celulas = [...Array(diaSemanaInicio).fill(null), ...dados];

  const semanas = [];
  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7));
  }

  const labelsMeses = [];
  let ultimoMes = null;
  semanas.forEach((semana, idx) => {
    const diaValido = semana.find((d) => d !== null);
    if (diaValido) {
      const mes = new Date(diaValido.data).getMonth();
      if (mes !== ultimoMes) {
        labelsMeses.push({ idx, label: MESES[mes] });
        ultimoMes = mes;
      }
    }
  });

  const diasComAtividade = dados.filter((d) => d.carrosTrabalharam > 0).length;
  const gridColunas = {
    gridTemplateColumns: `repeat(${semanas.length || 1}, minmax(0, 1fr))`,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-base text-gray-900">
            Atividade da frota
          </h2>
          <p className="text-xs text-gray-500">
            {diasComAtividade} dias com atividade em {ano}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 py-1">
          <button
            onClick={() => setAno((a) => a - 1)}
            className="p-1 rounded-md hover:bg-white text-gray-600"
            aria-label="Ano anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-gray-900 w-12 text-center">
            {ano}
          </span>
          <button
            onClick={() => setAno((a) => a + 1)}
            className="p-1 rounded-md hover:bg-white text-gray-600"
            aria-label="Ano seguinte"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          <div className="grid gap-0.5 mb-1 ml-7" style={gridColunas}>
            {semanas.map((_, idx) => {
              const label = labelsMeses.find((m) => m.idx === idx);
              return (
                <div key={idx} className="text-[10px] text-gray-500 truncate">
                  {label?.label || ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col justify-between shrink-0 w-6">
              {DIAS_SEMANA.map((label, i) => (
                <span
                  key={i}
                  className="text-[10px] text-gray-500 leading-none"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid gap-0.5 flex-1 min-w-0" style={gridColunas}>
              {semanas.map((semana, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-0.5">
                  {semana.map((dia, dIdx) =>
                    !dia ? (
                      <div key={dIdx} />
                    ) : (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHover(dia)}
                        onMouseLeave={() => setHover(null)}
                        className={`w-full aspect-square rounded-sm cursor-pointer transition-opacity ${
                          CORES_NIVEL[
                            nivelIntensidade(
                              dia.carrosTrabalharam,
                              dia.totalCarros,
                            )
                          ]
                        } ${isFuturo(dia.data) ? "opacity-40" : ""}`}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-gray-500">
          {hover
            ? `${new Date(hover.data).toLocaleDateString("pt-PT", { day: "2-digit", month: "long" })}: ${hover.carrosTrabalharam} de ${hover.totalCarros} carros trabalharam`
            : "Passa o rato sobre um dia para ver o detalhe"}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <span>Menos</span>
          {CORES_NIVEL.map((cor, i) => (
            <span key={i} className={`rounded-sm w-2.5 h-2.5 ${cor}`} />
          ))}
          <span>Mais</span>
        </div>
      </div>
    </div>
  );
}
