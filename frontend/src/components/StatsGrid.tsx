import { motion } from "framer-motion";
import { Activity, DollarSign, Layers, Clock } from "lucide-react";
import type { DashboardStats } from "@/hooks/use-dashboard-data";

interface StatsGridProps {
  stats: DashboardStats;
  loading: boolean;
}

const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  const items = [
    { label: "Requests hoy", value: loading ? "—" : stats.requestsToday.toLocaleString(), icon: Activity, sub: stats.requestsToday > 0 ? "Activo" : "Sin actividad" },
    { label: "Ahorro estimado", value: loading ? "—" : `$${stats.savingsToday.toFixed(2)}`, icon: DollarSign, sub: stats.savingsToday > 0 ? "Hoy" : "Sin actividad" },
    { label: "rTokens totales", value: loading ? "—" : stats.rTokensTotal.toLocaleString(), icon: Layers, sub: stats.rTokensTotal > 0 ? "Acumulados" : "Sin actividad" },
    { label: "Latencia promedio", value: loading ? "—" : stats.avgLatency > 0 ? `${stats.avgLatency}ms` : "—", icon: Clock, sub: stats.avgLatency > 0 ? "Hoy" : "Sin actividad" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
