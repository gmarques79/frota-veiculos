"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/genericTable";
import { CrudDialog } from "@/components/crudDialog";
import LabeledInput from "@/components/labeledinput";
import LabeledSelect from "@/components/labeledSelect";
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
  autorizador: string;
  autorizado: boolean;
  saida_real: string | null;
  chegada_real: string | null;
  km_saida: string | null;
  km_chegada: string | null;
};

type Usuario = {
  idusuario: number;
  nome: string;
  email: string;
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
  linha("Autorizador", saida.autorizador);
  linha("Saída Real", saida.saida_real);
  linha("Chegada Real", saida.chegada_real);

  doc.save(`saida-${saida.idsaida}.pdf`);
};

export default function SaidasDashboard() {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [motoristas, setMotoristas] = useState<Condutor[]>([]);
  const [ usuarios, setUsuarios ] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // estados para nova saída
  const [idVeiculo, setIdVeiculo] = useState<string>();
  const [idMotorista, setIdMotorista] = useState<string>();
  const [saidaPrevista, setSaidaPrevista] = useState("");
  const [chegadaPrevista, setChegadaPrevista] = useState("");
  const [ autorizador, setAutorizador] = useState("");
  const [ autorizado, setAutorizado] = useState("");
  const [saidaReal, setSaidaReal] = useState("");
  const [chegadaReal, setChegadaReal] = useState("");
  const [kmSaida, setKmSaida] = useState("");
  const [kmChegada, setKmChegada] = useState("");

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [saidasRes, veiculosRes, motoristasRes, usuarioRes] = await Promise.all([
        fetch("http://localhost:8000/saidas"),
        fetch("http://localhost:8000/veiculos"),
        fetch("http://localhost:8000/motoristas"),
        fetch("http://localhost:8000/usuarios"),
      ]);

      if (!saidasRes.ok || !veiculosRes.ok || !motoristasRes.ok || !usuarioRes.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const [saidasData, veiculosData, motoristasData, usuariosData] = await Promise.all([
        saidasRes.json(),
        veiculosRes.json(),
        motoristasRes.json(),
        usuarioRes.json(),
      ]);

      setSaidas(saidasData);
      setVeiculos(veiculosData);
      setMotoristas(motoristasData);
      setUsuarios(usuariosData);
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

  useEffect(() => {
    if (isDialogOpen && editingId) {
      const saida = saidas.find(s => s.idsaida === editingId);
      if (saida) {
        handleEdit(saida);
      }
    }
  }, [isDialogOpen, editingId, saidas]);

  const resetarFormulario = () => {
    setIdVeiculo(undefined);
    setIdMotorista(undefined);
    setSaidaPrevista("");
    setChegadaPrevista("");
    setAutorizador("");
    setAutorizado("");
    setSaidaReal("");
    setChegadaReal("");
    setKmSaida("");
    setKmChegada("");
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (saida: Saida) => {
    console.log('Data raw (saída_prevista):', saida.saida_prevista);
    setEditingId(saida.idsaida);
    
    // Preenche os campos do formulário
    setIdVeiculo(String(saida.veiculo.idveiculo));
    console.log("idVeiculo setado para:", saida.veiculo.idveiculo.toString());
    setIdMotorista(String(saida.motorista.idmotorista));
    console.log("idmotorista setado para:", saida.motorista.idmotorista.toString());
    setSaidaPrevista(formatDateTimeForInput(saida.saida_prevista));
    console.log('Data formatted (saída_prevista):', saida.saida_prevista);
    setChegadaPrevista(formatDateTimeForInput(saida.chegada_prevista));
    console.log("chegada prevista setado para:", saida.chegada_prevista.toString());
    setAutorizador(String(saida.autorizador));
    console.log("Autorizador setado para:", saida.autorizador?.toString());
    setAutorizado(saida.autorizado ? "true" : "false");
    console.log("Autorizado setado para:", saida.autorizado?.toString());
    setSaidaReal(saida.saida_real ? formatDateTimeForInput(saida.saida_real) : '');
    console.log("saida real setado para:", saida.saida_real?.toString());
    setChegadaReal(saida.chegada_real ? formatDateTimeForInput(saida.chegada_real) : '');
    console.log("chegada real setado para:", saida.chegada_real?.toString());
    setKmSaida(saida.km_saida || '');
    setKmChegada(saida.km_chegada || '');
    
    setIsDialogOpen(true);
  };
  // Função auxiliar para formatar datas para input datetime-local
  const formatDateTimeForInput = (dateStr: string | null) => {
    if (!dateStr) return "";
    
    // Garante que a data está no formato correto (YYYY-MM-DDTHH:MM)
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ""; // Se data inválida
    
    // Formata para o padrão do datetime-local
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id_veiculo: Number(idVeiculo),
        id_motorista: Number(idMotorista),
        id_usuario: 1,
        saida_prevista: saidaPrevista,
        chegada_prevista: chegadaPrevista,
        autorizador: autorizador,
        autorizado: autorizado === "true",
        saida_real: saidaReal || null,
        chegada_real: chegadaReal || null,
        km_saida: kmSaida || null,
        km_chegada: kmChegada || null,
      };

      const url = editingId 
        ? `http://localhost:8000/saidas/${editingId}`
        : 'http://localhost:8000/saidas';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(editingId ? "Erro ao atualizar saída" : "Erro ao cadastrar saída");

      toast.success(editingId ? "Saída atualizada com sucesso!" : "Saída cadastrada com sucesso!");
      resetarFormulario();
      await carregarDados();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Falha ao atualizar saída" : "Falha ao cadastrar saída");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex space-x-2">
          <Button onClick={() => gerarPDF(saida)}>Gerar PDF</Button>
          <Button variant="outline" onClick={() => handleEdit(saida)}>
            Editar
          </Button>
        </div>
      ),
    },
  ];

  console.log("Estado atual do idVeiculo:", idVeiculo);
  console.log("Estado atual do idmotorista:", idMotorista);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Saídas Cadastradas</h1>

        <CrudDialog
          triggerText={editingId ? "Editar Saída" : "Cadastrar Saída"}
          title={editingId ? "Editar Saída" : "Nova Saída"}
          isOpen={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetarFormulario();
            setIsDialogOpen(open);
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        >
          <div className="grid grid-cols-2 gap-4">
          <LabeledSelect
            label="Veículo"
            options={veiculos.map(v => ({ 
              value: v.idveiculo.toString(), 
              label: `${v.modelo} - ${v.placa}`,
            }))}
            value={idVeiculo?.toString()}
            onChange={(value: string) => setIdVeiculo((value))}
            required
          />
          
          <LabeledSelect
            label="Motorista"
            options={motoristas.map(m => ({ 
              value: m.idmotorista.toString(), 
              label: m.nome,
            }))}
            value={idMotorista?.toString()}
            onChange={(value: string) => setIdMotorista((value))}
            required
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

          <LabeledSelect
            label="Autorizador"
            options={usuarios.map(u => ({ 
              value: u.idusuario.toString(), 
              label: u.nome,
            }))}
            value={autorizador}
            onChange={(value: string) => setAutorizador(value)}
            required
          />

          <LabeledSelect
            label="Autorizado"
            options={[
              { value: "true", label: "Sim" },
              { value: "false", label: "Não" },
            ]}
            value={autorizado}
            onChange={(value: string) => setAutorizado(value)}
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
          </div>
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