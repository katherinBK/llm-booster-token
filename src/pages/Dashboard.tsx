import DashboardSidebar from "@/components/DashboardSidebar";
import EfficiencyCard from "@/components/EfficiencyCard";
import StatsGrid from "@/components/StatsGrid";
import UsageChart from "@/components/UsageChart";
import RecentLogs from "@/components/RecentLogs";
import HowItWorks from "@/components/HowItWorks";
import { Bell, Search } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Optimización de LLM vía rToken en Solana</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150 relative">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold ml-1">
              U
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          <EfficiencyCard />
          <StatsGrid />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <UsageChart />
            </div>
            <div className="xl:col-span-1">
              <HowItWorks />
            </div>
          </div>
          <RecentLogs />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
