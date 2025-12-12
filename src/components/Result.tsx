import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Download, RefreshCw, Share2, Heart, Sparkles, ArrowLeft, Copy, Check, Image, Video, Clock, Palette, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { config } from '../config';
import type { View, GeneratedContent } from '../App';
import type { WalletState } from '../services/x402';

interface ResultProps {
  content: GeneratedContent;
  onNavigate: (view: View) => void;
  onRegenerate: (prompt: string, type: 'image' | 'video', model: string) => void;
  onToggleFavorite: (id: string) => Promise<void>;
  onDisconnect: () => void;
  walletAddress?: string | null;
  onWalletChange?: (state: WalletState) => void;
}

const suggestedPrompts = [
  { text: 'Anadir mas detalles al fondo', icon: Palette, modifier: 'with more detailed background elements' },
  { text: 'Cambiar iluminacion a atardecer', icon: Sparkles, modifier: 'with sunset lighting and warm golden hour colors' },
  { text: 'Version en estilo anime', icon: Image, modifier: 'in anime style, japanese animation aesthetic' },
  { text: 'Aumentar saturacion de colores', icon: Palette, modifier: 'with vibrant saturated colors and high contrast' },
];

export function Result({ content, onNavigate, onRegenerate, onToggleFavorite, onDisconnect, walletAddress, onWalletChange }: ResultProps) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(content.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Funcion para descargar la imagen
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(content.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ultrapayx402-${content.id}.${content.type === 'video' ? 'mp4' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading:', error);
      // Fallback: abrir en nueva ventana
      window.open(content.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Funcion para regenerar (con pago x402)
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(content.prompt, content.type, content.model);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Funcion para compartir en Twitter con preview de imagen
  const handleShare = () => {
    const shareUrl = `${config.apiUrl}/share/${content.id}`;
    const tweetText = encodeURIComponent(`Acabo de crear esta imagen con UltraPayx402 usando micropagos x402!\n\n`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  // Funcion para guardar como favorito
  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(content.id);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView="result" onNavigate={onNavigate} onDisconnect={onDisconnect} />

      <div className="flex-1">
        <Header walletAddress={walletAddress} onNavigate={onNavigate} onWalletChange={onWalletChange} onDisconnect={onDisconnect} />

        <main className="p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="size-4" />
              Volver al Dashboard
            </Button>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main image/video */}
                <Card className="overflow-hidden border-border/50">
                  <div className="aspect-video bg-secondary relative group">
                    <img
                      src={content.url}
                      alt={content.prompt}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button
                        size="lg"
                        className="gap-2"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="size-5 animate-spin" />
                        ) : (
                          <Download className="size-5" />
                        )}
                        {isDownloading ? 'Descargando...' : 'Descargar HD'}
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="gap-2 shadow-lg shadow-primary/25"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Download className="size-4" />
                        )}
                        {isDownloading ? 'Descargando...' : 'Descargar'}
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                      >
                        {isRegenerating ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <RefreshCw className="size-4" />
                        )}
                        {isRegenerating ? 'Regenerando...' : 'Regenerar'}
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={handleShare}>
                        <Share2 className="size-4" />
                        Compartir
                      </Button>
                      <Button
                        variant="outline"
                        className={`gap-2 ${content.isFavorite ? 'text-pink-500 border-pink-500/50 bg-pink-500/10' : ''}`}
                        onClick={handleToggleFavorite}
                        disabled={isTogglingFavorite}
                      >
                        {isTogglingFavorite ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Heart className={`size-4 ${content.isFavorite ? 'fill-current' : ''}`} />
                        )}
                        {content.isFavorite ? 'Guardado' : 'Guardar'}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Suggested Re-prompts */}
                <Card className="p-6 border-border/50">
                  <h3 className="font-semibold mb-2 text-foreground">Mejora tu resultado</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Prueba estas variaciones basadas en tu prompt original
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {suggestedPrompts.map((suggestion, index) => {
                      const Icon = suggestion.icon;
                      // Combinar el prompt original con el modificador de la sugerencia
                      const enhancedPrompt = `${content.prompt}, ${suggestion.modifier}`;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="gap-3 justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                          onClick={() => onRegenerate(enhancedPrompt, content.type, content.model)}
                          disabled={isRegenerating}
                        >
                          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="size-4 text-primary" />
                          </div>
                          <span className="text-left text-sm">{suggestion.text}</span>
                        </Button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Details Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Prompt used */}
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Prompt utilizado</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyPrompt}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="size-4 text-green-500" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/50 p-3 rounded-lg">
                    {content.prompt}
                  </p>
                </Card>

                {/* Info */}
                <Card className="p-6 border-border/50">
                  <h3 className="font-semibold mb-4 text-foreground">Informacion</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        {content.type === 'image' ? (
                          <Image className="size-4" />
                        ) : (
                          <Video className="size-4" />
                        )}
                        Tipo
                      </span>
                      <span className="text-sm font-medium capitalize flex items-center gap-1.5">
                        {content.type === 'image' ? (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-xs">Imagen</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 rounded-full text-xs">Video</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Sparkles className="size-4" />
                        Modelo
                      </span>
                      <span className="text-sm font-medium text-foreground">{content.model}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="size-4" />
                        Fecha
                      </span>
                      <span className="text-sm font-medium text-foreground">{content.date}</span>
                    </div>

                    <div className="border-t border-border/50 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">ID</span>
                        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">#{content.id}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Cost */}
                <Card className="p-6 border-border/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                  <div className="text-sm text-muted-foreground mb-1">Costo de generacion</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{content.cost.toFixed(2)}</span>
                    <span className="text-muted-foreground">x402</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pagado via protocolo x402
                  </p>
                </Card>

                {/* Tip */}
                <Card className="p-6 border-border/50 border-dashed bg-secondary/20">
                  <div className="flex gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="size-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1 text-foreground">Consejo Pro</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Los prompts detallados con estilo, iluminacion y composicion generan mejores resultados.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
