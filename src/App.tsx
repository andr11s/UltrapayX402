import { useState, useEffect, useCallback } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Generate } from './components/Generate';
import { Result } from './components/Result';
import { History } from './components/History';
import { Settings } from './components/Settings';
import {
  connectWallet,
  disconnectWallet,
  getWalletState,
  hasWalletProvider,
  onWalletChange,
  type WalletState
} from './services/x402';
import { api } from './services/api';

export type View = 'landing' | 'dashboard' | 'generate' | 'result' | 'history' | 'settings';

export interface GeneratedContent {
  id: string;
  prompt: string;
  type: 'image' | 'video';
  model: string;
  date: string;
  cost: number;
  url: string;
  isFavorite?: boolean;
}

// Obtener la vista inicial desde la URL
function getInitialView(): View {
  const path = window.location.pathname.replace('/', '');
  const validViews: View[] = ['landing', 'dashboard', 'generate', 'result', 'history', 'settings'];
  if (path && validViews.includes(path as View)) {
    return path as View;
  }
  return 'landing';
}

function App() {
  const [currentView, setCurrentView] = useState<View>(getInitialView);
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
  });
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GeneratedContent | null>(null);

  // Verificar si ya hay una wallet conectada al cargar la página
  useEffect(() => {
    async function checkExistingConnection() {
      if (hasWalletProvider()) {
        const state = await getWalletState();
        if (state.isConnected && state.address) {
          // Solo restaurar el estado de la wallet, sin cambiar de vista
          setWalletState(state);
        }
      }
    }
    checkExistingConnection();
  }, []); // Solo al montar

  // Escuchar cambios en la wallet
  useEffect(() => {
    const cleanup = onWalletChange((newState) => {
      setWalletState(newState);
      // Si se desconecta desde la wallet, volver al landing
      if (!newState.isConnected && currentView !== 'landing') {
        setCurrentView('landing');
        window.history.pushState({ view: 'landing' }, '', '/');
      }
    });

    return cleanup;
  }, [currentView]);

  // Escuchar el boton de atras/adelante del navegador
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setCurrentView(event.state.view);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Guardar el estado actual en el historial (sin cambiar la URL)
    const initialView = getInitialView();
    window.history.replaceState({ view: initialView }, '', initialView === 'landing' ? '/' : `/${initialView}`);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Historia de generaciones (se carga desde el backend por wallet)
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Funcion para cargar historial desde el backend
  const loadHistoryFromBackend = useCallback(async (walletAddress: string) => {
    if (!walletAddress) return;

    setIsLoadingHistory(true);
    try {
      const response = await api.getHistory(walletAddress);
      if (response.success && response.transactions) {
        // Convertir transacciones del backend al formato GeneratedContent
        const historyItems: GeneratedContent[] = response.transactions.map(tx => ({
          id: tx.transactionId,
          prompt: tx.prompt,
          type: tx.type,
          model: tx.providerName || tx.provider,
          date: tx.createdAt.split('T')[0],
          cost: tx.price,
          url: tx.mediaUrl,
          isFavorite: tx.isFavorite || false
        }));
        setHistory(historyItems);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      // No mostrar error al usuario, simplemente mantener historial vacio
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Cargar historial cuando cambia la wallet
  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      loadHistoryFromBackend(walletState.address);
    } else {
      // Limpiar historial cuando se desconecta
      setHistory([]);
    }
  }, [walletState.address, walletState.isConnected, loadHistoryFromBackend]);

  // Conectar wallet real
  const handleConnectWallet = async () => {
    if (!hasWalletProvider()) {
      setWalletError('No se encontro wallet. Instala MetaMask o Core Wallet.');
      return;
    }

    setIsConnectingWallet(true);
    setWalletError(null);

    try {
      const state = await connectWallet();
      setWalletState(state);
      setCurrentView('dashboard');
      window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletError(error instanceof Error ? error.message : 'Error al conectar wallet');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleDisconnectWallet = async () => {
    await disconnectWallet();
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
    });
    setCurrentView('landing');
    window.history.pushState({ view: 'landing' }, '', '/');
  };

  const navigateTo = (view: View) => {
    if (view !== currentView) {
      setCurrentView(view);
      window.history.pushState({ view }, '', `/${view === 'landing' ? '' : view}`);
    }
  };

  const handleGenerate = (content: Omit<GeneratedContent, 'date'>) => {
    const newContent: GeneratedContent = {
      ...content,
      date: new Date().toISOString().split('T')[0],
    };
    setHistory([newContent, ...history]);
    setCurrentResult(newContent);
    navigateTo('result');
  };

  // Estado para regeneracion
  const [regenerateData, setRegenerateData] = useState<{
    prompt: string;
    type: 'image' | 'video';
    model: string;
  } | null>(null);

  // Funcion para regenerar una imagen (redirige a Generate con datos precargados)
  const handleRegenerate = async (prompt: string, type: 'image' | 'video', model: string) => {
    setRegenerateData({ prompt, type, model });
    navigateTo('generate');
  };

  // Funcion para marcar/desmarcar favorito
  const handleToggleFavorite = async (id: string) => {
    if (!walletState.address) return;

    try {
      // Llamar al backend para actualizar favorito
      const result = await api.toggleFavorite(id, walletState.address);

      // Actualizar el estado local
      setHistory(prev => prev.map(item =>
        item.id === id ? { ...item, isFavorite: result.isFavorite } : item
      ));

      // Actualizar currentResult si es el mismo item
      if (currentResult && currentResult.id === id) {
        setCurrentResult({ ...currentResult, isFavorite: result.isFavorite });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' && (
        <Landing
          onConnectWallet={handleConnectWallet}
          onGoToDashboard={() => navigateTo('dashboard')}
          onDisconnect={handleDisconnectWallet}
          isConnecting={isConnectingWallet}
          isConnected={walletState.isConnected}
          walletAddress={walletState.address}
          error={walletError}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard
          onNavigate={navigateTo}
          history={history.slice(0, 5)}
          onDisconnect={handleDisconnectWallet}
          walletAddress={walletState.address}
          onWalletChange={setWalletState}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      {currentView === 'generate' && (
        <Generate
          onNavigate={navigateTo}
          onGenerate={handleGenerate}
          onDisconnect={handleDisconnectWallet}
          onWalletChange={setWalletState}
          regenerateData={regenerateData}
          onClearRegenerateData={() => setRegenerateData(null)}
        />
      )}
      {currentView === 'result' && currentResult && (
        <Result
          content={currentResult}
          onNavigate={navigateTo}
          onRegenerate={handleRegenerate}
          onToggleFavorite={handleToggleFavorite}
          onDisconnect={handleDisconnectWallet}
          walletAddress={walletState.address}
          onWalletChange={setWalletState}
        />
      )}
      {currentView === 'history' && (
        <History
          history={history}
          onNavigate={navigateTo}
          onDisconnect={handleDisconnectWallet}
          walletAddress={walletState.address}
          onWalletChange={setWalletState}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
      {currentView === 'settings' && (
        <Settings
          isWalletConnected={walletState.isConnected}
          onNavigate={navigateTo}
          onDisconnectWallet={handleDisconnectWallet}
          walletAddress={walletState.address}
          onWalletChange={setWalletState}
        />
      )}
    </div>
  );
}

export default App;
