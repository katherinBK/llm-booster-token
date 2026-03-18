import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const EfficiencyCard = () => {
  const [rtokenCount, setRtokenCount] = useState(1_284_392);

  useEffect(() => {
    const interval = setInterval(() => {
      setRtokenCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

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
            <span className="text-5xl font-extrabold text-foreground">1.5x</span>
            <span className="text-sm text-success font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              más requests
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            vs. proveedor estándar al mismo precio
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
            <p className="font-mono text-lg font-semibold text-foreground animate-count-up">
              {rtokenCount.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-medium text-success">Generando en vivo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EfficiencyCard;
