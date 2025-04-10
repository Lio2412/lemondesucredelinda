'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyDataPoint {
  month: string;
  recipes: number;
  creations: number;
  articles: number;
}

interface MonthlyContentChartProps {
  data: MonthlyDataPoint[];
}

export default function MonthlyContentChart({ data }: MonthlyContentChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Pas assez de données pour afficher le graphique mensuel.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: '12px', padding: '4px 8px' }}
          formatter={(value, name) => [`${value} ${name}`, undefined]} // Ajoute le nom (type) à la valeur
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="recipes" name="Recettes" fill="#ec4899" radius={[4, 4, 0, 0]} />
        <Bar dataKey="creations" name="Créations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="articles" name="Articles" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}