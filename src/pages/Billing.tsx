import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Zap, Building2, ArrowRight, Loader2, Link as LinkIcon } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";
import solanaLogo from "@/assets/solana-logo.png";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mes",
    description: "Ideal para desarrolladores individuales y proyectos pequeños.",
    icon: Zap,
    features: [
      "50,000 requests/mes",
      "3 API keys",
      "Soporte por email",
      "Acceso a 3 proveedores LLM",
      "Dashboard de uso básico",
    ],
    popular: false,
    amount: 29
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mes",
    description: "Para equipos y aplicaciones en producción.",
    icon: CreditCard,
    features: [
      "500,000 requests/mes",
      "10 API keys",
      "Soporte prioritario",
      "Todos los proveedores LLM",
      "Analytics avanzados",
      "Logs en tiempo real",
      "Webhooks personalizados",
    ],
    popular: true,
    amount: 79
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Trae tu propia API key (BYOK). Tokenizamos tus credenciales existentes.",
    icon: Building2,
    features: [
      "Requests ilimitados",
      "API keys ilimitadas",
      "Account manager dedicado",
      "BYOK — Trae tu propia key",
      "SLA garantizado 99.9%",
      "On-boarding personalizado",
      "Facturación a medida",
    ],
    popular: false,
    amount: 0
  },
];

const Billing = () => {
  const [currentPlan] = useState("pay-as-you-go");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSelectPlan = async (amount: number, planName: string) => {
    if (amount === 0) return;
    setIsGenerating(true);
    setPaymentData(null);
    try {
      const res = await fetch("http://localhost:3001/api/payment/generate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, memo: `Pago Plan ${planName}` })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPaymentData(data);
      toast.success("Enlace de pago Solana Pay testnet generado");
    } catch (e: any) {
      toast.error("Error generando pago: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async () => {
    if (!paymentData) return;
    setIsVerifying(true);
    try {
      const res = await fetch("http://localhost:3001/api/payment/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: paymentData.reference })
      });
      const data = await res.json();
      if (data.confirmed) {
        toast.success("Pago verificado exitosamente!");
        setPaymentData(null);
      } else {
        toast.error(data.message || "Aún no detectamos la transacción");
      }
    } catch (e: any) {
      toast.error("Error verificando pago: " + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Billing</h1>
            <p className="text-xs text-muted-foreground">Gestiona tu plan y facturación vía Solana</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-1">U</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl space-y-8">
          {/* Current Plan */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plan actual</p>
                <p className="text-lg font-bold text-foreground capitalize">{currentPlan.replace(/-/g, " ")}</p>
              </div>
              <Badge variant="secondary" className="text-xs">Activo</Badge>
            </div>
          </motion.div>

          {/* Payment Solana Pay Modal (Inline) */}
          <AnimatePresence>
            {paymentData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-8 mt-2 flex flex-col md:flex-row gap-6 relative">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <img src={solanaLogo} alt="Solana" className="w-5 h-5 object-contain" />
                       <h3 className="text-lg font-semibold text-white">Pago con Solana Pay</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Transfiere {paymentData.amount} USDC (Testnet/Devnet) usando el enlace Solana Pay, o envía manualmente a la Merchant Address e incluye la referencia. (Wallet-less checkout)
                    </p>
                    <div className="space-y-3">
                      <div className="bg-[#0a0a0a] p-3 rounded-md border border-[#333]">
                        <p className="text-xs text-gray-500 mb-1">Enlace Solana Pay</p>
                        <a href={paymentData.url} className="text-sm font-mono text-[#9945FF] hover:underline break-all">{paymentData.url}</a>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded-md border border-[#333]">
                        <p className="text-xs text-gray-500 mb-1">Merchant Address</p>
                        <p className="text-sm font-mono text-gray-300 break-all">{paymentData.recipient}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 rounded-md border border-[#333]">
                        <p className="text-xs text-gray-500 mb-1">Reference ID (Requerido para confirmación)</p>
                        <p className="text-sm font-mono text-gray-300 break-all">{paymentData.reference}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Button onClick={handleVerify} disabled={isVerifying} className="bg-[#9945FF] hover:bg-[#8A2BE2] text-white">
                        {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Verificar Transacción On-Chain
                      </Button>
                      <Button variant="outline" onClick={() => setPaymentData(null)} disabled={isVerifying}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plans Grid */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Elige tu plan</h2>
            <p className="text-sm text-muted-foreground mb-6">Todos los planes incluyen subsidio vía rTokens en Solana</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-card border rounded-xl p-6 flex flex-col ${plan.popular ? "border-primary ring-1 ring-primary/20" : "border-border"}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">Más popular</Badge>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.popular ? "gradient-primary" : "bg-muted"}`}>
                      <plan.icon className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "default" : "outline"} 
                    className="w-full relative overflow-hidden group"
                    onClick={() => handleSelectPlan(plan.amount, plan.name)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                       plan.name === "Enterprise" ? (
                      <>Contactar ventas <ArrowRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      <>Pagar con Solana <img src={solanaLogo} alt="SOL" className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" /></>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Historial de pagos</h3>
            <div className="py-8 text-center">
              <CreditCard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">No hay pagos registrados</p>
              <p className="text-xs text-muted-foreground mt-1">Tu historial de facturación aparecerá aquí una vez pagues con Solana Pay</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
