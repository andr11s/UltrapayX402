import { Button } from './ui/button';
import { Plus, Wallet, Bell } from 'lucide-react';
import type { View } from '../App';

interface HeaderProps {
  balance: number;
  onNavigate: (view: View) => void;
}

export function Header({ balance, onNavigate }: HeaderProps) {
  return (
    <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 px-6 lg:px-8 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        {/* Spacer */}
        <div></div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="size-10 rounded-xl bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors relative">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full" />
          </button>

          {/* Balance card */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-primary/20 rounded-xl">
            <div className="size-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="size-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Saldo</div>
              <div className="font-bold text-primary">{balance.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">x402</span></div>
            </div>
          </div>

          {/* Add funds button */}
          <Button size="sm" className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Recargar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
