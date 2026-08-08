import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { atualizarUsuarioPeloId, criarUsuario } from "../../../api/usuarioApi";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const schemaCriacao = z.object({
  nome: z.string().min(1, "O nome e obrigatorio").max(120),
  email: z.string().email("Email invalido"),
  telefone: z
    .string()
    .min(1, "O telefone e obrigatorio")
    .max(9, "Maximo 9 digitos"),
  senha: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
});

const schemaEdicao = z.object({
  nome: z.string().min(1, "O nome e obrigatorio").max(120),
  email: z.string().email("Email invalido"),
  telefone: z
    .string()
    .min(1, "O telefone e obrigatorio")
    .max(9, "Maximo 9 digitos"),
});

export default function UsuarioFormModal({
  open,
  onClose,
  onSuccess,
  usuario,
}) {
  const isEdicao = Boolean(usuario);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEdicao ? schemaEdicao : schemaCriacao),
    defaultValues: { nome: "", email: "", telefone: "", senha: "" },
  });

  useEffect(() => {
    if (open) {
      reset(
        usuario
          ? {
              nome: usuario.nome,
              email: usuario.email,
              telefone: usuario.telefone,
            }
          : { nome: "", email: "", telefone: "", senha: "" },
      );
    }
  }, [open, usuario, reset]);

  async function onSubmit(dados) {
    try {
      if (isEdicao) {
        await atualizarUsuarioPeloId(usuario.id, dados);
        toast.success("Usuario atualizado com sucesso!");
      } else {
        await criarUsuario({ ...dados, role: "MOTORISTA" });
        toast.success("Usuario cadastrado com sucesso!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.erro || "Erro ao guardar o usuario";
      toast.error(msg);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdicao ? "Editar usuario" : "Novo usuario"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome"
          placeholder="Nome completo"
          error={errors.nome?.message}
          {...register("nome")}
        />
        <Input
          label="Email"
          placeholder="motorista@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Telefone"
          placeholder="Ex: 82 123 4567"
          error={errors.telefone?.message}
          {...register("telefone")}
        />
        {!isEdicao && (
          <Input
            label="Senha"
            type="password"
            placeholder="Minimo 6 caracteres"
            error={errors.senha?.message}
            {...register("senha")}
          />
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEdicao ? "Guardar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
