"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/genericTable";
import { CrudDialog } from "@/components/crudDialog";
import { StatusBadge } from "@/components/statusBadge";
import { Input } from "@/components/ui/input";

export type Veiculo = {
  idveiculo: number;
  modelo: string;
  placa: string;
  marca: string;
  ativo: boolean;
};

export default function VeiculosDashboard() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const carregarVeiculos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/veiculos");
      if (!response.ok) throw new Error("Erro ao buscar veículos");
      const data = await response.json();
      setVeiculos(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os veículos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const cadastrarVeiculo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const novoVeiculo = {
        modelo,
        placa,
        marca,
        ativo: true,
      };

      const response = await fetch("http://localhost:8000/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVeiculo),
      });
      console.log("Dados recebidos:", novoVeiculo.ativo)

      if (!response.ok) throw new Error("Erro ao cadastrar veículo");

      toast.success("Veículo cadastrado com sucesso!");
      setModelo("");
      setPlaca("");
      setMarca("");
      setIsDialogOpen(false);
      carregarVeiculos();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao cadastrar veículo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Modelo",
      accessor: (veiculo: Veiculo) => veiculo.modelo.toUpperCase(),
    },
    {
      header: "Placa",
      accessor: (veiculo: Veiculo) => veiculo.placa.toUpperCase(),
    },
    {
      header: "Marca",
      accessor: (veiculo: Veiculo) => veiculo.marca.toUpperCase(),
    },
    {
      header: "Status",
      accessor: (veiculo: Veiculo) => (
        <StatusBadge isActive={veiculo.ativo} />
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Veículos Cadastrados</h1>

        <CrudDialog
          triggerText="Cadastrar Veículo"
          title="Novo Veículo"
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={cadastrarVeiculo}
          isSubmitting={isSubmitting}
        >
          <Input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
          <Input
            placeholder="Placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            required
          />
          <Input
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          />
        </CrudDialog>
      </div>

      <DataTable
        data={veiculos}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Nenhum veículo cadastrado"
      />
    </div>
  );
}