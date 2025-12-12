import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Image, Video, Eye, TrendingUp, Layers, Clock, X, Search, Heart, Loader2 } from 'lucide-react';
import { ImageModal } from './ImageModal';
import type { View, GeneratedContent } from '../App';
import type { WalletState } from '../services/x402';

interface HistoryProps {
  history: GeneratedContent[];
  onNavigate: (view: View) => void;
  onDisconnect: () => void;
  walletAddress?: string | null;
  onWalletChange?: (state: WalletState) => void;
  onToggleFavorite: (id: string) => Promise<void>;
}

type TabType = 'all' | 'favorites';

export function History({ history, onNavigate, onDisconnect, walletAddress, onWalletChange, onToggleFavorite }: HistoryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [togglingFavorite, setTogglingFavorite] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedContent | null>(null);

  // Primero filtrar por tab (all o favorites)
  const tabFilteredHistory = activeTab === 'favorites'
    ? history.filter(item => item.isFavorite)
    : history;

  // Luego aplicar los otros filtros
  const filteredHistory = tabFilteredHistory.filter((item) => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const modelMatch = filterModel === 'all' || item.model === filterModel;
    return typeMatch && modelMatch;
  });

  const uniqueModels = Array.from(new Set(history.map(item => item.model)));
  const totalSpent = history.reduce((sum, item) => sum + item.cost, 0);
  const avgCost = history.length > 0 ? totalSpent / history.length : 0;
  const favoritesCount = history.filter(item => item.isFavorite).length;

  const clearFilters = () => {
    setFilterType('all');
    setFilterModel('all');
  };

  const hasFilters = filterType !== 'all' || filterModel !== 'all';

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evitar que se active el click en la card
    setTogglingFavorite(id);
    try {
      await onToggleFavorite(id);
    } finally {
      setTogglingFavorite(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView="history" onNavigate={onNavigate} onDisconnect={onDisconnect} />

      <div className="flex-1">
        <Header walletAddress={walletAddress} onNavigate={onNavigate} onWalletChange={onWalletChange} onDisconnect={onDisconnect} />

        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="size-5 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Historial</h1>
              </div>
              <p className="text-muted-foreground">Todas tus generaciones en un solo lugar</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className="gap-2"
              >
                <Layers className="size-4" />
                Todas ({history.length})
              </Button>
              <Button
                variant={activeTab === 'favorites' ? 'default' : 'outline'}
                onClick={() => setActiveTab('favorites')}
                className={`gap-2 ${activeTab === 'favorites' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              >
                <Heart className={`size-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
                Favoritos ({favoritesCount})
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-5 border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Layers className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground">{history.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gasto total</p>
                    <p className="text-2xl font-bold text-primary">{totalSpent.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">x402</span></p>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Promedio</p>
                    <p className="text-2xl font-bold text-foreground">{avgCost.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">x402</span></p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4 border-border/50 mb-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-48">
                  <Label htmlFor="filter-type" className="text-sm text-muted-foreground mb-2 block">Tipo</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="filter-type" className="border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="image">Imagenes</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-48">
                  <Label htmlFor="filter-model" className="text-sm text-muted-foreground mb-2 block">Modelo</Label>
                  <Select value={filterModel} onValueChange={setFilterModel}>
                    <SelectTrigger id="filter-model" className="border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los modelos</SelectItem>
                      {uniqueModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasFilters && (
                  <Button variant="ghost" onClick={clearFilters} className="gap-2">
                    <X className="size-4" />
                    Limpiar
                  </Button>
                )}

                <div className="ml-auto text-sm text-muted-foreground">
                  {filteredHistory.length} de {history.length} resultados
                </div>
              </div>
            </Card>

            {/* Content */}
            {filteredHistory.length === 0 ? (
              <Card className="p-12 border-border/50 border-dashed">
                <div className="text-center">
                  <div className={`size-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    activeTab === 'favorites'
                      ? 'bg-gradient-to-br from-pink-500/10 to-rose-500/10'
                      : 'bg-gradient-to-br from-violet-500/10 to-purple-500/10'
                  }`}>
                    {activeTab === 'favorites' ? (
                      <Heart className="size-8 text-pink-500/50" />
                    ) : (
                      <Search className="size-8 text-primary/50" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">
                    {activeTab === 'favorites'
                      ? 'No tienes favoritos'
                      : 'No se encontraron resultados'}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {activeTab === 'favorites'
                      ? 'Marca tus generaciones favoritas haciendo click en el corazon para encontrarlas facilmente.'
                      : hasFilters
                        ? 'Intenta ajustar los filtros para ver mas resultados.'
                        : 'Aun no tienes generaciones. Comienza a crear contenido!'}
                  </p>
                  {activeTab === 'favorites' ? (
                    <Button variant="outline" onClick={() => setActiveTab('all')}>
                      Ver todas las generaciones
                    </Button>
                  ) : hasFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button onClick={() => onNavigate('generate')}>
                      Crear mi primera imagen
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHistory.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    {/* Image */}
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <Button size="sm" variant="secondary" className="gap-1.5">
                            <Eye className="size-3.5" />
                            Ver
                          </Button>
                        </div>
                      </div>
                      {/* Favorite button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, item.id)}
                        disabled={togglingFavorite === item.id}
                        className={`absolute top-3 right-3 size-8 rounded-full flex items-center justify-center transition-all ${
                          item.isFavorite
                            ? 'bg-pink-500 text-white'
                            : 'bg-black/50 text-white hover:bg-pink-500'
                        }`}
                      >
                        {togglingFavorite === item.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Heart className={`size-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                        )}
                      </button>
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        {item.type === 'image' ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            <Image className="size-3" />
                            Imagen
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-white bg-pink-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            <Video className="size-3" />
                            Video
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="font-medium text-sm line-clamp-2 mb-2 text-foreground">{item.prompt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{item.model}</span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{item.cost.toFixed(2)} x402</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          content={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onToggleFavorite={async (id) => {
            await onToggleFavorite(id);
            // Actualizar el estado local del modal
            const updated = history.find(h => h.id === id);
            if (updated) {
              setSelectedImage({ ...updated, isFavorite: !updated.isFavorite });
            }
          }}
        />
      )}
    </div>
  );
}
