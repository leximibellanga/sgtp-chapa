import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, CheckCircle2, AlertCircle, Inbox } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { listarMeusRegistos } from "../../api/registoApi";

const META_DIARIA = 2500;

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardMotoristaPage() {
  const [registos, setRegistos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMeusRegistos()
      .then(({ data }) => setRegistos(data))
      .catch(() => toast.error("Erro ao carregar os teus dados"))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center py-16">
        <Loader />
      </div>
    );
  }

  const hoje = hojeISO();
  const registoHoje = registos.find((r) => r.data === hoje);

  const agora = new Date();
  const registosDoMes = registos.filter((r) => {
    const data = new Date(r.data);
    return (
      data.getMonth() === agora.getMonth() &&
      data.getFullYear() === agora.getFullYear()
    );
  });

  const diasTrabalhados = registosDoMes.length;
  const metasBatidas = registosDoMes.filter(
    (r) => r.tipoDia === "UTIL" && Number(r.valorEntregue) >= Number(r.receita),
  ).length;
  const deficits = registosDoMes.filter(
    (r) => r.tipoDia === "UTIL" && Number(r.valorEntregue) < Number(r.receita),
  ).length;
  const totalEntregue = registosDoMes.reduce(
    (soma, r) => soma + Number(r.valorEntregue),
    0,
  );

  const metaBatidaHoje =
    registoHoje &&
    Number(registoHoje.valorEntregue) >= Number(registoHoje.receita || 0);

  return (
    <div className="space-y-6">
      {/* Card de meta do dia — elemento-assinatura */}
      {registoHoje ? (
        <div
          className={`rounded-2xl p-5 text-center ${
            registoHoje.tipoDia === "DOMINGO"
              ? "bg-emerald-900 text-emerald-50"
              : metaBatidaHoje
                ? "bg-emerald-900 text-red-50"
                : "bg-red-900 text-red-50"
          }`}
        >
          <p className="text-xs font-bold tracking-widest opacity-95 mb-1">
            {registoHoje.tipoDia === "DOMINGO"
              ? "DOMINGO TRABALHADO"
              : "REGISTO DE HOJE"}
          </p>
          <p className="text-3xl font-bold">
            {Number(registoHoje.valorEntregue).toLocaleString("pt-PT")} MT
          </p>
          {registoHoje.tipoDia === "UTIL" && (
            <p className="text-xs mt-2 opacity-95 flex items-center justify-center gap-1">
              {metaBatidaHoje ? (
                <CheckCircle2 size={14} />
              ) : (
                <AlertCircle size={14} />
              )}
              {metaBatidaHoje ? "Meta batida" : "Abaixo da meta"}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-violeta rounded-2xl p-5 text-center text-emerald-950">
          <p className="text-xs font-bold tracking-widest opacity-80 mb-1">
            META DE HOJE
          </p>
          <p className="font-display text-3xl font-bold mb-3">
            {META_DIARIA.toLocaleString("pt-PT")} MT
          </p>
          <Link to="/motorista/registos/novo">
            <Button icon={Plus} variant="secondary" className="w-full">
              Registar valor de hoje
            </Button>
          </Link>
        </div>
      )}

      {/* Resumo do mes */}
      <div>
        <h2 className="text-base font-bold text-emerald-950 mb-3">Este mes</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-950 border border-emerald-950/20 rounded-xl p-4">
            <p className="text-xs text-emerald-100/70 mb-1">Dias trabalhados</p>
            <p className="text-xl font-bold text-emerald-100/95">
              {diasTrabalhados}
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-950/20 rounded-xl p-4">
            <p className="text-xs text-emerald-100/70 mb-1">Total entregue</p>
            <p className="text-xl font-bold text-emerald-100/95">
              {totalEntregue.toLocaleString("pt-PT")} MT
            </p>
          </div>
          <div className="bg-emerald-950 border border-emerald-950/20 rounded-xl p-4">
            <p className="text-xs text-emerald-100/70 mb-1">Metas batidas</p>
            <p className="text-xl font-bold text-emerald-100/95">
              {metasBatidas}
            </p>
          </div>
          <div className="bg-red-950 border border-emerald-950/20 rounded-xl p-4">
            <p className="text-xs text-red-100/70 mb-1">Deficits</p>
            <p className="text-xl font-bold text-red-100/95">{deficits}</p>
          </div>
        </div>
      </div>

      {/* Ultimos registos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-emerald-950">
            Ultimos registos
          </h2>
          <Link
            to="/motorista/registos"
            className="text-xs text-emerald-600 font-medium"
          >
            Ver todos
          </Link>
        </div>

        {registos.length === 0 ? (
          <p className="grid place-items-center text-sm text-emerald-950/50 py-8">
            <Inbox size={32} className="mb-1.5" />
            Ainda nao tens registos.
          </p>
        ) : (
          <div className="space-y-2">
            {registos
              .sort((a, b) => new Date(b.data) - new Date(a.data))
              .slice(0, 3)
              .map((r) => {
                const meta =
                  r.tipoDia === "UTIL"
                    ? Number(r.valorEntregue) >= Number(r.receita)
                    : null;
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-white border border-emerald-950/20 rounded-xl px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-emerald-950 mb-1">
                        {new Date(r.data).toLocaleDateString("pt-PT", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-emerald-900/80">
                        {r.carroMatricula}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <p className="text-sm font-semibold text-emerald-900">
                        {Number(r.valorEntregue).toLocaleString("pt-PT")} MT
                      </p>
                      {meta !== null && (
                        <Badge variant={meta ? "sucesso" : "erro"}>
                          {meta ? "Batida" : "Deficit"}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
