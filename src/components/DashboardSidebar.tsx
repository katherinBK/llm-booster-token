import { BarChart3, Key, CreditCard, ScrollText, Activity, Settings, LogOut, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import kairoLogo from "@/assets/kairo-logo.png";
import solanaLogo from "@/assets/solana-logo.png";

const navItems = [
  { icon: BarChart3, label: "Usage", href: "/dashboard" },
  { icon: Zap, label: "Playground", href: "/dashboard/playground" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: ScrollText, label: "Logs", href: "/dashboard/logs" },
  { icon: Activity, label: "System Health", href: "/dashboard/health" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={kairoLogo} alt="Kairo" className="w-8 h-8" />
          <span className="font-bold text-lg text-foreground tracking-tight">Kairo</span>
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

      <div className="p-4 border-t border-border space-y-3">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Plan</p>
          <p className="text-sm font-semibold text-foreground">Pay-as-you-go</p>
          <p className="text-xs text-muted-foreground mt-1">Solo pagas lo que usas</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
        <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
          <span className="text-[10px] text-muted-foreground">Powered by</span>
          <img src={solanaLogo} alt="Solana" className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold text-muted-foreground">Solana</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
