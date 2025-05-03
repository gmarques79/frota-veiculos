"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StatusBadge } from "@/components/statusBadge";
import { DataTable } from "@/components/genericTable";
import { CrudDialog } from "@/components/crudDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Condutor = {
  idmotorista: number;
  nome: string;
  cpf: string;
  cnh: string;
  tipo_cnh: string;
  ativo: boolean;
};

const CNH_TYPES = ["A", "B", "AB", "C", "D", "E"];

export default function CondutoresDashboard() {
  const [condutores, setCondutores] = useState<Condutor[]>([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [tipo, setTipo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const carregarCondutores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/motoristas");
      if (!response.ok) throw new Error("Erro ao buscar motoristas");
      const data = await response.json();
      console.log("Dados recebidos:", data)
      setCondutores(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os motoristas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarCondutores();
  }, []);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const cadastrarcondutor = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const novoCondutor = {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        cnh,
        tipo_cnh: tipo,
        ativo: true,
      };

      const response = await fetch("http://localhost:8000/motoristas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCondutor),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar motorista");

      toast.success("Motorista cadastrado com sucesso!");
      setNome("");
      setCpf("");
      setCnh("");
      setTipo("");
      setIsDialogOpen(false);
      carregarCondutores();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao cadastrar motorista");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Nome",
      accessor: (condutor: Condutor) => condutor.nome,
    },
    {
      header: "CPF",
      accessor: (condutor: Condutor) => condutor.cpf,
    },
    {
      header: "CNH",
      accessor: (condutor: Condutor) => condutor.cnh,
    },
    {
      header: "Status",
      accessor: (condutor: Condutor) => <StatusBadge isActive={condutor.ativo} />,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Motoristas Cadastrados</h1>

        <CrudDialog
          triggerText="Cadastrar Motorista"
          title="Novo Motorista"
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={cadastrarcondutor}
          isSubmitting={isSubmitting}
        >
              <Input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <Input
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                maxLength={14}
                required
              />
              <Input
                placeholder="CNH"
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                required
              />
              <Select onValueChange={setTipo} required>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de CNH" />
                </SelectTrigger>
                <SelectContent>
                  {CNH_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      Categoria {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
        </CrudDialog>
      </div>

      <DataTable
        data={condutores}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Nenhum motorista cadastrado"
      />
    </div>
  );
}
