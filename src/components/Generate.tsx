import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Loader2, Sparkles, Wand2, Image, Video, Zap, CheckCircle2 } from 'lucide-react';
import type { View, GeneratedContent } from '../App';

interface GenerateProps {
  balance: number;
  onNavigate: (view: View) => void;
  onGenerate: (content: Omit<GeneratedContent, 'id' | 'date'>) => void;
  onDisconnect: () => void;
}

const models = [
  { id: 'sd35', name: 'SD3.5', type: 'image', cost: 0.15, description: 'Alta calidad, versatil' },
  { id: 'veo3', name: 'Veo 3', type: 'video', cost: 0.85, description: 'Videos realistas' },
  { id: 'runway', name: 'Runway Gen-3', type: 'video', cost: 1.20, description: 'Cinematografico' },
  { id: 'nanobanana', name: 'NanoBanana', type: 'image', cost: 0.10, description: 'Rapido y economico' },
  { id: 'midjourney', name: 'Midjourney', type: 'image', cost: 0.20, description: 'Artistico premium' },
];

const resolutions = ['512x512', '1024x1024', '1920x1080', '2048x2048'];
const durations = ['5s', '10s', '15s', '30s'];
const styles = ['Realista', 'Artistico', 'Anime', 'Abstracto', '3D Render', 'Cinematico'];

export function Generate({ balance, onNavigate, onGenerate, onDisconnect }: GenerateProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sd35');
  const [resolution, setResolution] = useState('1024x1024');
  const [duration, setDuration] = useState('10s');
  const [style, setStyle] = useState('Realista');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentModel = models.find(m => m.id === selectedModel);
  const estimatedCost = currentModel?.cost || 0;
  const canGenerate = prompt.trim().length > 0 && balance >= estimatedCost;

  const handleGenerate = async () => {
    if (!prompt.trim() || !currentModel) return;

    setIsGenerating(true);

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockUrls = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    ];

    onGenerate({
      prompt,
      type: currentModel.type as 'image' | 'video',
      model: currentModel.name,
      cost: estimatedCost,
      url: mockUrls[Math.floor(Math.random() * mockUrls.length)],
    });

    setIsGenerating(false);
  };

  const promptSuggestions = [
    'Un paisaje futurista con montanas flotantes',
    'Retrato de un astronauta en Marte',
    'Ciudad cyberpunk con luces neon',
    'Bosque magico con criaturas fantasticas',
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView="generate" onNavigate={onNavigate} onDisconnect={onDisconnect} />

      <div className="flex-1">
        <Header balance={balance} onNavigate={onNavigate} />

        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Wand2 className="size-5 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold">Crear contenido</h1>
              </div>
              <p className="text-muted-foreground">Describe tu vision y deja que la IA la haga realidad</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Prompt Card */}
                <Card className="p-6 border-border/50">
                  <Label htmlFor="prompt" className="text-base font-semibold mb-3 block">
                    Describe lo que quieres crear
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ej: Un paisaje futurista con montanas flotantes, cielo purpura, estilo cinematico..."
                    className="min-h-32 resize-none text-base border-border/50 focus:border-primary/50 transition-colors"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  {/* Prompt suggestions */}
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Sugerencias rapidas:</p>
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(suggestion)}
                          className="text-xs px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Model Selection */}
                <Card className="p-6 border-border/50">
                  <Label className="text-base font-semibold mb-4 block">Modelo de IA</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {models.map((model) => {
                      const isSelected = selectedModel === model.id;
                      const Icon = model.type === 'image' ? Image : Video;

                      return (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model.id)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                              : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="absolute top-2 right-2 size-5 text-primary" />
                          )}
                          <div className={`size-8 rounded-lg flex items-center justify-center mb-2 ${
                            model.type === 'image'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-pink-500/10 text-pink-600'
                          }`}>
                            <Icon className="size-4" />
                          </div>
                          <p className="font-semibold text-sm">{model.name}</p>
                          <p className="text-xs text-muted-foreground">{model.description}</p>
                          <p className="text-xs font-semibold text-primary mt-1">{model.cost.toFixed(2)} x402</p>
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Configuration */}
                <Card className="p-6 border-border/50">
                  <Label className="text-base font-semibold mb-4 block">Configuracion</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="resolution" className="text-sm text-muted-foreground mb-2 block">Resolucion</Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger id="resolution" className="border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resolutions.map((res) => (
                            <SelectItem key={res} value={res}>{res}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {currentModel?.type === 'video' && (
                      <div>
                        <Label htmlFor="duration" className="text-sm text-muted-foreground mb-2 block">Duracion</Label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger id="duration" className="border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map((dur) => (
                              <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="style" className="text-sm text-muted-foreground mb-2 block">Estilo</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style" className="border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Cost Card - Sticky */}
              <div className="lg:col-span-1">
                <Card className="p-6 border-border/50 sticky top-24">
                  <h3 className="font-semibold mb-4">Resumen</h3>

                  {/* Cost display */}
                  <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-5 mb-6 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">Costo total</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-primary">{estimatedCost.toFixed(2)}</span>
                      <span className="text-muted-foreground">x402</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Modelo</span>
                      <span className="font-medium">{currentModel?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium capitalize flex items-center gap-1.5">
                        {currentModel?.type === 'image' ? (
                          <Image className="size-3.5 text-blue-600" />
                        ) : (
                          <Video className="size-3.5 text-pink-600" />
                        )}
                        {currentModel?.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Resolucion</span>
                      <span className="font-medium">{resolution}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estilo</span>
                      <span className="font-medium">{style}</span>
                    </div>
                  </div>

                  {/* Generate button */}
                  <Button
                    className="w-full gap-2 py-6 text-base shadow-lg shadow-primary/25"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        Generar con x402
                      </>
                    )}
                  </Button>

                  {balance < estimatedCost && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <Zap className="size-4" />
                        Saldo insuficiente. Recarga tu wallet.
                      </p>
                    </div>
                  )}

                  {/* Security note */}
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Pago seguro via protocolo x402
                  </p>
                </Card>
              </div>
            </div>

            {/* Loading State */}
            {isGenerating && (
              <Card className="p-8 border-border/50 mt-6">
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="size-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center animate-pulse">
                      <Sparkles className="size-10 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Loader2 className="size-4 text-white animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Creando tu contenido</h3>
                  <p className="text-muted-foreground mb-4">La IA esta procesando tu solicitud...</p>
                  <div className="max-w-xs mx-auto h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
