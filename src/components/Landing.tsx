import { Sparkles, Zap, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LandingProps {
  onConnectWallet: () => void;
}

export function Landing({ onConnectWallet }: LandingProps) {
  const benefits = [
    {
      icon: CreditCard,
      title: 'Sin suscripciones',
      description: 'Paga solo por lo que generas, sin cuotas mensuales ni compromisos.'
    },
    {
      icon: Zap,
      title: 'Pago por prompt',
      description: 'Micropagos instantáneos usando el protocolo x402 por cada generación.'
    },
    {
      icon: Sparkles,
      title: 'Modelos visuales profesionales',
      description: 'Accede a los mejores modelos de IA: SD3.5, Veo 3, Runway Gen-3 y más.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Conectar Wallet x402',
      description: 'Vincula tu wallet para realizar micropagos'
    },
    {
      number: '02',
      title: 'Escribir Prompt',
      description: 'Describe lo que quieres crear'
    },
    {
      number: '03',
      title: 'Pagar y Recibir',
      description: 'Micropago automático y contenido generado al instante'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <Sparkles className="size-4" />
            <span className="text-sm text-neutral-600">Powered by x402 Protocol</span>
          </div>
          
          <h1 className="mb-6">
            Genera imágenes y videos IA pagando solo por lo que usas
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Crea contenido visual profesional con inteligencia artificial. Sin suscripciones, solo micropagos por cada generación.
          </p>
          
          <Button size="lg" onClick={onConnectWallet} className="gap-2">
            Conectar Wallet x402
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-neutral-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="p-8 bg-white border-neutral-200">
                    <div className="size-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="size-6 text-white" />
                    </div>
                    <h3 className="mb-2">{benefit.title}</h3>
                    <p className="text-neutral-600">{benefit.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12">Cómo funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl text-neutral-200 mb-4">{step.number}</div>
                <h3 className="mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5" />
              <span>UltraPayx402</span>
            </div>
            <div className="text-sm text-neutral-600">
              © 2025 UltraPayx402. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
