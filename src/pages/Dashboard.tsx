import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppLayout } from "@/components/fairlens/AppLayout";
import { PageHeader } from "@/components/fairlens/PageHeader";
import { MetricCard } from "@/components/fairlens/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Activity,
  AlertTriangle,
  Scale,
  Sparkles,
  Wand2,
  Info,
  Download,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShieldCheck,
  Zap,
  Filter,
  Clock,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { toast } from "sonner";

const groupBias = [
  { group: "Male", bias: 0.18, fairness: 0.82, samples: 12450 },
  { group: "Female", bias: 0.41, fairness: 0.59, samples: 11820 },
  { group: "Non-binary", bias: 0.33, fairness: 0.67, samples: 1320 },
  { group: "<25", bias: 0.22, fairness: 0.78, samples: 6200 },
  { group: "25-45", bias: 0.16, fairness: 0.84, samples: 14800 },
  { group: "45+", bias: 0.38, fairness: 0.62, samples: 4590 },
];

const fairnessTrend = [
  { day: "Mon", fairness: 62, accuracy: 91, drift: 0.04 },
  { day: "Tue", fairness: 65, accuracy: 90, drift: 0.05 },
  { day: "Wed", fairness: 61, accuracy: 92, drift: 0.07 },
  { day: "Thu", fairness: 70, accuracy: 89, drift: 0.06 },
  { day: "Fri", fairness: 73, accuracy: 90, drift: 0.05 },
  { day: "Sat", fairness: 76, accuracy: 91, drift: 0.04 },
  { day: "Sun", fairness: 78, accuracy: 90, drift: 0.03 },
];

const featureContrib = [
  { name: "Gender", value: 34, color: "hsl(265 89% 66%)" },
  { name: "Income", value: 21, color: "hsl(280 95% 72%)" },
  { name: "Age", value: 17, color: "hsl(195 95% 60%)" },
  { name: "Zip code", value: 14, color: "hsl(152 76% 50%)" },
  { name: "Other", value: 14, color: "hsl(38 95% 60%)" },
];

const biasedFeatures = [
  { name: "Gender", pct: 34, desc: "Strongly correlated with prediction outcome." },
  { name: "Income bracket", pct: 21, desc: "Proxy for socioeconomic group." },
  { name: "Age group", pct: 17, desc: "Older applicants underweighted." },
  { name: "Zip code", pct: 14, desc: "Geographic proxy for race." },
];

const fairnessMetricsRadar = [
  { metric: "Demographic\nParity", before: 62, after: 91 },
  { metric: "Equal\nOpportunity", before: 71, after: 93 },
  { metric: "Predictive\nParity", before: 68, after: 89 },
  { metric: "Calibration", before: 80, after: 94 },
  { metric: "Treatment\nEquality", before: 65, after: 90 },
  { metric: "Counterfactual", before: 70, after: 92 },
];

const auditFeed = [
  { time: "2 min ago", actor: "Claire (ML Lead)", action: "approved mitigation on", target: "loan_model_v3", tone: "success" as const },
  { time: "14 min ago", actor: "AutoAudit", action: "flagged disparate impact in", target: "zip_code feature", tone: "warning" as const },
  { time: "1 hr ago", actor: "Marco (Compliance)", action: "exported SOC-2 evidence for", target: "Q1 audit", tone: "neutral" as const },
  { time: "3 hr ago", actor: "FairLens AI", action: "completed re-training of", target: "loan_model_v3.1", tone: "primary" as const },
  { time: "Yesterday", actor: "Priya (Data Sci)", action: "uploaded", target: "applicants_2026_q1.csv", tone: "neutral" as const },
];

