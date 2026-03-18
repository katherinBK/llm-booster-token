import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const logs = [
  { id: "tx_8f2a...c91d", model: "GPT-4o", tokens: 2140, status: "success", latency: "112ms", time: "hace 2m" },
  { id: "tx_3b7e...a4f2", model: "Claude 3.5", tokens: 1870, status: "success", latency: "98ms", time: "hace 4m" },
  { id: "tx_c91f...12ab", model: "GPT-4o", tokens: 3210, status: "error", latency: "—", time: "hace 6m" },
  { id: "tx_a2d1...e7c3", model: "Gemini Pro", tokens: 1520, status: "success", latency: "145ms", time: "hace 8m" },
  { id: "tx_71bc...f890", model: "GPT-4o", tokens: 980, status: "success", latency: "87ms", time: "hace 12m" },
];

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
        <button className="text-xs text-primary font-medium hover:underline">Ver todos</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-xs font-medium text-muted-foreground">TX Hash</th>
              <th className="text-left py-2 text-xs font-medium text-muted-foreground">Modelo</th>
              <th className="text-left py-2 text-xs font-medium text-muted-foreground">Tokens</th>
              <th className="text-left py-2 text-xs font-medium text-muted-foreground">Latencia</th>
              <th className="text-left py-2 text-xs font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-2 text-xs font-medium text-muted-foreground">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 font-mono text-xs text-foreground">{log.id}</td>
                <td className="py-3 text-foreground">{log.model}</td>
                <td className="py-3 font-mono text-xs text-foreground">{log.tokens.toLocaleString()}</td>
                <td className="py-3 font-mono text-xs text-muted-foreground">{log.latency}</td>
                <td className="py-3">
                  {log.status === "success" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-destructive font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}
                </td>
                <td className="py-3 text-right text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" /> {log.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentLogs;
