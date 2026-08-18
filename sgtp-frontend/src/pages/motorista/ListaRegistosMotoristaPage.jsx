import { useEffect, useState } from "react";
import { Calendar, Car, CarFront, Inbox, MailWarning, MessageSquareWarning, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { listarMeusRegistos } from "../../api/registoApi";

export default function ListaRegistosMotoristaPage() {
  const [registos, setRegistos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMeusRegistos()
      .then(({ data }) =>
        setRegistos(data.sort((a, b) => new Date(b.data) - new Date(a.data))),
      )
      .catch(() => toast.error("Erro ao carregar historico"))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl text-emerald-950 font-bold">Meus registos</h1>
        <Link to="/motorista/registos/novo">
          <Button icon={Plus} size="sm">
            <span className="text-sm">Novo</span>
          </Button>
        </Link>
      </div>

      {/* Listagem */}
      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : registos.length === 0 ? (
        <p className="text-sm text-emerald-950/60 text-center py-16 grid place-items-center gap-3">
          <Inbox size={32} />
          Ainda nao tens registos.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {registos.map((r) => {
            const metaBatida =
              r.tipoDia === "UTIL" ? r.valorEntregue >= r.receita : null;
            return (
              <div
                key={r.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
              >
                {/* Barra superior de estado */}
                <div
                  className={`h-1 w-full ${
                    metaBatida === true
                      ? "bg-emerald-500"
                      : metaBatida === false
                        ? "bg-red-500"
                        : "bg-slate-300"
                  }`}
                />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase text-slate-400">
                        Valor entregue
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-emerald-900">
                          {Number(r.valorEntregue).toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-emerald-700">
                          MT
                        </span>
                      </div>
                    </div>
                    {/* Estado */}
                    {metaBatida !== null && (
                      <Badge variant={metaBatida ? "sucesso" : "erro"}>
                        {metaBatida ? "Meta batida" : "Deficit"}
                      </Badge>
                    )}
                  </div>
                  {/* Informações principais */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {/* Matrícula */}
                    <div className=" rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition-colors group-hover:bg-emerald-50/50">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-800 shadow-sm">
                          <CarFront size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase text-emerald-950/50">
                          Viatura
                        </span>
                      </div>

                      <p className="font-bold text-emerald-950">
                        {r.carroMatricula}
                      </p>
                    </div>

                    {/* Data */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition-colors group-hover:bg-emerald-50/50">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-800 shadow-sm">
                          <Calendar size={16} />
                        </div>

                        <span className="text-xs font-bold uppercase text-emerald-950/50">
                          Data
                        </span>
                      </div>

                      <p className="text-sm font-semibold capitalize text-emerald-950">
                        {new Date(r.data).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Justificativa */}
                  {r.justificativa && (
                    <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                      <div className="flex gap-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs font-bold uppercase text-amber-700">
                            Justificativa
                          </p>
                          <p className="text-sm text-amber-950/75">
                            {r.justificativa}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium text-slate-400">
                      Registo de entrega
                    </span>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-bold ${
                        metaBatida === true
                          ? "text-emerald-600"
                          : metaBatida === false
                            ? "text-red-600"
                            : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          metaBatida === true
                            ? "bg-emerald-500"
                            : metaBatida === false
                              ? "bg-red-500"
                              : "bg-slate-400"
                        }`}
                      />
                      {metaBatida === true
                        ? "Dentro da meta"
                        : metaBatida === false
                          ? "Abaixo da meta"
                          : "Meta não definida"}
                    </div>
                  </div>
                </div>
              </div>

              // <div
              //   key={r.id}
              //   className="justify-between bg-white border border-emerald-950/20 rounded-xl p-4"
              // >
              //   <div className="flex items-center justify-between mb-1">
              //     <p className="font-display text-lg font-bold text-emerald-950">
              //       4{Number(r.valorEntregue).toFixed(2)} MT
              //     </p>
              //     {metaBatida !== null && (
              //       <Badge variant={metaBatida ? "sucesso" : "erro"}>
              //         {metaBatida ? "Meta batida" : "Deficit"}
              //       </Badge>
              //     )}
              //   </div>
              //   <p className="text-sm text-emerald-950 font-medium">
              //     {r.carroMatricula}
              //   </p>
              //   <span className="text-sm font-normal text-emerald-950">
              //     {new Date(r.data).toLocaleDateString("pt-PT", {
              //       weekday: "long",
              //       day: "2-digit",
              //       month: "short",
              //       year: "numeric",
              //     })}
              //   </span>
              //   {r.justificativa && (
              //     <p className="text-xs text-emerald-950/60 mt-2 italic">
              //       "{r.justificativa}"
              //     </p>
              //   )}
              // </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
