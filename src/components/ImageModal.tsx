import { useState } from 'react';
import { Button } from './ui/button';
import { X, Download, Share2, Heart, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { config } from '../config';
import type { GeneratedContent } from '../App';

interface ImageModalProps {
  content: GeneratedContent;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => Promise<void>;
}

export function ImageModal({ content, isOpen, onClose, onToggleFavorite }: ImageModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

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
      window.open(content.url, '_blank');
    } finally {
      setIsDownloading(false);
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

  // Cerrar con ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  // Cerrar al hacer click en el fondo
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
        onClick={onClose}
      >
        <X className="size-6" />
      </Button>

      {/* Content */}
      <div className="flex flex-col items-center max-w-[90vw] max-h-[90vh]">
        {/* Image */}
        <div className="relative overflow-auto max-h-[70vh] rounded-lg">
          <img
            src={content.url}
            alt={content.prompt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        {/* Info */}
        <div className="mt-4 text-center max-w-2xl">
          <p className="text-white/80 text-sm line-clamp-2 mb-2">{content.prompt}</p>
          <div className="flex items-center justify-center gap-3 text-white/60 text-xs">
            <span>{content.model}</span>
            <span>•</span>
            <span>{content.date}</span>
            <span>•</span>
            <span className="text-primary font-semibold">{content.cost.toFixed(2)} USDC</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 mr-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-white/60 text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              disabled={zoom >= 3}
            >
              <ZoomIn className="size-4" />
            </Button>
          </div>

          {/* Download */}
          <Button
            className="gap-2"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Descargar
          </Button>

          {/* Share */}
          <Button
            variant="outline"
            className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="size-4" />
            Compartir
          </Button>

          {/* Favorite */}
          <Button
            variant="outline"
            className={`gap-2 ${
              content.isFavorite
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 hover:bg-pink-500/30'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
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
    </div>
  );
}
