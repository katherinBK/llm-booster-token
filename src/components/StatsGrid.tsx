import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Layers, Clock } from "lucide-react";

const stats = [
  {
    label: "Requests hoy",
    value: "12,847",
    change: "+14.2%",
    positive: true,
    icon: Activity,
  },
  {
    label: "Ahorro estimado",
    value: "$142.30",
    change: "+8.5%",
    positive: true,
    icon: DollarSign,
  },
  {
    label: "rTokens usados",
    value: "8,291",
    change: "-2.1%",
    positive: false,
    icon: Layers,
  },
  {
    label: "Latencia promedio",
    value: "124ms",
    change: "-12ms",
    positive: true,
    icon: Clock,
  },
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
          <div className="flex items-center gap-1 mt-1">
            {stat.positive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
            )}
            <span className={`text-xs font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>
              {stat.change}
            </span>
            <span className="text-xs text-muted-foreground">vs ayer</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
