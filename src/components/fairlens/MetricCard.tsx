import { motion } from "framer-motion";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive";
  delay?: number;
}

const accentMap = {
  primary: "from-primary/30 to-primary/0 text-primary",
  success: "from-success/30 to-success/0 text-success",
  warning: "from-warning/30 to-warning/0 text-warning",
  destructive: "from-destructive/30 to-destructive/0 text-destructive",
};

export const MetricCard = ({
  label,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  accent = "primary",
  delay = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 relative overflow-hidden group"
    >
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-60 bg-gradient-to-br transition-opacity group-hover:opacity-100",
          accentMap[accent],
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
              accentMap[accent],
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="font-display text-3xl font-bold text-foreground">{value}</div>
        {delta && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-destructive" />
            ) : null}
            <span
              className={cn(
                "font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {delta}
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};