const modelLeaderboard = [
  { name: "loan_model_v3", env: "Production", fairness: 78, accuracy: 90.4, drift: "Low", risk: "Medium" },
  { name: "loan_model_v3.1", env: "Staging", fairness: 92, accuracy: 89.8, drift: "Low", risk: "Low" },
  { name: "fraud_detector_v2", env: "Production", fairness: 84, accuracy: 96.1, drift: "Low", risk: "Low" },
  { name: "credit_score_v7", env: "Production", fairness: 67, accuracy: 91.7, drift: "Medium", risk: "High" },
  { name: "churn_predict_v4", env: "Staging", fairness: 88, accuracy: 87.2, drift: "Low", risk: "Low" },
];

const toneStyles: Record<string, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  primary: "bg-primary/15 text-primary border-primary/30",
  neutral: "bg-muted/40 text-muted-foreground border-border/60",
};

const riskStyles: Record<string, string> = {
  Low: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
};

const Dashboard = () => {
  const [fixed, setFixed] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [timeframe, setTimeframe] = useState("7d");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [livePulse, setLivePulse] = useState(0);

  const fairnessAfter = fixed ? 92 : 78;
  const biasAfter = fixed ? 0.11 : 0.32;
  const totalSamples = groupBias.reduce((sum, g) => sum + g.samples, 0);

  useEffect(() => {
    const id = setInterval(() => setLivePulse((p) => (p + 1) % 100), 2200);
    return () => clearInterval(id);
  }, []);

  const handleFix = () => {
    setFixing(true);
    toast("Running adversarial debiasing...");
    setTimeout(() => {
      setFixing(false);
      setFixed(true);
      toast.success("Bias mitigated! Fairness improved by 14%");
    }, 1800);
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Live audit · loan_model_v3.csv"
        title="Bias Dashboard"
        description="Real-time fairness metrics across protected groups."
        actions={
          <>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="glass border-border/60 w-[130px] h-10">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="glass border-border/60">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-primary border-0 hover:shadow-glow">
              <Sparkles className="h-4 w-4 mr-2" />
              Re-run audit
            </Button>
          </>
        }
      />

      {/* Live status strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card px-4 py-3 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-foreground font-medium">Audit engine live</span>
          <span className="text-muted-foreground">· streaming {livePulse + 1240} predictions/min</span>
        </div>
        <div className="h-3 w-px bg-border/60 hidden sm:block" />
        <div className="text-muted-foreground">
          Model <span className="text-foreground font-mono">loan_model_v3</span> · v3.0.7
        </div>
        <div className="h-3 w-px bg-border/60 hidden sm:block" />
        <div className="text-muted-foreground">
          {totalSamples.toLocaleString()} samples analysed
        </div>
        <div className="ml-auto flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          SOC-2 · GDPR · EU AI Act ready
        </div>
      </motion.div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Bias Score"
          value={biasAfter.toFixed(2)}
          delta={fixed ? "-66%" : "+8%"}
          trend={fixed ? "down" : "up"}
          icon={AlertTriangle}
          accent={fixed ? "success" : "warning"}
        />
        <MetricCard
          label="Fairness Score"
          value={`${fairnessAfter}%`}
          delta={fixed ? "+14 pts" : "+3 pts"}
          trend="up"
          icon={Scale}
          accent="primary"
          delay={0.05}
        />
        <MetricCard
          label="Risk Level"
          value={fixed ? "Low" : "Medium"}
          delta={fixed ? "Mitigated" : "Action recommended"}
          trend={fixed ? "down" : "neutral"}
          icon={Activity}
          accent={fixed ? "success" : "warning"}
          delay={0.1}
        />
        <MetricCard
          label="Protected Groups"
          value="6"
          delta="2 require attention"
          trend="neutral"
          icon={Users}
          accent="primary"
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-start justify-between mb-1 gap-3">
            <div>
              <div className="font-display font-semibold text-lg">Bias across groups</div>
              <div className="text-xs text-muted-foreground">Lower is fairer · per protected attribute</div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Click bars to inspect</span>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={groupBias}
                onClick={(e: any) => {
                  const g = e?.activePayload?.[0]?.payload?.group;
                  if (g) {
                    setActiveGroup((prev) => (prev === g ? null : g));
                    toast(`Filtered: ${g}`, { description: "Cohort drill-down active" });
                  }
                }}
              >
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(280 95% 72%)" />
                    <stop offset="100%" stopColor="hsl(265 89% 66%)" />
                  </linearGradient>
                  <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(195 95% 60%)" />
                    <stop offset="100%" stopColor="hsl(265 89% 66%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="group" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--primary) / 0.08)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, _name, item: any) => [
                    `${value} bias · ${item.payload.samples.toLocaleString()} samples`,
                    item.payload.group,
                  ]}
                />
                <Bar dataKey="bias" radius={[8, 8, 0, 0]} animationDuration={900}>
                  {groupBias.map((entry) => (
                    <Cell
                      key={entry.group}
                      cursor="pointer"
                      fill={
                        activeGroup === entry.group
                          ? "url(#barGradActive)"
                          : activeGroup
                            ? "hsl(265 30% 30%)"
                            : "url(#barGrad)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {groupBias.map((g) => (
              <button
                key={g.group}
                onClick={() => setActiveGroup((prev) => (prev === g.group ? null : g.group))}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  activeGroup === g.group
                    ? "bg-primary/20 border-primary/50 text-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {g.group}
                <span className="ml-1.5 opacity-60 font-mono">{g.samples.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="font-display font-semibold text-lg">Feature contribution</div>
          <div className="text-xs text-muted-foreground mb-2">Drivers of unfairness</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureContrib}
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {featureContrib.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {featureContrib.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                  {f.name}
                </div>
                <span className="text-muted-foreground font-mono">{f.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trend + Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="font-display font-semibold text-lg">Fairness trend</div>
          <div className="text-xs text-muted-foreground mb-2">7-day rolling fairness score</div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fairnessTrend}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(265 89% 66%)" />
                    <stop offset="100%" stopColor="hsl(195 95% 60%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                <ChartTooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="fairness"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(265 89% 66%)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="font-display font-semibold text-lg flex items-center gap-2">
            Top biased features
          </div>
          <div className="text-xs text-muted-foreground mb-4">SHAP-based attribution</div>
          <TooltipProvider>
            <div className="space-y-3.5">
              {biasedFeatures.map((f, i) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
                        {f.name}
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {f.desc}
                      </TooltipContent>
                    </Tooltip>
                    <span className="font-mono text-muted-foreground">{f.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct * 2.5}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      className="h-full bg-gradient-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </motion.div>
      </div>

      {/* Auto-fix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-3">
              <Wand2 className="h-3 w-3" />
              Auto-fix
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Mitigate bias automatically
            </h3>
            <p className="text-muted-foreground mb-5 text-sm">
              Apply reweighting + threshold optimization. We'll preserve accuracy within 1% while
              improving group fairness.
            </p>
            <Button
              size="lg"
              onClick={handleFix}
              disabled={fixing || fixed}
              className="bg-gradient-primary border-0 hover:shadow-glow h-12 px-7"
            >
              {fixing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Mitigating...
                </>
              ) : fixed ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Bias fixed
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Fix Bias Automatically
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/60 p-4 bg-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Before</div>
              <div className="font-display text-3xl font-bold">78%</div>
              <div className="text-xs text-muted-foreground mt-1">Fairness</div>
              <div className="h-1.5 bg-muted/40 rounded-full mt-3 overflow-hidden">
                <div className="h-full w-[78%] bg-warning" />
              </div>
            </div>
            <motion.div
              animate={fixed ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-success/40 p-4 bg-success/10"
            >
              <div className="text-xs text-success mb-1 flex items-center gap-1">
                After {fixed && <CheckCircle2 className="h-3 w-3" />}
              </div>
              <div className="font-display text-3xl font-bold text-foreground">
                {fairnessAfter}%
              </div>
              <div className="text-xs text-success mt-1">+{fairnessAfter - 78} points</div>
              <div className="h-1.5 bg-muted/40 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: "78%" }}
                  animate={{ width: `${fairnessAfter}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-success to-accent"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;