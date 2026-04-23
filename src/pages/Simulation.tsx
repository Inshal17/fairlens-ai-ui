import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/fairlens/AppLayout";
import { PageHeader } from "@/components/fairlens/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FlaskConical, RotateCcw, Save, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const initialFeatures = [
  { id: "gender", label: "Gender", enabled: true, weight: 60 },
  { id: "age", label: "Age", enabled: true, weight: 45 },
  { id: "income", label: "Income", enabled: true, weight: 70 },
  { id: "zip", label: "Zip code", enabled: true, weight: 35 },
  { id: "education", label: "Education", enabled: true, weight: 55 },
];

const Simulation = () => {
  const [features, setFeatures] = useState(initialFeatures);
  const [threshold, setThreshold] = useState([50]);

  // Live computation: enabling a sensitive feature reduces fairness, increasing weight reduces it more
  const { fairness, accuracy } = useMemo(() => {
    const sensitivePenalty = features
      .filter((f) => f.enabled && (f.id === "gender" || f.id === "zip"))
      .reduce((acc, f) => acc + f.weight * 0.25, 0);
    const totalWeight = features.filter((f) => f.enabled).reduce((a, f) => a + f.weight, 0);
    const fair = Math.max(35, Math.min(98, 95 - sensitivePenalty * 0.4 + (100 - threshold[0]) * 0.1));
    const acc = Math.max(60, Math.min(98, 70 + totalWeight * 0.05 - (100 - threshold[0]) * 0.05));
    return { fairness: Math.round(fair), accuracy: Math.round(acc) };
  }, [features, threshold]);

  const tradeoffData = useMemo(() => {
    return Array.from({ length: 11 }).map((_, i) => {
      const t = i * 10;
      return {
        threshold: t,
        fairness: Math.max(40, Math.min(98, 95 - t * 0.45)),
        accuracy: Math.max(55, Math.min(98, 60 + t * 0.35)),
      };
    });
  }, []);

  const reset = () => {
    setFeatures(initialFeatures);
    setThreshold([50]);
    toast("Simulation reset");
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="What-if engine"
        title="Live Simulation"
        description="Toggle features and tune thresholds. Watch fairness and accuracy update in real time."
        actions={
          <>
            <Button variant="outline" onClick={reset} className="glass border-border/60">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => toast.success("Configuration saved")}
              className="bg-gradient-primary border-0 hover:shadow-glow"
            >
              <Save className="h-4 w-4 mr-2" />
              Save scenario
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="h-4 w-4 text-accent" />
              <div className="font-display font-semibold">Feature controls</div>
            </div>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.id}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">{f.label}</label>
                    <Switch
                      checked={f.enabled}
                      onCheckedChange={(v) =>
                        setFeatures((prev) =>
                          prev.map((p) => (p.id === f.id ? { ...p, enabled: v } : p)),
                        )
                      }
                    />
                  </div>
                  <div className={`transition-opacity ${f.enabled ? "opacity-100" : "opacity-40"}`}>
                    <Slider
                      value={[f.weight]}
                      onValueChange={(v) =>
                        setFeatures((prev) =>
                          prev.map((p) => (p.id === f.id ? { ...p, weight: v[0] } : p)),
                        )
                      }
                      max={100}
                      step={1}
                      disabled={!f.enabled}
                    />
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                      <span>weight</span>
                      <span className="font-mono">{f.weight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="font-display font-semibold mb-4">Decision threshold</div>
            <Slider value={threshold} onValueChange={setThreshold} max={100} step={1} />
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
              <span>strict</span>
              <span className="font-mono">{threshold[0]}</span>
              <span>permissive</span>
            </div>
          </div>
        </div>

        {/* Live results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              key={fairness}
              initial={{ scale: 0.95, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Fairness Score
                </div>
                <div className="font-display text-5xl font-bold gradient-text">{fairness}%</div>
                <div className="h-2 bg-muted/40 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    animate={{ width: `${fairness}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-primary"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              key={accuracy}
              initial={{ scale: 0.95, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
              <div className="relative">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Accuracy
                </div>
                <div className="font-display text-5xl font-bold gradient-text-accent">
                  {accuracy}%
                </div>
                <div className="h-2 bg-muted/40 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-accent"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-display font-semibold text-lg">Tradeoff curve</div>
                <div className="text-xs text-muted-foreground">Accuracy vs. fairness across thresholds</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                Pareto-optimal at {threshold[0]}
              </div>
            </div>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradeoffData}>
                  <defs>
                    <linearGradient id="fairArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(265 89% 66%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(265 89% 66%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="accArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(195 95% 60%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(195 95% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="threshold" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <ChartTooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="fairness"
                    stroke="hsl(265 89% 66%)"
                    strokeWidth={2.5}
                    fill="url(#fairArea)"
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(195 95% 60%)"
                    strokeWidth={2.5}
                    fill="url(#accArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Fairness
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Simulation;