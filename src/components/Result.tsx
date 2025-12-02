import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, RefreshCw, Share2, Heart, Sparkles } from 'lucide-react';
import type { View, GeneratedContent } from '../App';

interface ResultProps {
  content: GeneratedContent;
  onNavigate: (view: View) => void;
  onRegenerate: () => void;
}

const suggestedPrompts = [
  'Añadir más detalles en el fondo',
  'Cambiar la iluminación a atardecer',
  'Versión en estilo anime',
  'Aumentar saturación de colores',
];

export function Result({ content, onNavigate, onRegenerate }: ResultProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar currentView="result" onNavigate={onNavigate} />
      
      <div className="flex-1">
        <Header balance={150} onNavigate={onNavigate} />
        
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                ← Volver al Dashboard
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="md:col-span-2">
                <Card className="p-6 border-neutral-200 mb-6">
                  <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={content.url} 
                      alt={content.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button className="gap-2">
                      <Download className="size-4" />
                      Descargar
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={onRegenerate}>
                      <RefreshCw className="size-4" />
                      Regenerar
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="size-4" />
                      Compartir
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Heart className="size-4" />
                      Favoritos
                    </Button>
                  </div>
                </Card>

                {/* Suggested Re-prompts */}
                <Card className="p-6 border-neutral-200">
                  <h3 className="mb-4">Mejora tu resultado</h3>
                  <p className="text-neutral-600 mb-4">
                    Prueba estas variaciones basadas en tu prompt original
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedPrompts.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="gap-2 justify-start h-auto py-3 px-4"
                        onClick={onRegenerate}
                      >
                        <Sparkles className="size-4 flex-shrink-0" />
                        <span className="text-left">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Details */}
              <div className="md:col-span-1">
                <Card className="p-6 border-neutral-200 mb-6">
                  <h3 className="mb-4">Detalles</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-neutral-600 mb-1">Prompt utilizado</div>
                      <p className="text-sm">{content.prompt}</p>
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="text-sm text-neutral-600 mb-2">Información</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Tipo</span>
                          <span className="capitalize">{content.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Modelo</span>
                          <span>{content.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Fecha</span>
                          <span>{content.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">ID</span>
                          <span className="font-mono">#{content.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <div className="text-sm text-neutral-600 mb-1">Costo pagado</div>
                      <div className="text-2xl">{content.cost.toFixed(2)} x402</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-neutral-200 bg-neutral-50">
                  <h3 className="mb-2">💡 Consejo</h3>
                  <p className="text-sm text-neutral-600">
                    Los prompts más detallados y específicos generan mejores resultados. Incluye estilo, iluminación y composición.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
