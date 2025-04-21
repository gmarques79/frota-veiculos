"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:8000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.detail || "Erro ao cadastrar");
      }

      await resposta.json();
      router.push("/login");
    } catch (error: any) {
      setErro(error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado esquerdo - formulário */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
        <Card className="w-full max-w-md p-6 border border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCadastro} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
              />
              {erro && <p className="text-red-500 text-sm">{erro}</p>}

              <div className="flex gap-2">
                <Button type="submit">Cadastrar</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/")}
                >
                  Já tenho conta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Lado direito - imagem */}
      <div className="w-2/3 hidden md:block">
        <img
          src="/img/frota.jpg"
          alt="Imagem cadastro"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
