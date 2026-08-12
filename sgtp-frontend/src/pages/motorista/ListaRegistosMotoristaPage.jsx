import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
        <h1 className="font-display text-xl font-bold text-verde-mata">
          Meus registos
        </h1>
        <Link to="/motorista/registos/novo">
          <Button icon={Plus} size="sm">
            Novo
          </Button>
        </Link>
      </div>

      {/* Listagem */}
      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : registos.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-16">
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
                className="justify-between bg-white border border-emerald-950/20 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display text-lg font-bold text-emerald-950">4
                    
                    {Number(r.valorEntregue).toFixed(2)} MT
                  </p>
                  {metaBatida !== null && (
                    <Badge variant={metaBatida ? "sucesso" : "erro"}>
                      {metaBatida ? "Meta batida" : "Deficit"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-emerald-950 font-medium">{r.carroMatricula}</p>
                <span className="text-sm font-normal text-emerald-950">
                  {new Date(r.data).toLocaleDateString("pt-PT", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {r.justificativa && (
                  <p className="text-xs text-emerald-950/60 mt-2 italic">
                    "{r.justificativa}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
