import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";

const RecentLogs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Request Log reciente</h3>
      </div>

      <div className="py-12 flex items-center justify-center">
        <div className="text-center">
          <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">No hay logs aún</p>
          <p className="text-xs text-muted-foreground mt-1">Tus requests aparecerán aquí en tiempo real</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentLogs;
