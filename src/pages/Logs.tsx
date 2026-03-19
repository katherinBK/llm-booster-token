import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Filter, Download, RefreshCw } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Search } from "lucide-react";

const mockLogs = [
  { id: "1", timestamp: "2025-03-19 14:32:01", method: "POST", endpoint: "/v1/chat/completions", provider: "OpenAI", model: "gpt-4o", status: 200, latency: "320ms", tokens: 1240, rTokens: 45 },
  { id: "2", timestamp: "2025-03-19 14:31:58", method: "POST", endpoint: "/v1/chat/completions", provider: "Gemini", model: "gemini-pro", status: 200, latency: "280ms", tokens: 890, rTokens: 32 },
  { id: "3", timestamp: "2025-03-19 14:31:45", method: "POST", endpoint: "/v1/embeddings", provider: "OpenAI", model: "text-embedding-3", status: 200, latency: "95ms", tokens: 512, rTokens: 18 },
  { id: "4", timestamp: "2025-03-19 14:31:30", method: "POST", endpoint: "/v1/chat/completions", provider: "Anthropic", model: "claude-3.5", status: 429, latency: "—", tokens: 0, rTokens: 0 },
  { id: "5", timestamp: "2025-03-19 14:31:12", method: "POST", endpoint: "/v1/chat/completions", provider: "OpenRouter", model: "mixtral-8x7b", status: 200, latency: "410ms", tokens: 2100, rTokens: 76 },
];

const Logs = () => {
  const [filter] = useState("all");

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
              <Button variant="outline" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Actualizar</Button>
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
                {mockLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 cursor-pointer">
                    <TableCell className="text-xs font-mono text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="text-xs font-mono">{log.endpoint}</TableCell>
                    <TableCell className="text-xs">{log.provider}</TableCell>
                    <TableCell className="text-xs">{log.model}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 200 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.latency}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{log.tokens.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-accent">{log.rTokens}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total requests (hoy)", value: "1,247" },
              { label: "Tasa de éxito", value: "98.4%" },
              { label: "rTokens generados", value: "3,892" },
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
