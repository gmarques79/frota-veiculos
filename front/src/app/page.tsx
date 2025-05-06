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
import { Loader2 } from "lucide-react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.detail || "Erro no login");
      }

      const data = await resposta.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard/home");
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado esquerdo - formulário */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
        <Card className="w-full max-w-md p-6 border border-gray-300 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              {erro && <p className="text-red-500 text-sm">{erro}</p>}

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Carregando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/cadastro")}
                  disabled={isLoading}
                >
                  Cadastrar
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
          alt="Imagem login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
