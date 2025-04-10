'use client';

import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Définir un type plus précis pour les données attendues par ce composant
type ContentItem = {
  id: string;
  title: string;
  createdAt: Date;
  type: 'recipe' | 'creation' | 'article';
};

interface RecentContentTableProps {
  data: ContentItem[];
}

// Mapping des types vers les couleurs de badge et les chemins d'édition
const contentTypeConfig = {
  recipe: { color: 'bg-pink-500 hover:bg-pink-600', path: 'recipes' },
  creation: { color: 'bg-blue-500 hover:bg-blue-600', path: 'creations' },
  article: { color: 'bg-orange-500 hover:bg-orange-600', path: 'articles' },
};

export default function RecentContentTable({ data }: RecentContentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">Date d'ajout</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              Aucun contenu récent trouvé.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const config = contentTypeConfig[item.type];
            const editUrl = `/admin/${config.path}/${item.id}/edit`;
            return (
              <TableRow key={`${item.type}-${item.id}`}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="default" className={`${config.color} text-white`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={editUrl}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Éditer</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}