"use client";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 


import { Veiculo } from "../veiculos/page";
import { Condutor } from "../condutores/page";

import jsPDF from "jspdf";
import base64Logo from "@/lib/logo";

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
  console.log(saida)
  const doc = new jsPDF();

  const logoBase64 = base64Logo; // sua imagem convertida

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

  // estados para nova saída
  const [idVeiculo, setIdVeiculo] = useState<number | undefined>();
  const [idMotorista, setIdMotorista] = useState<number | undefined>();
  const [saidaPrevista, setSaidaPrevista] = useState("");
  const [chegadaPrevista, setChegadaPrevista] = useState("");
  const [saidaReal, setSaidaReal] = useState<string | undefined>("");
  const [chegadaReal, setChegadaReal] = useState<string | undefined>("");
  const [km_saida, setKmSaida] = useState("");
  const [km_chegada, setKmChegada] = useState("");
  

  const carregarSaidas = () => {
    fetch("http://localhost:8000/saidas")
      .then((res) => res.json())
      .then(setSaidas)
      .catch((err) => console.error("Erro ao buscar saídas", err));
  };

  const carregarVeiculos = () => {
    fetch("http://localhost:8000/veiculos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados recebidos (veículos):", data); // Verifique a estrutura dos dados
        setVeiculos(data);
      })
      .catch((err) => console.error("Erro ao buscar veículos", err));
  };

  const carregarMotoristas = () => {
    fetch("http://localhost:8000/motoristas")
      .then((res) => res.json())
      .then(setMotoristas)
      .catch((err) => console.error("Erro ao buscar motoristas", err));
  };

  useEffect(() => {
    carregarSaidas();
    carregarVeiculos();
    carregarMotoristas();
  }, []);

  const cadastrarSaida = async (e: React.FormEvent) => {
    e.preventDefault();

    const novaSaida = {
      id_veiculo: idVeiculo,
      id_motorista: idMotorista,
      usuario: 1, 
      saida_prevista: saidaPrevista,
      chegada_prevista: chegadaPrevista,
      saida_real: saidaReal || null, // se vazio, será null
      chegada_real: chegadaReal || null, // se vazio, será null
      km_saida: km_saida === "" ? null : km_saida,
      km_chegada: km_chegada === "" ? null : km_chegada,
    };

    await fetch("http://localhost:8000/saidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaSaida),
    });

    // resetar campos
    setIdVeiculo(undefined);
    setIdMotorista(undefined);
    setSaidaPrevista("");
    setChegadaPrevista("");
    setSaidaReal("");
    setChegadaReal("");
    setKmSaida("");
    setKmChegada("");
    carregarSaidas();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Saídas Cadastradas</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Cadastrar Saída</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Saída</DialogTitle>
            </DialogHeader>
            <form onSubmit={cadastrarSaida} className="space-y-4">
              {/* Selecionar Veículo */}
                <Select onValueChange={(value) => setIdVeiculo(Number(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o Veículo" />
                </SelectTrigger>
                <SelectContent>
                    {veiculos.map((veiculo) => (
                    <SelectItem key={veiculo.idveiculo} value={veiculo.idveiculo.toString()}>
                        {veiculo.modelo} - {veiculo.placa}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

              {/* Selecionar Motorista */}
              <Select onValueChange={(value) => setIdMotorista(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Motorista" />
                </SelectTrigger>
                <SelectContent>
                  {motoristas.map((motorista) => (
                    <SelectItem key={motorista.idmotorista} value={motorista.idmotorista.toString()}>
                      {motorista.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                {/* Campos de data e hora prevista */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Saída Prevista</label>
                  <Input
                    type="datetime-local"
                    value={saidaPrevista}
                    onChange={(e) => setSaidaPrevista(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Chegada Prevista</label>
                  <Input
                    type="datetime-local"
                    value={chegadaPrevista}
                    onChange={(e) => setChegadaPrevista(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Saída Real </label>
                  <Input
                    type="datetime-local"
                    value={saidaReal}
                    onChange={(e) => setSaidaReal(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Chegada Real </label>
                  <Input
                    type="datetime-local"
                    value={chegadaReal}
                    onChange={(e) => setChegadaReal(e.target.value)}
                  />
                </div>

              <Input
                type="number"
                placeholder="KM de Saída"
                value={km_saida}
                onChange={(e) => setKmSaida(e.target.value)}
              />
              <Input
                type="number"
                placeholder="KM de Chegada"
                value={km_chegada}
                onChange={(e) => setKmChegada(e.target.value)}
              />

              <DialogFooter>
                <Button type="submit">Cadastrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de saídas */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>Saída Prevista</TableHead>
            <TableHead>Chegada Prevista</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saidas.map((saida) => (
            <TableRow key={saida.idsaida}>
              <TableCell>{saida.idsaida}</TableCell>
              <TableCell>{saida.veiculo.modelo.toUpperCase()} - {saida.veiculo.placa.toUpperCase()}</TableCell>
              <TableCell>{saida.motorista.nome.toUpperCase()}</TableCell>
              <TableCell>{saida.saida_prevista}</TableCell>
              <TableCell>{saida.chegada_prevista}</TableCell>
              <TableCell>
                <Button onClick={() => gerarPDF(saida)}>Gerar PDF</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
