import { BarChart3, Key, CreditCard, ScrollText, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: BarChart3, label: "Usage", active: true },
  { icon: Key, label: "API Keys", active: false },
  { icon: CreditCard, label: "Billing", active: false },
  { icon: ScrollText, label: "Logs", active: false },
  { icon: Activity, label: "System Health", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const DashboardSidebar = () => {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">rToken</span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium ml-auto">Beta</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
          <p className="text-sm font-semibold text-foreground">Growth</p>
          <p className="text-xs text-muted-foreground mt-1">50,000 req/mo included</p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
