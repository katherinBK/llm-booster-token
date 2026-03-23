import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ScrollText, Filter, Download, RefreshCw, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { kairoSupabase } from "@/integrations/supabase/kairo-client";

const Logs = () => {
  const [filter] = useState("all");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: "0", success: "0%", rTokens: "0" });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await kairoSupabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (data && !error) {
      setLogs(data);
      
      const successCount = data.filter(l => l.status_code === 200).length;
      const successRate = data.length > 0 ? ((successCount / data.length) * 100).toFixed(1) : 0;
      const totalRtokens = data.reduce((acc, curr) => acc + (curr.rtokens_generated || 0), 0);

      setStats({
        total: data.length.toString(),
        success: `${successRate}%`,
        rTokens: totalRtokens.toLocaleString()
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Logs</h1>
            <p className="text-xs text-muted-foreground">Historial de requests en tiempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-1">U</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl space-y-6">
          {/* Actions Bar */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="w-3.5 h-3.5 mr-1.5" />Filtrar</Button>
              <Badge variant="secondary" className="text-xs">{filter === "all" ? "Todos" : filter}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchLogs}><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Actualizar</Button>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Exportar</Button>
            </div>
          </motion.div>

          {/* Logs Table */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                  <TableHead className="text-xs font-semibold">Endpoint</TableHead>
                  <TableHead className="text-xs font-semibold">Provider</TableHead>
                  <TableHead className="text-xs font-semibold">Modelo</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Latencia</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Tokens</TableHead>
                  <TableHead className="text-xs font-semibold text-right">rTokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                      No hay logs registrados aún.
                    </TableCell>
                  </TableRow>
                ) : logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 cursor-pointer">
                    <TableCell className="text-xs font-mono text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-mono">{log.endpoint}</TableCell>
                    <TableCell className="text-xs capitalize">{log.provider_id}</TableCell>
                    <TableCell className="text-xs">{log.model_id}</TableCell>
                    <TableCell>
                      <Badge variant={log.status_code === 200 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                        {log.status_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.latency_ms}ms</TableCell>
                    <TableCell className="text-xs text-right font-mono">{(log.tokens_input + log.tokens_output).toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-accent">+{log.rtokens_generated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total requests (histórico)", value: stats.total },
              { label: "Tasa de éxito", value: stats.success },
              { label: "rTokens generados", value: stats.rTokens },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Logs;
