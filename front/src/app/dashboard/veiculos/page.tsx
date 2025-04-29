"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


export type Veiculo = {
  id: number;
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

  const carregarVeiculos = () => {
    fetch("http://localhost:8000/veiculos")
      .then((res) => res.json())
      .then(setVeiculos)
      .catch((err) => console.error("Erro ao buscar veículos", err));
  };

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const cadastrarVeiculo = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoVeiculo = {
      modelo,
      placa,
      marca,
      ativo: true,
    };

    await fetch("http://localhost:8000/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoVeiculo),
    });

    setModelo("");
    setPlaca("");
    setMarca("");
    carregarVeiculos();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Veículos Cadastrados</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Cadastrar Veículo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Veículo</DialogTitle>
            </DialogHeader>
            <form onSubmit={cadastrarVeiculo} className="space-y-4">
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
              <DialogFooter>
                <Button type="submit">Cadastrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {veiculos.map((veiculo) => (
            <TableRow key={veiculo.idveiculo}>
              <TableCell>{veiculo.modelo}</TableCell>
              <TableCell>{veiculo.placa}</TableCell>
              <TableCell>{veiculo.marca}</TableCell>
              <TableCell>{veiculo.ativo ? "Inativo" : "Ativo"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
