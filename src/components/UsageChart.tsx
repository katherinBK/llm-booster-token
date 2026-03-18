import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Lun", requests: 1800, savings: 420 },
  { day: "Mar", requests: 2400, savings: 580 },
  { day: "Mié", requests: 2100, savings: 510 },
  { day: "Jue", requests: 3200, savings: 780 },
  { day: "Vie", requests: 2900, savings: 700 },
  { day: "Sáb", requests: 1600, savings: 380 },
  { day: "Dom", requests: 1200, savings: 290 },
];

const UsageChart = () => {
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
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-muted-foreground">Ahorro ($)</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(263 80% 64%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(263 80% 64%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(160 93% 51%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(160 93% 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 32% 91%)",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
              }}
            />
            <Area type="monotone" dataKey="requests" stroke="hsl(263 80% 64%)" strokeWidth={2} fill="url(#gradRequests)" />
            <Area type="monotone" dataKey="savings" stroke="hsl(160 93% 51%)" strokeWidth={2} fill="url(#gradSavings)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UsageChart;
