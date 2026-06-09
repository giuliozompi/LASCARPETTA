import { Link, useLocation } from "wouter";
import { useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, UtensilsCrossed, Image, CalendarDays, BookOpen, ShoppingBag, Star, LogOut, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/reservations", label: "Reservations", icon: BookOpen },
  { href: "/admin/catering", label: "Catering", icon: ShoppingBag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAdminLogout();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout.mutateAsync(undefined as any);
    queryClient.clear();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-card border-r border-border flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="font-serif text-xl text-primary">La Scarpetta</Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                location === href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground w-full rounded hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="border-b border-border bg-card px-4 py-3 flex items-center gap-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-5 h-5" />
          </Button>
          <span className="font-serif text-lg text-primary">Admin</span>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
