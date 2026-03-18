import { BarChart3, Key, CreditCard, ScrollText, Activity, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: BarChart3, label: "Usage", href: "/dashboard" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: ScrollText, label: "Logs", href: "/dashboard/logs" },
  { icon: Activity, label: "System Health", href: "/dashboard/health" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">rToken</span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium ml-auto">Beta</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
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
