import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import type { DashboardStats } from "@/hooks/use-dashboard-data";

interface EfficiencyCardProps {
  stats: DashboardStats;
  loading: boolean;
}

const EfficiencyCard = ({ stats, loading }: EfficiencyCardProps) => {
  const hasData = stats.efficiencyMultiplier > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 glow-primary"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Efficiency Multiplier</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-foreground">
              {loading ? "—" : hasData ? `${stats.efficiencyMultiplier.toFixed(2)}x` : "—"}
            </span>
            <span className="text-sm text-muted-foreground">
              {hasData ? "más eficiente" : "Sin datos aún"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {hasData ? "Basado en tu historial de requests" : "El multiplicador se calculará con tu primer request"}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      <div className="bg-muted/60 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">rTokens generados</p>
            <p className="font-mono text-lg font-semibold text-foreground">
              {loading ? "—" : stats.rTokensTotal.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {hasData ? (
              <>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-green-500">Activo</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Esperando requests</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EfficiencyCard;
