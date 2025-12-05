import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Generate } from './components/Generate';
import { Result } from './components/Result';
import { History } from './components/History';
import { Settings } from './components/Settings';

export type View = 'landing' | 'dashboard' | 'generate' | 'result' | 'history' | 'settings';

export interface GeneratedContent {
  id: string;
  prompt: string;
  type: 'image' | 'video';
  model: string;
  date: string;
  cost: number;
  url: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [balance, setBalance] = useState(150.42);
  const [currentResult, setCurrentResult] = useState<GeneratedContent | null>(null);

  // Escuchar el boton de atras/adelante del navegador
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setCurrentView(event.state.view);
        if (event.state.view === 'landing') {
          setIsWalletConnected(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Establecer el estado inicial
    window.history.replaceState({ view: 'landing' }, '', '/');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [history, setHistory] = useState<GeneratedContent[]>([
    {
      id: '1',
      prompt: 'A futuristic city at sunset with flying cars',
      type: 'image',
      model: 'SD3.5',
      date: '2025-11-28',
      cost: 0.15,
      url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800'
    },
    {
      id: '2',
      prompt: 'Ocean waves in slow motion',
      type: 'video',
      model: 'Veo 3',
      date: '2025-11-27',
      cost: 0.85,
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800'
    },
    {
      id: '3',
      prompt: 'Abstract geometric patterns in blue',
      type: 'image',
      model: 'Midjourney',
      date: '2025-11-26',
      cost: 0.20,
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800'
    },
  ]);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setCurrentView('dashboard');
    window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setCurrentView('landing');
    window.history.pushState({ view: 'landing' }, '', '/');
  };

  const navigateTo = (view: View) => {
    if (view !== currentView) {
      setCurrentView(view);
      window.history.pushState({ view }, '', `/${view === 'landing' ? '' : view}`);
    }
  };

  const handleGenerate = (content: Omit<GeneratedContent, 'id' | 'date'>) => {
    const newContent: GeneratedContent = {
      ...content,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setHistory([newContent, ...history]);
    setBalance(balance - content.cost);
    setCurrentResult(newContent);
    navigateTo('result');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' && (
        <Landing onConnectWallet={handleConnectWallet} />
      )}
      {currentView === 'dashboard' && (
        <Dashboard
          balance={balance}
          onNavigate={navigateTo}
          history={history.slice(0, 5)}
          onDisconnect={handleDisconnectWallet}
        />
      )}
      {currentView === 'generate' && (
        <Generate
          balance={balance}
          onNavigate={navigateTo}
          onGenerate={handleGenerate}
          onDisconnect={handleDisconnectWallet}
        />
      )}
      {currentView === 'result' && currentResult && (
        <Result
          content={currentResult}
          onNavigate={navigateTo}
          onRegenerate={() => navigateTo('generate')}
          balance={balance}
          onDisconnect={handleDisconnectWallet}
        />
      )}
      {currentView === 'history' && (
        <History
          history={history}
          onNavigate={navigateTo}
          balance={balance}
          onDisconnect={handleDisconnectWallet}
        />
      )}
      {currentView === 'settings' && (
        <Settings
          isWalletConnected={isWalletConnected}
          onNavigate={navigateTo}
          onDisconnectWallet={handleDisconnectWallet}
        />
      )}
    </div>
  );
}

export default App;
