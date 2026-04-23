import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Bell, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border/50 glass sticky top-0 z-30 flex items-center px-4 md:px-6 gap-4">
            <SidebarTrigger className="text-foreground/80 hover:text-foreground" />
            <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models, datasets, reports..."
                  className="pl-9 bg-muted/30 border-border/50 focus-visible:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex-1 md:hidden" />
            <button className="relative h-9 w-9 rounded-xl glass flex items-center justify-center hover:scale-105 transition-transform">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent animate-glow-pulse" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition-all">
              <Sparkles className="h-4 w-4" />
              Upgrade
            </button>
          </header>
          <motion.main
            key={typeof window !== "undefined" ? window.location.pathname : ""}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 p-4 md:p-8 overflow-x-hidden"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};