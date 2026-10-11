import { useEffect, useState } from "react";
import { toast } from "sonner";
// import Breadcrumb from "../../../components/ui/Breadcrumb";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTdEmpty,
  TableTh,
} from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Select from "../../../components/ui/Select";
import Pagination from "../../../components/ui/Pagination";
import { Loader } from "../../../components/ui/Loader";
import { listarRegistos } from "../../../api/registoApi";
import { listarCarros } from "../../../api/carroApi";
import { listarUsuarios } from "../../../api/usuarioApi";

const TAMANHO_PAGINA = 10;

export default function ListaRegistosPage() {
  const [registos, setRegistos] = useState([]);
  const [carros, setCarros] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroCarro, setFiltroCarro] = useState("");
  const [filtroMotorista, setFiltroMotorista] = useState("");
  const [filtroTipoDia, setFiltroTipoDia] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  async function carregarRegistos() {
    setCarregando(true);
    try {
      const { data } = await listarRegistos({
        carroId: filtroCarro || undefined,
        usuarioId: filtroMotorista || undefined,
        tipoDia: filtroTipoDia || undefined,
        pagina,
        tamanho: TAMANHO_PAGINA,
      });
      setRegistos(data.conteudo);
      setTotalPaginas(data.totalPaginas);
    } catch {
      toast.error("Erro ao carregar registos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    listarCarros().then(({ data }) => setCarros(data));
    listarUsuarios("MOTORISTA").then(({ data }) => setMotoristas(data));
  }, []);

  useEffect(() => {
    carregarRegistos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroCarro, filtroMotorista, filtroTipoDia, pagina]);

  function aoMudarFiltro(setter, valor) {
    setter(valor);
    setPagina(0);
  }

  function metaBatida(registo) {
    if (registo.tipoDia !== "UTIL") return null;
    return registo.valorEntregue >= registo.receita;
  }

  return (
    <div>
      {/* <Breadcrumb items={[{ label: "Registos" }]} /> */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl text-emerald-950">Registos Diarios</h1>
          <p className="text-emerald-950/60 text-sm">
            Registos de todo valor que foi entregue por cada motorista.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Select
          value={filtroCarro}
          onChange={(e) => aoMudarFiltro(setFiltroCarro, e.target.value)}
        >
          <option value="">Todos os carros</option>
          {carros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.matricula}
            </option>
          ))}
        </Select>

        <Select
          value={filtroMotorista}
          onChange={(e) => aoMudarFiltro(setFiltroMotorista, e.target.value)}
        >
          <option value="">Todos os motoristas</option>
          {motoristas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </Select>

        <Select
          value={filtroTipoDia}
          onChange={(e) => aoMudarFiltro(setFiltroTipoDia, e.target.value)}
        >
          <option value="">Todos os tipos de dia</option>
          <option value="UTIL">Dia util</option>
          <option value="DOMINGO">Domingo</option>
        </Select>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableTh titulo={"Data"} />
              <TableTh titulo={"Carro"} />
              <TableTh titulo={"Motorista"} />
              <TableTh titulo={"Tipo"} />
              <TableTh titulo={"Valor entregue"} />
              <TableTh titulo={"Meta"} />
              <TableTh titulo={"Justificativa"} />
            </TableHead>
            <TableBody>
              {registos.length === 0 && (
                <TableTdEmpty
                  colSpan={7}
                  textEmpty="Nenhum gasto foi encontrado"
                />
              )}
              {registos.map((r) => (
                <TableRow key={r.id}>
                  <TableTd>
                    {new Date(r.data).toLocaleDateString("pt-PT")}
                  </TableTd>
                  <TableTd>{r.carroMatricula}</TableTd>
                  <TableTd>
                    {r.usuarioNome || (
                      <span className="text-text-muted">Patrao</span>
                    )}
                  </TableTd>
                  <TableTd>
                    <Badge variant={r.tipoDia === "UTIL" ? "neutro" : "info"}>
                      {r.tipoDia === "UTIL" ? "Dia util" : "Domingo"}
                    </Badge>
                  </TableTd>
                  <TableTd>
                    {Number(r.valorEntregue).toLocaleString("pt-PT")} MT
                  </TableTd>
                  <TableTd>
                    {metaBatida(r) === null ? (
                      <span className="text-text-muted">—</span>
                    ) : metaBatida(r) ? (
                      <Badge variant="sucesso">Meta batida</Badge>
                    ) : (
                      <Badge variant="erro">Deficit</Badge>
                    )}
                  </TableTd>
                  <TableTd>
                    <span className="text-text-muted text-xs">
                      {r.justificativa || "—"}
                    </span>
                  </TableTd>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
