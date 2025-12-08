import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Wallet, CheckCircle2, XCircle, Moon, Sun } from 'lucide-react';
import type { View } from '../App';
import type { WalletState } from '../services/x402';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  isWalletConnected: boolean;
  onNavigate: (view: View) => void;
  onDisconnectWallet: () => void;
  walletAddress?: string | null;
  onWalletChange?: (state: WalletState) => void;
}

export function Settings({ isWalletConnected, onNavigate, onDisconnectWallet, walletAddress, onWalletChange }: SettingsProps) {
  const [dailyLimit, setDailyLimit] = useState('10');
  const [monthlyLimit, setMonthlyLimit] = useState('100');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const { theme, setTheme } = useTheme();

  const favoriteModels = ['SD3.5', 'Midjourney', 'Veo 3'];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentView="settings" onNavigate={onNavigate} onDisconnect={onDisconnectWallet} />
      
      <div className="flex-1">
        <Header walletAddress={walletAddress} onNavigate={onNavigate} onWalletChange={onWalletChange} onDisconnect={onDisconnectWallet} />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-8 text-foreground">Configuración</h1>
            
            <div className="space-y-6">
              {/* Wallet Connection */}
              <Card className="p-6 border-border">
                <h3 className="mb-4 text-foreground">Wallet x402</h3>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                      <Wallet className="size-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isWalletConnected ? (
                          <>
                            <CheckCircle2 className="size-4 text-green-600" />
                            <span className="text-foreground">Conectada</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-4 text-red-600" />
                            <span className="text-foreground">Desconectada</span>
                          </>
                        )}
                      </div>
                      {isWalletConnected && walletAddress && (
                        <div className="text-sm text-muted-foreground font-mono">
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isWalletConnected ? (
                    <Button variant="outline" onClick={onDisconnectWallet}>
                      Desconectar
                    </Button>
                  ) : (
                    <Button>Conectar Wallet</Button>
                  )}
                </div>
              </Card>

              {/* Spending Limits */}
              <Card className="p-6 border-border">
                <h3 className="mb-4 text-foreground">Límites de gasto</h3>
                <p className="text-muted-foreground mb-6">
                  Establece límites para controlar tu gasto en generaciones de IA
                </p>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="daily-limit" className="mb-2 block">Límite diario (x402)</Label>
                      <Input
                        id="daily-limit"
                        type="number"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="monthly-limit" className="mb-2 block">Límite mensual (x402)</Label>
                      <Input
                        id="monthly-limit"
                        type="number"
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="mb-1 text-foreground">Alertas de límite</div>
                      <div className="text-sm text-muted-foreground">
                        Recibe notificaciones al alcanzar el 80% del límite
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                </div>
              </Card>

              {/* Favorite Models */}
              <Card className="p-6 border-border">
                <h3 className="mb-4 text-foreground">Modelos favoritos</h3>
                <p className="text-muted-foreground mb-6">
                  Selecciona tus modelos preferidos para acceso rápido
                </p>
                
                <div className="space-y-3">
                  {favoriteModels.map((model) => (
                    <div key={model} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="text-foreground">{model}</span>
                      <Button variant="ghost" size="sm">Eliminar</Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">+ Agregar modelo</Button>
                </div>
              </Card>

              {/* Interface Preferences */}
              <Card className="p-6 border-border">
                <h3 className="mb-4 text-foreground">Preferencias de interfaz</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="mb-1 text-foreground">Guardar automáticamente</div>
                      <div className="text-sm text-muted-foreground">
                        Guardar todas las generaciones en el historial
                      </div>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? (
                        <Moon className="size-5 text-primary" />
                      ) : (
                        <Sun className="size-5 text-primary" />
                      )}
                      <div>
                        <div className="mb-1 text-foreground">Modo oscuro</div>
                        <div className="text-sm text-muted-foreground">
                          Cambia entre tema claro y oscuro
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="language" className="mb-2 block">Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancelar</Button>
                <Button>Guardar cambios</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
