'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ContentTypeDataPoint {
  name: string;
  value: number;
}

interface ContentTypePieChartProps {
  data: ContentTypeDataPoint[];
}

// Couleurs cohérentes avec les badges et le BarChart
const COLORS = ['#ec4899', '#3b82f6', '#f97316']; // Rose (Recettes), Bleu (Créations), Orange (Articles)

export default function ContentTypePieChart({ data }: ContentTypePieChartProps) {
  // Filtrer les types avec 0 éléments pour ne pas les afficher dans le PieChart
  const filteredData = data.filter(entry => entry.value > 0);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Aucune donnée de contenu à afficher.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip
          formatter={(value, name) => {
            // Assurer que value est un nombre et name est une string pour le formatage
            const numValue = typeof value === 'number' ? value : 0;
            const strName = String(name); // Convertit name en string
            const plural = numValue > 1 ? 's' : '';
            return [`${numValue} ${strName.toLowerCase()}${plural}`, undefined]; // ex: "15 recettes"
          }}
          contentStyle={{ fontSize: '12px', padding: '4px 8px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8" // Couleur par défaut (sera surchargée par Cell)
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Affiche seulement le pourcentage sur le graphique
          stroke="#fff" // Ajoute une bordure blanche entre les parts
          strokeWidth={1}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}