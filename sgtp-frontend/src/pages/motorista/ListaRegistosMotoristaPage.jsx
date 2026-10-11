import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import { Loader } from "../../components/ui/Loader";
import { listarMeusRegistos } from "../../api/registoApi";

const TAMANHO_PAGINA = 10;

export default function ListaRegistosMotoristaPage() {
  const [registos, setRegistos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    setCarregando(true);
    listarMeusRegistos({ pagina, tamanho: TAMANHO_PAGINA })
      .then(({ data }) => {
        setRegistos(data.conteudo);
        setTotalPaginas(data.totalPaginas);
      })
      .catch(() => toast.error("Erro ao carregar historico"))
      .finally(() => setCarregando(false));
  }, [pagina]);

  return (
    <div>
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

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : registos.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-16">
          Ainda nao tens registos.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {registos.map((r) => {
              const metaBatida =
                r.tipoDia === "UTIL" ? r.valorEntregue >= r.receita : null;
              return (
                <div
                  key={r.id}
                  className="bg-white border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-verde-mata">
                      {new Date(r.data).toLocaleDateString("pt-PT", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    {metaBatida !== null && (
                      <Badge variant={metaBatida ? "sucesso" : "erro"}>
                        {metaBatida ? "Meta batida" : "Deficit"}
                      </Badge>
                    )}
                  </div>
                  <p className="font-display text-lg font-bold text-verde-mata">
                    {Number(r.valorEntregue).toLocaleString("pt-PT")} MT
                  </p>
                  <p className="text-xs text-text-muted">{r.carroMatricula}</p>
                  {r.justificativa && (
                    <p className="text-xs text-text-muted mt-2 italic">
                      "{r.justificativa}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            paginaAtual={pagina}
            totalPaginas={totalPaginas}
            onChange={setPagina}
          />
        </>
      )}
    </div>
  );
}
