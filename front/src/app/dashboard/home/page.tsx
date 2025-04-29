"use client";

import { useEffect, useState } from "react";
import { ResponsivePie } from '@nivo/pie'

export default function DashboardHome() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/statics")
      .then((res) => res.json())
      .then(setDados)
      .catch((err) => console.error("Erro ao carregar dados", err));
  }, []);

  if (!dados) return <p>Carregando...</p>;

  const dataCarros = [
    { id: "Ativos", label: "Ativos", value: dados.carros.ativos },
    { id: "Inativos", label: "Inativos", value: dados.carros.inativos }
  ];

  const dataCondutores = [
    { id: "Ativos", label: "Ativos", value: dados.motoristas.ativos },
    { id: "Inativos", label: "Inativos", value: dados.motoristas.inativos }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Resumo do Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Carros</h2>
          <div style={{ height: 300 }}>
          <ResponsivePie
              data={dataCarros}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "paired" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            />
        </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Condutores</h2>
          <div style={{ height: 300 }}>
          <ResponsivePie
              data={dataCondutores}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "set2" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            />
        </div>
        </div>
      </div>
    </div>
  );
}
