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


type Saida = {
  idsaida: number;
  veiculo: Veiculo;
  motorista: Condutor;
  id_usuario: {
    idusuario: number;
    nome: string;
    email: string;
  };
  saida_prevista: string;
  chegada_prevista: string;
  saida_real: string | null;
  chegada_real: string | null;
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
      id_condutor: idMotorista,
      id_usuario: 1, 
      saida_prevista: saidaPrevista,
      chegada_prevista: chegadaPrevista,
      saida_real: null,
      chegada_real: null,
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

              {/* Inputs de datas previstas */}
              <Input
                type="datetime-local"
                value={saidaPrevista}
                onChange={(e) => setSaidaPrevista(e.target.value)}
                required
              />
              <Input
                type="datetime-local"
                value={chegadaPrevista}
                onChange={(e) => setChegadaPrevista(e.target.value)}
                required
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
            <TableHead>Veículo</TableHead>
            <TableHead>Motorista</TableHead>
            <TableHead>Saída Prevista</TableHead>
            <TableHead>Chegada Prevista</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saidas.map((saida) => (
            <TableRow key={saida.idsaida}>
              <TableCell>{saida.veiculo.modelo} - {saida.veiculo.placa}</TableCell>
              <TableCell>{saida.motorista.nome}</TableCell>
              <TableCell>{saida.saida_prevista}</TableCell>
              <TableCell>{saida.chegada_prevista}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
