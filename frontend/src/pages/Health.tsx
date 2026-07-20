import { motion } from "framer-motion";
import { Activity, CheckCircle2, AlertTriangle, Clock, Wifi } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bell, Search } from "lucide-react";

const providers = [
  { name: "OpenAI", status: "operational", uptime: 99.98, latency: "120ms", lastIncident: "Ninguno" },
  { name: "Gemini", status: "operational", uptime: 99.95, latency: "95ms", lastIncident: "Ninguno" },
  { name: "Anthropic", status: "degraded", uptime: 99.2, latency: "340ms", lastIncident: "Rate limiting elevado" },
  { name: "OpenRouter", status: "operational", uptime: 99.99, latency: "110ms", lastIncident: "Ninguno" },
  { name: "DeepSeek", status: "operational", uptime: 99.9, latency: "150ms", lastIncident: "Ninguno" },
];

const systemMetrics = [
  { label: "API Gateway", value: 99.99, status: "operational" },
  { label: "rToken Engine (Solana)", value: 99.95, status: "operational" },
  { label: "Cache Layer", value: 100, status: "operational" },
  { label: "Rate Limiter", value: 99.8, status: "operational" },
];

const statusConfig = {
  operational: { color: "text-accent", bg: "bg-accent/10", icon: CheckCircle2, label: "Operativo" },
  degraded: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: AlertTriangle, label: "Degradado" },
  down: { color: "text-destructive", bg: "bg-destructive/10", icon: Activity, label: "Caído" },
} as const;

const Health = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">System Health</h1>
            <p className="text-xs text-muted-foreground">Estado de la infraestructura y proveedores</p>
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

        <div className="p-8 max-w-7xl space-y-6">
          {/* Overall Status */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-accent/5 border border-accent/20 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Todos los sistemas operativos</p>
              <p className="text-sm text-muted-foreground">Última verificación hace 2 minutos</p>
            </div>
            <Badge className="ml-auto bg-accent/10 text-accent border-accent/20 text-xs">Uptime 99.97%</Badge>
          </motion.div>

          {/* System Metrics */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Infraestructura interna</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {systemMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Wifi className="w-4 h-4 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{metric.label}</span>
                      <span className="text-xs font-mono text-muted-foreground">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Providers Status */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Estado de proveedores LLM</h3>
            <div className="space-y-3">
              {providers.map((provider) => {
                const cfg = statusConfig[provider.status as keyof typeof statusConfig];
                const StatusIcon = cfg.icon;
                return (
                  <div key={provider.name} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <StatusIcon className={`w-5 h-5 ${cfg.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{provider.name}</span>
                        <Badge variant="secondary" className={`text-[10px] ${cfg.bg} ${cfg.color} border-0`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Último incidente: {provider.lastIncident}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono text-foreground">{provider.uptime}%</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {provider.latency}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Health;
