import React from 'react';
import {
  Utensils,
  Scale,
  Thermometer,
  UtensilsCrossed,
  FlameKindling,
  Waves,
  Timer,
  Ruler,
  Container,
  Snowflake,
  LucideProps,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const equipmentIcons: { [key: string]: React.FC<LucideProps> } = {
  'bol': Utensils,
  'balance': Scale,
  'thermomètre': Thermometer,
  'fouet': UtensilsCrossed,
  'four': FlameKindling,
  'batteur': Waves,
  'minuteur': Timer,
  'rouleau': Ruler,
  'réfrigérateur': Container,
  'congélateur': Snowflake,
};

interface EquipmentItemProps {
  name: string;
}

export function EquipmentItem({ name }: EquipmentItemProps) {
  // Récupérer le composant icône basé sur le nom, avec Utensils comme fallback
  const Icon = equipmentIcons[name.toLowerCase()] || Utensils;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gray-100">
              <Icon 
                className="w-5 h-5 text-primary" 
                aria-hidden="true"
              />
            </div>
            <span>{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Équipement requis : {name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 