import { motion } from "framer-motion";
import { Activity, DollarSign, Layers, Clock } from "lucide-react";

const stats = [
  { label: "Requests hoy", value: "0", icon: Activity },
  { label: "Ahorro estimado", value: "$0.00", icon: DollarSign },
  { label: "rTokens usados", value: "0", icon: Layers },
  { label: "Latencia promedio", value: "—", icon: Clock },
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
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
          <p className="text-xs text-muted-foreground mt-1">Sin actividad</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
