import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Image, Video, TrendingUp } from 'lucide-react';
import type { View, GeneratedContent } from '../App';

interface DashboardProps {
  balance: number;
  onNavigate: (view: View) => void;
  history: GeneratedContent[];
}

export function Dashboard({ balance, onNavigate, history }: DashboardProps) {
  const monthlySpend = history.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar currentView="dashboard" onNavigate={onNavigate} />
      
      <div className="flex-1">
        <Header balance={balance} onNavigate={onNavigate} />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="mb-8">Dashboard</h1>
            
            {/* Create Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-8 border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer" onClick={() => onNavigate('generate')}>
                <div className="size-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
                  <Image className="size-6 text-white" />
                </div>
                <h3 className="mb-2">Crear nueva imagen</h3>
                <p className="text-neutral-600 mb-4">
                  Genera imágenes con IA desde 0.10 x402
                </p>
                <Button variant="outline">Comenzar →</Button>
              </Card>

              <Card className="p-8 border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer" onClick={() => onNavigate('generate')}>
                <div className="size-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
                  <Video className="size-6 text-white" />
                </div>
                <h3 className="mb-2">Crear nuevo video</h3>
                <p className="text-neutral-600 mb-4">
                  Genera videos con IA desde 0.50 x402
                </p>
                <Button variant="outline">Comenzar →</Button>
              </Card>
            </div>

            {/* Stats Card */}
            <Card className="p-8 mb-8 border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="size-5 text-neutral-600" />
                <h3>Gasto mensual</h3>
              </div>
              <div className="text-4xl mb-2">{monthlySpend.toFixed(2)} x402</div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900" style={{ width: `${Math.min((monthlySpend / 10) * 100, 100)}%` }}></div>
              </div>
              <p className="text-sm text-neutral-600 mt-2">{history.length} generaciones este mes</p>
            </Card>

            {/* Recent History */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2>Historial reciente</h2>
                <Button variant="ghost" onClick={() => onNavigate('history')}>Ver todo →</Button>
              </div>
              
              <div className="space-y-3">
                {history.map((item) => (
                  <Card key={item.id} className="p-4 border-neutral-200 hover:border-neutral-400 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.url} alt={item.prompt} className="size-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'image' ? (
                            <Image className="size-4 text-neutral-600" />
                          ) : (
                            <Video className="size-4 text-neutral-600" />
                          )}
                          <span className="text-sm text-neutral-600">{item.model}</span>
                        </div>
                        <p className="truncate mb-1">{item.prompt}</p>
                        <p className="text-sm text-neutral-600">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <div>{item.cost.toFixed(2)} x402</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
