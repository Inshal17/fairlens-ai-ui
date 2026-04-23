import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  ArrowRight,
  Upload,
  Sparkles,
  ShieldCheck,
  Activity,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Activity,
    title: "Real-time bias detection",
    desc: "Continuously monitor model outputs across protected attributes.",
  },
  {
    icon: Sparkles,
    title: "Explainable AI insights",
    desc: "Understand which features drive unfair decisions, with SHAP-grade clarity.",
  },
  {
    icon: ShieldCheck,
    title: "One-click auto-fix",
    desc: "Reweighting, adversarial debiasing, and threshold optimization built-in.",
  },
  {
    icon: Zap,
    title: "Live what-if simulation",
    desc: "Toggle features and watch fairness/accuracy tradeoffs update instantly.",
  },
];

const logos = ["NEXUS", "CORTEX", "ATLAS", "ORION", "VERTEX", "PRISM"];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/20 blur-[140px]"
      />

      {/* Nav */}
      <nav className="relative z-20 px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display font-bold text-lg">FairLens</div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-primary hover:shadow-glow transition-all border-0"
          >
            Launch app
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-10 pt-16 md:pt-24 pb-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-glow-pulse" />
          Trusted by 200+ ML teams worldwide
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          FairLens AI <span className="inline-block">⚖️</span>
          <br />
          <span className="gradient-text">Detect, Explain,</span>
          <br />
          and Eliminate Bias.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          The fairness platform for modern AI teams. Audit models, ship explainable
          decisions, and meet regulatory bars — all in one elegant workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => navigate("/upload")}
            className="bg-gradient-primary hover:shadow-glow border-0 h-12 px-7 text-base group"
          >
            <Upload className="mr-2 h-4.5 w-4.5" />
            Upload Dataset
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="h-12 px-7 text-base glass border-border/60 hover:bg-muted/50"
          >
            View live demo
          </Button>
        </motion.div>

        {/* Hero product preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-glow blur-3xl" />
          <div className="glass-card relative overflow-hidden p-2 shadow-elegant">
            <div className="rounded-xl bg-card/80 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Bias score", value: "0.32", color: "from-warning/40 to-warning/0" },
                  { label: "Fairness", value: "78%", color: "from-success/40 to-success/0" },
                  { label: "Risk", value: "Medium", color: "from-primary/40 to-primary/0" },
                ].map((m, i) => (
                  <div key={i} className={`rounded-xl p-4 bg-gradient-to-br ${m.color} border border-border/50`}>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{m.label}</div>
                    <div className="font-display font-bold text-2xl">{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-12 gap-2 h-40">
                {[40, 65, 35, 80, 50, 90, 60, 75, 45, 85, 55, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.04 }}
                    className="bg-gradient-to-t from-primary to-primary-glow rounded-t-md self-end"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logos */}
        <div className="mt-16">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Powering fairness at
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {logos.map((l) => (
              <div key={l} className="font-display font-bold text-xl tracking-widest text-muted-foreground">
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-10 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            Capabilities
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Fairness, end to end.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            From dataset audit to production monitoring — every primitive you need to ship
            equitable AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card p-7 group cursor-pointer"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-10 py-24 max-w-5xl mx-auto">
        <div className="glass-card relative overflow-hidden p-10 md:p-16 text-center shadow-elegant">
          <div className="absolute inset-0 bg-gradient-glow opacity-60" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Ship <span className="gradient-text">fair AI</span> by Friday.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Free for the first 10K rows. No credit card. No bias.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/upload")}
                className="bg-gradient-primary hover:shadow-glow border-0 h-12 px-7"
              >
                Upload your first dataset
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
              {["SOC 2 Type II", "GDPR ready", "Self-host available"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40 px-6 md:px-10 py-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-3 max-w-7xl mx-auto">
        <div>© 2025 FairLens AI. Built for an equitable future.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;