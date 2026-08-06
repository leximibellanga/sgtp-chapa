import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod'
import Modal from "../../../components/ui/Modal"
import Input from "../../../components/ui/Input"
import { atualizarCarro, criarCarro } from '../../../api/carroApi';
import { toast } from 'sonner';
import Button from '../../../components/ui/Button';

const schema = z.object({
    matricula: z.string().min(1, "A matricula e obrigatoria").max(20),
    modelo: z.string().min(1, "O modelo e obrigatorio").max(80),
    ano: z.coerce
        .number({ invalid_type_error: "Ano invalido" })
        .min(1980, "Ano invalido")
        .max((new Date().getFullYear() + 1), "Ano Invalido"),
    rota: z.string().min(1, "A Rota e obrigatorio").max(100),
});


export default function CarroFormModal({ open, onFechar, onSucess, carro }) {
    const isEdicao = Boolean(carro)

    const {
        register,
        handleSubmit,
        reset,
        formState: { erros, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            matricula: "",
            modelo: "",
            ano: "",
            rota: ""
        },
    })

    useEffect(() => {
        if (open) {
            reset(
                carro
                    ? { matricula: carro.matricula, modelo: carro.modelo, ano: carro.ano, rota: carro.rota }
                    : { matricula: "", modelo: "", ano: "", rota: "" }
            );
        }
    }, [open, carro, reset])

    async function onSubmit(dados) {
        try {
            if (isEdicao) {
                await atualizarCarro(carro.id, dados);
                toast.success("Carro atualizado com sucesso!")
            } else {
                await criarCarro(dados);
                toast.success("Carro cadastrado com sucesso!")
            }
            onSucess();
            onFechar();
        } catch (error) {
            const msg = error.response?.data?.erro || "Erro ao guardar o carro";
            console.log(error)
            toast.error(msg)
        }
    }

    return (
        <Modal open={open} onClose={onFechar} title={isEdicao ? "Editar carro" : "Novo carro"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Matricula"
                    placeholder="Ex: ABC-123-MC"
                    className="mb-2"
                    // error={erros.matricula?.message}
                    {...register("matricula")}
                />
                <Input
                    label="Modelo"
                    placeholder="Ex: Quantum"
                    className="mb-2"
                    // error={erros.modelo?.message}
                    {...register("modelo")}
                />
                <Input
                    label="Ano"
                    type="number"
                    placeholder="Ex: 2015"
                    className="mb-2"
                    // error={erros.ano?.message}
                    {...register("ano")}
                />
                <Input
                    label="Rota"
                    placeholder="Ex: T3 - Baixa"
                    className="mb-2"
                    // error={erros.rota?.message}
                    {...register("rota")}
                />

                <div className="flex gap-3 mt-5">
                    <Button type="button" variant="secondary" onClick={onFechar} className="flex-1">
                        Cancelar
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                        {isEdicao ? "Guardar" : "Cadastrar"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
