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
import { Loader } from "../../../components/ui/Loader";
import { listarRegistos } from "../../../api/registoApi";
import { listarCarros } from "../../../api/carroApi";
import { listarUsuarios } from "../../../api/usuarioApi";
import { Filter } from "lucide-react";
import Button from "../../../components/ui/Button";
import formatarDate from "../../../utils/formatDate";

export default function ListaRegistosPage() {
  const [registos, setRegistos] = useState([]);
  const [carros, setCarros] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroCarro, setFiltroCarro] = useState("");
  const [filtroMotorista, setFiltroMotorista] = useState("");
  const [filtroTipoDia, setFiltroTipoDia] = useState("");

  async function carregarRegistos() {
    setCarregando(true);
    try {
      const { data } = await listarRegistos({
        carroId: filtroCarro || undefined,
        usuarioId: filtroMotorista || undefined,
        tipoDia: filtroTipoDia || undefined,
      });
      setRegistos(data);
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
  }, [filtroCarro, filtroMotorista, filtroTipoDia]);

  function metaBatida(registo) {
    if (registo.tipoDia !== "UTIL") return null;
    return registo.valorEntregue >= registo.receita;
  }

  return (
    <div>
      {/* <Breadcrumb items={[{ label: "Registos" }]} /> */}

      <div className="flex flex-col mb-8">
        <h1 className="font-bold text-2xl text-emerald-950">
          Registos Diários
        </h1>
        <p className="text-emerald-950/60 text-sm">
          Listagem de todos os registos diários de entrega de valores dos
          motoristas.
        </p>
      </div>
      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* filtro de carro */}
        <Select
          value={filtroCarro}
          onChange={(e) => setFiltroCarro(e.target.value)}
        >
          <option value="">Todos os carros</option>
          {carros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.matricula}
            </option>
          ))}
        </Select>
        {/* filtro de motorista */}
        <Select
          value={filtroMotorista}
          onChange={(e) => setFiltroMotorista(e.target.value)}
        >
          <option value="">Todos os motoristas</option>
          {motoristas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </Select>
        {/* filtro de tipo_de_dia */}
        <Select
          value={filtroTipoDia}
          onChange={(e) => setFiltroTipoDia(e.target.value)}
        >
          <option value="">Todos os tipos de dia</option>
          <option value="UTIL">Dia util</option>
          <option value="DOMINGO">Domingo</option>
        </Select>
        {/* Botao para filtrar */}
        <Button onClick={() => carregarRegistos()}>
          <Filter size={13} />
          Filtrar
        </Button>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableTh titulo="Data" />
            <TableTh titulo="Carro" />
            <TableTh titulo="Motorista" />
            <TableTh titulo="Tipo de dia" />
            <TableTh titulo="Valor entregue" />
            <TableTh titulo="Meta batida" />
            <TableTh titulo="Justificativa" />
          </TableHead>
          <TableBody>
            {registos.length === 0 && <TableTdEmpty colSpan={7} />}
            {registos.map((r) => (
              <TableRow key={r.id}>
                <TableTd>{formatarDate(r.data)}</TableTd>
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
                  {Number(r.valorEntregue).toFixed(2)} MT
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
                  <span className="text-emerald-950/60 text-xs">
                    {r.justificativa || "—"}
                  </span>
                </TableTd>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
