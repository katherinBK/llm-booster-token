import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Code2, TrendingUp, ArrowRight, Cpu, Coins, Rocket, Key, Plug } from "lucide-react";
import heroVisual from "@/assets/hero-visual.png";
import kairoLogo from "@/assets/kairo-logo.png";

const features = [
  {
    icon: TrendingUp,
    title: "1.5x más requests",
    description: "Por el mismo precio que pagas a un proveedor estándar, obtienes significativamente más requests gracias al mecanismo de rToken.",
  },
  {
    icon: Shield,
    title: "100% transparente",
    description: "Todo el proceso ocurre en el backend. Nunca tocas un token ni necesitas wallet. Solo usas tu API key como siempre.",
  },
  {
    icon: Code2,
    title: "Integración en minutos",
    description: "Cambia la URL base de tu proveedor LLM actual por la nuestra. Compatible con OpenAI, Anthropic, Google y más.",
  },
  {
    icon: Zap,
    title: "Potenciado por Solana",
    description: "Contratos inteligentes generan rTokens por cada request, subsidiando costos sin que el usuario interactúe con la blockchain.",
  },
];

const steps = [
  { icon: Key, step: "01", title: "Crea tu cuenta", description: "Regístrate y genera tu API key en segundos." },
  { icon: Cpu, step: "02", title: "Conecta tu app", description: "Apunta tus requests LLM a nuestra API. Sin cambios en tu código." },
  { icon: Coins, step: "03", title: "rTokens se generan", description: "Por cada request, un contrato en Solana genera rTokens automáticamente." },
  { icon: Rocket, step: "04", title: "Ahorra y escala", description: "Los rTokens subsidian costos. Más requests, mismo presupuesto." },
];

const comparisons = [
  { label: "50K requests/mes", standard: "$100", rtoken: "$100", benefit: "75K requests" },
  { label: "100K requests/mes", standard: "$200", rtoken: "$200", benefit: "150K requests" },
  { label: "500K requests/mes", standard: "$1,000", rtoken: "$1,000", benefit: "750K requests" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={kairoLogo} alt="Kairo" className="w-8 h-8" />
            <span className="font-bold text-lg text-foreground tracking-tight">Kairo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="sm">Comenzar gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs font-medium text-primary">Potenciado por Solana</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.1] mb-4">
              Más requests de LLM,{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                mismo precio
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Nuestro backend genera <span className="font-mono text-foreground font-semibold">rTokens</span> mediante contratos en Solana por cada request que haces. El resultado: hasta <span className="text-success font-semibold">1.5x más requests</span> por el mismo costo.
            </p>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="gap-2">
                  Empezar ahora <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button variant="hero-outline" size="lg">¿Cómo funciona?</Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <img src={heroVisual} alt="Infraestructura Kairo" className="w-full rounded-2xl" />
            <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
              <p className="text-xs text-muted-foreground mb-1">Multiplicador de eficiencia</p>
              <p className="text-3xl font-extrabold text-foreground">1.5x</p>
              <p className="text-xs text-success font-medium">más requests que el estándar</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">¿Por qué Kairo?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Optimizamos el costo de cada request LLM usando la velocidad y eficiencia de Solana — sin que cambies tu flujo de trabajo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">¿Cómo funciona?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tú nunca interactúas con tokens ni wallets. Todo sucede en el backend.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{s.step}</span>
                <h3 className="text-sm font-semibold text-foreground mt-1 mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise BYOK */}
      <section className="bg-muted/40 border-y border-border py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card border border-border rounded-2xl p-8 lg:p-12"
          >
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center shrink-0">
                <Plug className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-4">
                  <span className="text-xs font-medium text-primary">Enterprise</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  ¿Ya tienes tu propia API key?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-xl">
                  Si tu empresa ya tiene credenciales con OpenAI, Anthropic, Google u otro proveedor de IA, puedes conectarlas directamente a Kairo. Nuestro sistema tokeniza tus requests existentes con rTokens en Solana, <span className="text-success font-semibold">subsidiando hasta un 50% de tus costos</span> sin cambiar de proveedor.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Conecta tu API key actual — sin migración
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    rTokens se generan sobre tu consumo existente
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Soporte dedicado y onboarding personalizado
                  </li>
                </ul>
                <Link to="/auth">
                  <Button variant="hero" size="lg" className="gap-2">
                    Hablar con ventas <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Comparación de valor</h2>
              <p className="text-muted-foreground">Mismo gasto, más capacidad.</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estándar</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-success uppercase tracking-wider">Con Kairo</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((c) => (
                    <tr key={c.label} className="border-b border-border/50 last:border-0">
                      <td className="py-4 px-6 font-medium text-foreground">{c.label}</td>
                      <td className="py-4 px-6 text-center font-mono text-foreground">{c.standard}</td>
                      <td className="py-4 px-6 text-center text-muted-foreground">{c.label.split("/")[0]}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-semibold text-success">{c.benefit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Empieza a ahorrar en tus requests LLM hoy
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Sin wallet, sin tokens, sin complejidad. Solo más requests por tu dinero.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg" className="gap-2">
                Crear cuenta gratis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={kairoLogo} alt="Kairo" className="w-6 h-6" />
            <span className="text-sm font-semibold text-foreground">Kairo</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Kairo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
