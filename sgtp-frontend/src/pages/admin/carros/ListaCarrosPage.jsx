import { Filter, PenBoxIcon, Plus, Power } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useEffect, useState } from "react";
import {
  listarCarros,
  ativarCarro,
  desativarCarro,
} from "../../../api/carroApi";
import { toast } from "sonner";
import { Loader } from "../../../components/ui/Loader";
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
import CarroFormModal from "./CarroFormModal";
import formatarData from "../../../utils/formatDate";
import Breadcrump from "../../../components/ui/Breadcrump";

export default function ListaCarrosPage() {
  const [carros, setCarros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [carroEmEdicao, setCarroEmEdicao] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState(""); // "" | "true" | "false"

  async function carregarCarros() {
    setCarregando(true);
    try {
      const apenasAtivos =
        filtroStatus === "" ? undefined : filtroStatus === "true";
      const { data } = await listarCarros(apenasAtivos);
      setCarros(data);
    } catch (error) {
      toast.error("Erro ao carregar carros");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCarros();
  }, [filtroStatus]);

  function abrirNovo() {
    setCarroEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(carro) {
    setCarroEmEdicao(carro);
    setModalAberto(true);
  }

  async function alternarStatus(carro) {
    try {
      if (carro.ativo) {
        await desativarCarro(carro.id);
        toast.success(`${carro.matricula} desativado`);
        carregarCarros();
      } else {
        await ativarCarro(carro.id);
        toast.success(`${carro.matricula} ativado`);
        carregarCarros();
      }
    } catch (error) {
      toast.error("Erro ao alterar status do carro");
    }
  }

  const titulosTabela = [
    "Matricula",
    "Modelo",
    "Ano",
    "Rota",
    "Status",
    "Data de criacao",
    "Acoes",
  ];

  return (
    <div>
      {/* <Breadcrump items={[{label: "Carros"}]} /> */}

      <div className="flex flex-col mb-6">
        <h1 className="font-bold text-2xl text-emerald-950">Carros</h1>
        <p className="text-emerald-950/60 text-sm">
          Listagem dos carros da empresa.
        </p>
      </div>

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-40 bg-emerald-950/5 px-2 py-2 text-sm text-emerald-950/80 rounded-lg outline-none border border-emerald-950/20 cursor-pointer hover:bg-emerald-950/10 transition-colors duration-300"
              >
                <option value="">Todos carros</option>
                <option value="true">Apenas ativos</option>
                {/* <option value="false">Apenas inativos</option> */}
              </select>
              <Button onClick={() => carregarCarros}>
                <Filter size={13} />
              </Button>
            </div>
            <Button icon={Plus} onClick={abrirNovo}>
              Novo carro
            </Button>
          </div>

          <Table>
            <TableHead>
              {titulosTabela.map((titulo) => (
                <TableTh key={titulo} titulo={titulo} />
              ))}
            </TableHead>
            <TableBody>
              {carros.length === 0 ? (
                <TableTdEmpty
                  colSpan={6}
                  textEmpty="Nenhum carro foi encontrado"
                />
              ) : (
                carros.map((carro) => (
                  <TableRow key={carro.id}>
                    <TableTd text={carro.matricula} className={"font-medium"} />
                    <TableTd text={carro.modelo} />
                    <TableTd text={carro.ano} />
                    <TableTd text={carro.rota} />
                    <TableTd>
                      <Badge variant={`${carro.ativo ? "sucesso" : "erro"}`}>
                        {carro.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableTd>
                    <TableTd text={formatarData(carro.criadoEm)} />
                    <TableTd>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicao(carro)}
                          className="bg-blue-600/5 hover:bg-blue-600/15 p-1.5 rounded-lg border border-blue-600/10 transition-colors duration-300 ease-in cursor-pointer"
                        >
                          <PenBoxIcon size={14} className="text-blue-600/80" />
                        </button>
                        <button
                          onClick={() => alternarStatus(carro)}
                          className={`p-1.5 rounded-lg border transition-colors duration-300 ease-in cursor-pointer
                                    ${
                                      carro.ativo
                                        ? "bg-red-600/5 hover:bg-red-600/15 border-red-600/10"
                                        : "bg-emerald-600/5 hover:bg-emerald-600/15 border-emerald-600/10"
                                    }`}
                          title={carro.ativo ? "Desativar" : "Ativar"}
                        >
                          <Power
                            size={14}
                            className={`${carro.ativo ? "text-red-600/80" : "text-green-600/80"}`}
                          />
                        </button>
                      </div>
                    </TableTd>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal: Formulario */}
      <CarroFormModal
        open={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucess={carregarCarros}
        carro={carroEmEdicao}
      />
    </div>
  );
}
