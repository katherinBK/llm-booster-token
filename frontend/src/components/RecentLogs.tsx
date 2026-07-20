import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UsageLogEntry } from "@/hooks/use-dashboard-data";

interface RecentLogsProps {
  logs: UsageLogEntry[];
  loading: boolean;
}

const RecentLogs = ({ logs, loading }: RecentLogsProps) => {
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

      {!loading && logs.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 text-xs">
              <div className="flex items-center gap-3">
                <Badge variant={log.status_code < 400 ? "default" : "destructive"} className="text-[10px] px-1.5">
                  {log.status_code}
                </Badge>
                <span className="font-mono text-muted-foreground">{log.method}</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{log.endpoint}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{log.tokens_input + log.tokens_output} tok</span>
                <span>{log.latency_ms}ms</span>
                <span>{new Date(log.created_at).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex items-center justify-center">
          <div className="text-center">
            <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No hay logs aún</p>
            <p className="text-xs text-muted-foreground mt-1">Tus requests aparecerán aquí en tiempo real</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecentLogs;
