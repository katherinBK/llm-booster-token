import { motion } from "framer-motion";
import { Key, Cpu, Coins, Rocket } from "lucide-react";

const steps = [
  {
    icon: Key,
    title: "Obtén tu API Key",
    description: "Regístrate y genera tu clave de API para conectarte a nuestro servicio.",
  },
  {
    icon: Cpu,
    title: "Haz requests al LLM",
    description: "Usa tu API key como lo harías con cualquier proveedor estándar de LLM.",
  },
  {
    icon: Coins,
    title: "Se generan rTokens",
    description: "Por cada request, un contrato en Solana genera rTokens automáticamente en el backend.",
  },
  {
    icon: Rocket,
    title: "Más requests, mismo precio",
    description: "Los rTokens subsidian el costo, dándote hasta 1.5x más requests por el mismo precio.",
  },
];

const HowItWorks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="text-sm font-semibold text-foreground mb-5">¿Cómo funciona?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={step.title} className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{step.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HowItWorks;
