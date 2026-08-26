import { useEffect, useState } from "react";
import { listarGastos, removerGasto } from "../../../api/gastoApi";
import { toast } from "sonner";
import { listarCarros } from "../../../api/carroApi";
import Select from "../../../components/ui/Select";
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
import formatarDate from "../../../utils/formatDate";
import { PenBoxIcon, Plus, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import GastoFormModal from "./GastoFormModal";

const categoriaLabel = {
  MANUTENCAO: "Manutecao",
  COMBUSTIVEL: "Combustivel",
  DOCUMENTACAO: "Documentacao",
  OUTROS: "Outros",
};

const categoriaBadge = {
  MANUTENCAO: "erro",
  COMBUSTIVEL: "info",
  DOCUMENTACAO: "alerta",
  OUTROS: "neutro",
};

export default function ListaGastosPage() {
  const [gastos, setGastos] = useState([]);
  const [carros, setCarros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [gastoEmEdicao, setGastoEmEdicao] = useState(null);

  const [filtroCarro, setFiltroCarro] = useState("");
  const [filtroCategoriaGasto, setFiltroCategoriaGasto] = useState("");

  async function carregarGastos() {
    setCarregando(true);
    try {
      const { data } = await listarGastos({
        carro: filtroCarro || undefined,
        categoria: filtroCategoriaGasto || undefined,
      });
      setGastos(data);
    } catch (error) {
      toast.error("Erro ao carregar gastos");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    listarCarros().then(({ data }) => setCarros(data));
  }, []);

  useEffect(() => {
    carregarGastos();
  }, [filtroCarro, filtroCategoriaGasto]);

  function abrirNovo() {
    setGastoEmEdicao(false);
    setModalAberto(true);
  }

  function abrirEdicao(gasto) {
    setGastoEmEdicao(gasto);
    setModalAberto(true);
  }

  async function excluir(gasto) {
    if (!confirm(`Remover o gasto "${gasto.descricao}"?`)) return;
    try {
      await removerGasto(gasto.id);
      toast.success("Gasto removido com sucesso");
      carregarGastos();
    } catch (error) {
      toast.error("Erro ao remover gasto");
    }
  }

  const totalFiltrado = gastos.reduce((soma, g) => soma + Number(g.valor), 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl text-emerald-950">Gastos</h1>
          <p className="text-emerald-950/60 text-sm">
            Listagem de todos gastos obtidos na empresa.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus size={16} /> Novo gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
        <Select
          value={filtroCategoriaGasto}
          onChange={(e) => setFiltroCategoriaGasto(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {Object.entries(categoriaLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {/* <div className="bg-purple-900/10 text-purple-900 text-sm rounded-lg px-4 py-3 mb-6">
        Total no filtro atual: <strong>{totalFiltrado.toFixed(2)} MT</strong>
      </div> */}

      {carregando ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableTh titulo={"Data"} />
            <TableTh titulo={"Carro"} />
            <TableTh titulo={"Valor"} />
            <TableTh titulo={"Descricao"} />
            <TableTh titulo={"Categoria"} />
            <TableTh titulo={"Data de criacao"} />
            <TableTh titulo={"Acoes"} />
          </TableHead>

          <TableBody>
            {gastos.length === 0 && (
              <TableTdEmpty
                colSpan={7}
                textEmpty="Nenhum gasto foi encontrado"
              />
            )}

            {gastos.map((g) => (
              <TableRow>
                <TableTd>{formatarDate(g.data)}</TableTd>
                <TableTd text={g.carroMatricula} />
                <TableTd className={`font-medium`}>
                  {Number(g.valor).toFixed(2)} MT
                </TableTd>
                <TableTd>
                  <span className="text-emerald-950/60 text-xs">
                    {g.descricao}
                  </span>
                </TableTd>
                <TableTd>
                  <Badge variant={categoriaBadge[g.categoriaGasto]}>
                    {categoriaLabel[g.categoriaGasto]}
                  </Badge>
                </TableTd>
                <TableTd text={formatarDate(g.criadoEm)} />
                <TableTd>
                  <div className="flex gap-2">
                    <button
                      onClick={() => abrirEdicao(g)}
                      className="bg-blue-600/5 hover:bg-blue-600/15 p-1.5 rounded-lg border border-blue-600/10 transition-colors duration-300 ease-in cursor-pointer"
                    >
                      <PenBoxIcon size={14} className="text-blue-600/80" />
                    </button>
                    <button
                      onClick={() => excluir(g)}
                      className={`bg-red-600/5 hover:bg-red-600/15 p-1.5 rounded-lg border border-red-600/10  transition-colors duration-300 ease-in cursor-pointer`}
                      title={"Excluir"}
                    >
                      <Trash2 size={14} className="text-red-600/80" />
                    </button>
                  </div>
                </TableTd>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal de formulario */}
      <GastoFormModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarGastos}
        gasto={gastoEmEdicao}
      />
    </div>
  );
}
