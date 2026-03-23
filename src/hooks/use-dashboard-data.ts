import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { kairoSupabase } from "@/integrations/supabase/kairo-client";

export interface DashboardStats {
  requestsToday: number;
  savingsToday: number;
  rTokensTotal: number;
  avgLatency: number;
  efficiencyMultiplier: number;
}

export interface UsageLogEntry {
  id: string;
  provider_id: string;
  model_id: string;
  method: string;
  endpoint: string;
  status_code: number;
  tokens_input: number;
  tokens_output: number;
  rtokens_generated: number;
  cost_usd: number;
  savings_usd: number;
  latency_ms: number;
  created_at: string;
}

export interface ChartDataPoint {
  date: string;
  requests: number;
  savings: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    requestsToday: 0,
    savingsToday: 0,
    rTokensTotal: 0,
    avgLatency: 0,
    efficiencyMultiplier: 0,
  });
  const [recentLogs, setRecentLogs] = useState<UsageLogEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Fetch today's stats
    const { data: todayLogs } = await kairoSupabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    const logs = todayLogs || [];
    const requestsToday = logs.length;
    const savingsToday = logs.reduce((s, l) => s + Number(l.savings_usd), 0);
    const avgLatency = logs.length > 0 ? Math.round(logs.reduce((s, l) => s + l.latency_ms, 0) / logs.length) : 0;

    // Fetch total rTokens
    const { data: allLogs } = await kairoSupabase
      .from("usage_logs")
      .select("rtokens_generated, cost_usd, savings_usd")
      .eq("user_id", user.id);

    const all = allLogs || [];
    const rTokensTotal = all.reduce((s, l) => s + l.rtokens_generated, 0);
    const totalCost = all.reduce((s, l) => s + Number(l.cost_usd), 0);
    const totalSavings = all.reduce((s, l) => s + Number(l.savings_usd), 0);
    const efficiencyMultiplier = totalCost > 0 ? 1 + (totalSavings / totalCost) : 0;

    setStats({ requestsToday, savingsToday, rTokensTotal, avgLatency, efficiencyMultiplier });

    // Fetch recent logs
    const { data: recent } = await kairoSupabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentLogs((recent as UsageLogEntry[]) || []);

    // Build chart data (last 7 days)
    const days: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLogs = (allLogs || []).filter(
        (l: any) => l.created_at?.startsWith?.(dateStr) || false
      );
      // We don't have created_at in this query, so use recent for chart
      days.push({ date: dateStr, requests: 0, savings: 0 });
    }

    // Re-fetch with created_at for chart
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weekLogs } = await kairoSupabase
      .from("usage_logs")
      .select("created_at, savings_usd")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString());

    const chartDays: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLogs = (weekLogs || []).filter((l) => l.created_at.startsWith(dateStr));
      chartDays.push({
        date: new Date(dateStr).toLocaleDateString("es", { weekday: "short" }),
        requests: dayLogs.length,
        savings: dayLogs.reduce((s, l) => s + Number(l.savings_usd), 0),
      });
    }
    setChartData(chartDays);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Realtime subscription
    const channel = kairoSupabase
      .channel("dashboard-usage")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "usage_logs" }, () => {
        fetchData();
      })
      .subscribe();

    return () => { kairoSupabase.removeChannel(channel); };
  }, []);

  return { stats, recentLogs, chartData, loading, refetch: fetchData };
}
