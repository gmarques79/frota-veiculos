"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/genericTable";
import { CrudDialog } from "@/components/crudDialog";
import  LabeledInput  from "@/components/labeledinput";
import  LabeledSelect  from "@/components/labeledSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import base64Logo from "@/lib/logo";

import type { Veiculo } from "../veiculos/page";
import type { Condutor } from "../condutores/page";

type Saida = {
  idsaida: number;
  veiculo: Veiculo;
  motorista: Condutor;
  usuario: {
    idusuario: number;
    nome: string;
    email: string;
  };
  saida_prevista: string;
  chegada_prevista: string;
  saida_real: string | null;
  chegada_real: string | null;
  km_saida: string | null;
  km_chegada: string | null;
};

const gerarPDF = (saida: Saida) => {
  const doc = new jsPDF();
  const logoBase64 = base64Logo;

  // Logo e título
  doc.addImage(logoBase64, "PNG", 150, 10, 40, 20);
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("Relatório de Saída de Veículo", 20, 30);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Conteúdo
  doc.setFontSize(12);
  let y = 50;
  const linha = (label: string, valor: string | null) => {
    doc.setFont("times", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("times", "normal");
    doc.text(valor || "N/A", 70, y);
    y += 10;
  };

  linha("Veículo", `${saida.veiculo.modelo} - ${saida.veiculo.placa}`);
  linha("Motorista", saida.motorista.nome);
  linha("Usuário", `${saida.usuario.nome} (${saida.usuario.email})`);
  linha("Saída Prevista", saida.saida_prevista);
  linha("Chegada Prevista", saida.chegada_prevista);
  linha("Saída Real", saida.saida_real);
  linha("Chegada Real", saida.chegada_real);

  doc.save(`saida-${saida.idsaida}.pdf`);
};

export default function SaidasDashboard() {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Condutor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // estados para nova saída
  const [idVeiculo, setIdVeiculo] = useState<number>();
  const [idMotorista, setIdMotorista] = useState<number>();
  const [saidaPrevista, setSaidaPrevista] = useState("");
  const [chegadaPrevista, setChegadaPrevista] = useState("");
  const [saidaReal, setSaidaReal] = useState("");
  const [chegadaReal, setChegadaReal] = useState("");
  const [kmSaida, setKmSaida] = useState("");
  const [kmChegada, setKmChegada] = useState("");

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [saidasRes, veiculosRes, motoristasRes] = await Promise.all([
        fetch("http://localhost:8000/saidas"),
        fetch("http://localhost:8000/veiculos"),
        fetch("http://localhost:8000/motoristas"),
      ]);

      if (!saidasRes.ok || !veiculosRes.ok || !motoristasRes.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const [saidasData, veiculosData, motoristasData] = await Promise.all([
        saidasRes.json(),
        veiculosRes.json(),
        motoristasRes.json(),
      ]);

      setSaidas(saidasData);
      setVeiculos(veiculosData);
      setMotoristas(motoristasData);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const cadastrarSaida = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const novaSaida = {
        id_veiculo: idVeiculo,
        id_motorista: idMotorista,
        id_usuario: 1,
        saida_prevista: saidaPrevista,
        chegada_prevista: chegadaPrevista,
        saida_real: saidaReal || null,
        chegada_real: chegadaReal || null,
        km_saida: kmSaida || null,
        km_chegada: kmChegada || null,
      };

      const response = await fetch("http://localhost:8000/saidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaSaida),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar saída");

      toast.success("Saída cadastrada com sucesso!");
      resetarFormulario();
      await carregarDados();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao cadastrar saída");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetarFormulario = () => {
    setIdVeiculo(undefined);
    setIdMotorista(undefined);
    setSaidaPrevista("");
    setChegadaPrevista("");
    setSaidaReal("");
    setChegadaReal("");
    setKmSaida("");
    setKmChegada("");
    setIsDialogOpen(false);
  };

  const columns = [
    {
      header: "Nº",
      accessor: (saida: Saida) => saida.idsaida,
    },
    {
      header: "Veículo",
      accessor: (saida: Saida) => `${saida.veiculo.modelo.toUpperCase()} - ${saida.veiculo.placa.toUpperCase()}`,
    },
    {
      header: "Motorista",
      accessor: (saida: Saida) => saida.motorista.nome.toUpperCase(),
    },
    {
      header: "Saída Prevista",
      accessor: (saida: Saida) => saida.saida_prevista,
    },
    {
      header: "Chegada Prevista",
      accessor: (saida: Saida) => saida.chegada_prevista,
    },
    {
      header: "Ações",
      accessor: (saida: Saida) => (
        <Button onClick={() => gerarPDF(saida)}>Gerar PDF</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Saídas Cadastradas</h1>

        <CrudDialog
          triggerText="Cadastrar Saída"
          title="Nova Saída"
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={cadastrarSaida}
          isSubmitting={isSubmitting}
        >
          <LabeledSelect
            label="Veículo"
            options={veiculos.map(v => ({ 
              value: v.idveiculo.toString(), 
              label: `${v.modelo} - ${v.placa}` 
            }))}
            onChange={(value: string) => setIdVeiculo(Number(value))}
            required={true}  // Now properly typed
          />

          <LabeledSelect
            label="Motorista"
            options={motoristas.map(m => ({ 
              value: m.idmotorista.toString(), 
              label: m.nome 
            }))}
            onChange={(value: string) => setIdMotorista(Number(value))}
            required={true}
          />

          <LabeledInput
            label="Saída Prevista"
            type="datetime-local"
            value={saidaPrevista}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaidaPrevista(e.target.value)}
            required
          />

          <LabeledInput
            label="Chegada Prevista"
            type="datetime-local"
            value={chegadaPrevista}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChegadaPrevista(e.target.value)}
            required
          />

          <LabeledInput
            label="Saída Real"
            type="datetime-local"
            value={saidaReal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaidaReal(e.target.value)}
          />

          <LabeledInput
            label="Chegada Real"
            type="datetime-local"
            value={chegadaReal}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChegadaReal(e.target.value)}
          />

          <Input
            type="number"
            placeholder="KM de Saída"
            value={kmSaida}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKmSaida(e.target.value)}
          />

          <Input
            type="number"
            placeholder="KM de Chegada"
            value={kmChegada}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKmChegada(e.target.value)}
          />
        </CrudDialog>
      </div>

      <DataTable
        data={saidas}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Nenhuma saída cadastrada"
      />
    </div>
  );
}