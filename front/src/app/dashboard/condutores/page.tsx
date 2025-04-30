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

export type Condutor = {
  idmotorista: number;
  nome: string;
  cpf: string;
  cnh: string;
  tipo_cnh: string;
  ativo: boolean;
};

export default function CondutoresDashboard() {
  const [condutores, setCondutores] = useState<Condutor[]>([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [tipo, setTipo] = useState("");

  const carregarCondutores = () => {
    fetch("http://localhost:8000/motoristas")
      .then((res) => res.json())
      .then(setCondutores)
      .catch((err) => console.error("Erro ao buscar Motoristas", err));
  };

  useEffect(() => {
    carregarCondutores();
  }, []);

  const cadastrarcondutor = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoCondutor = {
      nome,
      cpf,
      cnh,
      tipo_cnh: tipo,
      ativo: true,
    };

    await fetch("http://localhost:8000/motoristas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoCondutor),
    });

    setNome("");
    setCpf("");
    setCnh("");
    carregarCondutores();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Motoristas Cadastrados</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Cadastrar Condutor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Condutor</DialogTitle>
            </DialogHeader>
            <form onSubmit={cadastrarcondutor} className="space-y-4">
              <Input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <Input
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
              <Input
                placeholder="CNH"
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                required
              />
              <Input
                placeholder="Tipo de carteira"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
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
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>CNH</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {condutores.map((condutor) => (
            <TableRow key={condutor.idmotorista}>
              <TableCell>{condutor.nome}</TableCell>
              <TableCell>{condutor.cpf}</TableCell>
              <TableCell>{condutor.cnh}</TableCell>
              <TableCell>{condutor.ativo ? "Ativo" : "Inativo"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
