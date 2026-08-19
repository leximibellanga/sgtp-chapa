import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { criarRegisto } from "../../api/registoApi";
import { listarCarros } from "../../api/carroApi";

const META_DIARIA = 2000;

const schema = z.object({
  carroId: z.string().min(1, "Escolhe o carro"),
  tipoDia: z.enum(["UTIL", "DOMINGO"]),
  valorEntregue: z.coerce
    .number({ invalid_type_error: "Valor invalido" })
    .min(0, "Nao pode ser negativo"),
  justificativa: z.string().optional(),
});

export default function FormRegistoPage() {
  const [carros, setCarros] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      carroId: "",
      tipoDia: "UTIL",
      valorEntregue: "",
      justificativa: "",
    },
  });

  const tipoDia = watch("tipoDia");
  const valorEntregue = Number(watch("valorEntregue")) || 0;
  const precisaJustificar =
    tipoDia === "UTIL" && valorEntregue > 0 && valorEntregue < META_DIARIA;

  useEffect(() => {
    listarCarros(true).then(({ data }) => setCarros(data));
  }, []);

  async function onSubmit(dados) {
    if (precisaJustificar && !dados.justificativa?.trim()) {
      toast.error(
        "Justificativa e obrigatoria quando o valor e menor que a meta",
      );
      return;
    }

    try {
      await criarRegisto(dados);
      toast.success("Registo guardado com sucesso");
      navigate("/motorista/registos");
    } catch (err) {
      const mensagem = err.response?.data?.erro || "Erro ao guardar registo";
      toast.error(mensagem);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-bold text-emerald-950">
        Registar valor
      </h1>
      <p className="text-xs text-emerald-950/60 mb-6">
        Lanca o valor que entregaste hoje.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-emerald-950/10 rounded-lg px-4 pt-5 pb-6">
        <Select
          label="Carro"
          error={errors.carroId?.message}
          {...register("carroId")}
        >
          <option value="">Seleciona o carro</option>
          {carros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.matricula} — {c.modelo}
            </option>
          ))}
        </Select>

        <Select label="Tipo de dia" {...register("tipoDia")}>
          <option value="UTIL">{new Date().toLocaleDateString("pt-PT", {weekday: "long"})}</option>
          <option value="UTIL">Segunda-feira</option>
          <option value="UTIL">Terca-feira</option>
          <option value="UTIL">Quarta-feira</option>
          <option value="UTIL">Quinta-feira</option>
          <option value="UTIL">Sexta-feira</option>
          <option value="DOMINGO">Domingo trabalhado</option>
        </Select>

        {tipoDia === "UTIL" && (
          <div className="bg-emerald-700/10 text-emerald-700 text-xs rounded-lg px-4 py-3">
            Receita padrao:{" "}
            <strong>{META_DIARIA.toLocaleString("pt-PT")} MT</strong>
          </div>
        )}

        <Input
          label="Valor entregue (MT)"
          type="number"
          step="0.01"
          placeholder="2500"
          error={errors.valorEntregue?.message}
          {...register("valorEntregue")}
        />

        {precisaJustificar && (
          <div>
            <label className="block text-sm font-medium text-verde-mata mb-1.5">
              Justificativa
            </label>
            <textarea
              rows={3}
              placeholder="Explica porque nao atingiste a meta hoje..."
              className="w-full bg-emerald-950/5 border border-emerald-950/20 rounded-lg px-3.5 py-2.5 text-sm text-emerald-950/80 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-950/60 focus:bg-white transition resize-none"
              {...register("justificativa")}
            />
          </div>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Guardar registo
        </Button>
      </form>
    </div>
  );
}
