import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutProps {
  keys: string[];
  description: string;
}

interface KeyboardShortcutsDialogProps {
  shortcuts: { key: string; description: string; }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Définir le composant interne pour afficher un raccourci
function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <kbd key={i} className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsDialog({ shortcuts, open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raccourcis Clavier</DialogTitle>
          <DialogDescription>
            Utilisez ces raccourcis pour naviguer plus rapidement dans la recette.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <Shortcut
              key={index}
              keys={[shortcut.key]}
              description={shortcut.description}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}