import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";
import type { ChartDataPoint } from "@/hooks/use-dashboard-data";

interface UsageChartProps {
  chartData: ChartDataPoint[];
  loading: boolean;
}

const UsageChart = ({ chartData, loading }: UsageChartProps) => {
  const hasData = chartData.some((d) => d.requests > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Volumen de Requests vs Ahorro</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 días</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Requests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Ahorro ($)</span>
          </div>
        </div>
      </div>

      {!loading && hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              <Area type="monotone" dataKey="savings" stroke="#22c55e" fill="rgba(34,197,94,0.15)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Sin datos disponibles</p>
            <p className="text-xs text-muted-foreground mt-1">Los gráficos aparecerán cuando empieces a hacer requests</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsageChart;
