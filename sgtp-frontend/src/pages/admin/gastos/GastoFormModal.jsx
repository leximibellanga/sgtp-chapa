import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { listarCarros } from "../../../api/carroApi";
import { atualizarGasto, criarGasto } from "../../../api/gastoApi";
import { toast } from "sonner";
import Modal from "../../../components/ui/Modal";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const categorias = [
  { value: "MANUTENCAO", label: "Manutencao" },
  { value: "COMBUSTIVEL", label: "Combustivel" },
  { value: "DOCUMENTACAO", label: "Documentacao" },
  { value: "OUTROS", label: "Outros" },
];

const schema = z.object({
  carroId: z.string().min(1, "Escolhe o carro"),
  categoriaGasto: z.enum(
    ["MANUTENCAO", "COMBUSTIVEL", "DOCUMENTACAO", "OUTROS"],
    {
      errorMap: () => ({ message: "Escolhe uma categoria" }),
    },
  ),
  valor: z.coerce
    .number({ invalid_type_error: "Valor invalido" })
    .positive("O valor deve ser maior que zero"),
  data: z.string().min(1, "A data e obrigatoria"),
  descricao: z.string().min(1, "A descricao e obrigatoria").max(255),
});

export default function GastoFormModal({ open, onClose, onSuccess, gasto }) {
  const isEdicao = Boolean(gasto);
  const [carros, setCarros] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      carroId: "",
      categoriaGasto: "",
      valor: "",
      data: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (open) {
      listarCarros().then(({ data }) => setCarros(data));

      reset(
        gasto
          ? {
              carroId: String(gasto.carroId),
              categoriaGasto: gasto.categoriaGasto,
              valor: gasto.valor,
              data: gasto.data,
              descricao: gasto.descricao,
            }
          : {
              carroId: "",
              categoriaGasto: "",
              valor: "",
              data: new Date().toISOString().slice(0, 10),
              descricao: "",
            },
      );
    }
  }, [open, gasto, reset]);

  async function onSubmit(dados) {
    try {
      if (isEdicao) {
        await atualizarGasto(gasto.id, dados);
        toast.success("Gasto atualizado com sucesso");
      } else {
        await criarGasto(dados);
        toast.success("Gasto registado com sucesso");
      }
      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.erro || "Erro ao guardar o gasto";
      toast.error(msg);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdicao ? "Editar gasto" : "Novo gasto"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label={"Carro"}
          error={errors.carroId?.message}
          {...register("carroId")}
        >
          <option value="">Selecione o carro</option>
          {carros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.matricula} - {c.modelo}
            </option>
          ))}
        </Select>

        <Select
          label={"Categoria"}
          error={errors.categoriaGasto?.message}
          {...register("categoriaGasto")}
        >
          <option value="">Selecione a categoria</option>
          {categorias.map((cat) => (
            <option value={cat.value}>{cat.label}</option>
          ))}
        </Select>

        <Input
          label={"Valor (MT)"}
          type={"number"}
          step={"0.01"}
          placeholder={"Ex: 1500"}
          error={errors.valor?.message}
          {...register("valor")}
        />

        <Input
          label={"Data"}
          type={"date"}
          error={errors.data?.message}
          {...register("data")}
        />

        <Input
          label={"Descricao"}
          placeholder={"Ex: Abastecimento semanal"}
          error={errors.descricao?.message}
          {...register("descricao")}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {isEdicao ? "Guardar" : "Registar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
