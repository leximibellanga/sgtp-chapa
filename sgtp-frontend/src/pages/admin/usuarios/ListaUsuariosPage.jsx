import { useEffect, useState } from "react";
import {
  ativarUsuarioPeloId,
  desativarUsuarioPeloId,
  listarUsuarios,
} from "../../../api/usuarioApi";
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
import formatarData from "../../../utils/formatDate";
import { Filter, PenBoxIcon, Plus, Power } from "lucide-react";
import Button from "../../../components/ui/Button";
import UsuarioFormModal from "./FormUsuariosPage";

export default function ListaUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [filtroRole, setFiltroRole] = useState("MOTORISTA"); // "" | "MOTORISTAS" | "ADMIN"

  // carregar usuarios da BD
  async function carregarUsuarios() {
    setCarregando(true);

    try {
      const { data } = await listarUsuarios(filtroRole);
      setUsuarios(data);
      console.log(usuarios);
    } catch (error) {
      toast.error("Erro ao carregar usuarios");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, [filtroRole]);

  function abrirNovo() {
    setUsuarioEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setUsuarioEmEdicao(usuario);
    setModalAberto(true);
  }

  async function alternarStatus(usuario) {
    try {
      if (usuario.ativo) {
        await desativarUsuarioPeloId(usuario.id);
        carregarUsuarios();
        toast.success(`${usuario.nome} desativado com sucesso!`);
      } else {
        await ativarUsuarioPeloId(usuario.id);
        carregarUsuarios();
        toast.success(`${usuario.nome} ativado com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao alterar status do usuario!");
    }
  }

  const titulosTabela = [
    "Nome",
    "Email",
    "Telefone",
    "Perfil",
    "Status",
    "Data de criacao",
    "Acoes",
  ];

  return (
    <div>
      <div className="flex flex-col mb-6">
        <h1 className="font-bold text-2xl text-emerald-950">Usuarios</h1>
        <p className="text-emerald-950/60 text-sm">
          Listagem de usuarios da empresa.
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
                value={filtroRole}
                onChange={(e) => setFiltroRole(e.target.value)}
                className="w-50 bg-emerald-950/5 px-2 py-2 text-sm text-emerald-950/80 rounded-lg outline-none border border-emerald-950/20 cursor-pointer hover:bg-emerald-950/10 transition-colors duration-300"
              >
                <option value="MOTORISTA">Motoristas</option>
                <option value="ADMIN">Administradores</option>
                <option value="">Todos</option>
              </select>
              <Button onClick={() => carregarUsuarios()}>
                <Filter size={13} />
              </Button>
            </div>
            <Button icon={Plus} onClick={abrirNovo}>
              Novo usuario
            </Button>
          </div>

          <Table>
            <TableHead>
              {titulosTabela.map((usuario) => (
                <TableTh key={usuario} titulo={usuario} />
              ))}
            </TableHead>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableTdEmpty
                  colSpan={7}
                  textEmpty="Nenhum usuario foi encontrado."
                />
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableTd text={usuario.nome} className={`font-medium`} />
                    <TableTd text={usuario.email} />
                    <TableTd text={usuario.telefone} />
                    <TableTd text={usuario.role} className={`font-medium`} />
                    <TableTd>
                      <Badge variant={`${usuario.ativo ? "sucesso" : "erro"}`}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableTd>
                    <TableTd>{formatarData(usuario.criadoEm)}</TableTd>
                    <TableTd>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicao(usuario)}
                          className="bg-blue-600/5 hover:bg-blue-600/15 p-1.5 rounded-lg border border-blue-600/10 transition-colors duration-300 ease-in cursor-pointer"
                        >
                          <PenBoxIcon size={14} className="text-blue-600/80" />
                        </button>
                        <button
                          onClick={() => alternarStatus(usuario)}
                          className={`p-1.5 rounded-lg border transition-colors duration-300 ease-in cursor-pointer
                                    ${
                                      usuario.ativo
                                        ? "bg-red-600/5 hover:bg-red-600/15 border-red-600/10"
                                        : "bg-emerald-600/5 hover:bg-emerald-600/15 border-emerald-600/10"
                                    }`}
                          title={usuario.ativo ? "Desativar" : "Ativar"}
                        >
                          <Power
                            size={14}
                            className={`${usuario.ativo ? "text-red-600/80" : "text-green-600/80"}`}
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

      <UsuarioFormModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarUsuarios}
        usuario={usuarioEmEdicao}
      />
    </div>
  );
}
