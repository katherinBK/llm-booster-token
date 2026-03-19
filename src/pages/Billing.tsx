import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Zap, Building2, ArrowRight } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";

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
  },
];

const Billing = () => {
  const [currentPlan] = useState("pay-as-you-go");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Billing</h1>
            <p className="text-xs text-muted-foreground">Gestiona tu plan y facturación</p>
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

                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.name === "Enterprise" ? (
                      <>Contactar ventas <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      "Seleccionar plan"
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
              <p className="text-xs text-muted-foreground mt-1">Tu historial de facturación aparecerá aquí</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
