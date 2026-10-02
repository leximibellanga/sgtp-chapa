import { useEffect, useState } from "react";
import { buscarMapaAtividade } from "../../api/dashboardApi";

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

export default function MapaAtividade() {
  const [dados, setDados] = useState([]);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    buscarMapaAtividade(90).then(({ data }) => setDados(data));
  }, []);

  if (dados.length === 0) return null;

  const diaSemanaInicio = new Date(dados[0].data).getDay();
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="font-bold text-base text-gray-900">
          Atividade da frota
        </h2>
        <p className="text-xs text-gray-500">
          {diasComAtividade} dias com atividade nos ultimos 3 meses
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          <div className="flex mb-1 pl-8 gap-0.75">
            {semanas.map((_, idx) => {
              const label = labelsMeses.find((m) => m.idx === idx);
              return (
                <div key={idx} className="text-[10px] text-gray-500 w-3.25">
                  {label?.label || ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2 justify-between h-26.25">
              {["Seg", "", "Qua", "", "Sex", "", ""].map((label, i) => (
                <span
                  key={i}
                  className="text-[10px] text-gray-500 leading-none h-3.25"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              {semanas.map((semana, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {semana.map((dia, dIdx) =>
                    !dia ? (
                      <div key={dIdx} className="w-3.25 h-3.25" />
                    ) : (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHover(dia)}
                        onMouseLeave={() => setHover(null)}
                        className={`rounded-sm cursor-pointer w-3.25 h-3.25 ${CORES_NIVEL[nivelIntensidade(dia.carrosTrabalharam, dia.totalCarros)]}`}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
