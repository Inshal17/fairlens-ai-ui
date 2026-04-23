import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  Settings,
  Upload,
  Scale,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const main = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Simulation", url: "/simulation", icon: FlaskConical },
  { title: "Reports", url: "/reports", icon: FileText },
];

const secondary = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <NavLink to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base text-foreground">
                FairLens
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                AI Fairness
              </span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70 px-2">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-xl">
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-gradient-to-r from-primary/20 to-primary/5 text-foreground border border-primary/20 shadow-[inset_0_0_20px_-10px_hsl(var(--primary)/0.5)]"
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-xl">
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-foreground"
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {!collapsed && <span className="font-medium text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border/60 p-3">
          <div className="glass-card p-3 text-xs">
            <div className="font-medium text-foreground mb-1">Pro tip</div>
            <div className="text-muted-foreground leading-relaxed">
              Run simulations to preview tradeoffs before fixing bias in prod.
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}