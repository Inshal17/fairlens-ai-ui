import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/fairlens/AppLayout";
import { PageHeader } from "@/components/fairlens/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  FileText,
  Sparkles,
  CheckCircle2,
  Calendar,
  Eye,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const pastReports = [
  { name: "Q4 fairness audit", model: "loan_model_v3", date: "Mar 14, 2025", score: 92 },
  { name: "Hiring screen review", model: "resume_ranker_v2", date: "Mar 02, 2025", score: 86 },
  { name: "Credit risk benchmark", model: "credit_v7", date: "Feb 18, 2025", score: 78 },
];

const Reports = () => {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("Report ready · 12 pages");
    }, 1600);
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Compliance-grade"
        title="Fairness Reports"
        description="Generate audit-ready PDFs with full methodology, metrics, and mitigation plans."
        actions={
          <>
            <Button
              onClick={generate}
              disabled={generating}
              className="bg-gradient-primary border-0 hover:shadow-glow"
            >
              {generating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="glass-card p-2 shadow-elegant">
            <div className="rounded-2xl bg-card/80 p-8 md:p-12 min-h-[640px]">
              {generating ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="grid grid-cols-3 gap-3 my-6">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                  <Skeleton className="h-44" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        FairLens AI · Fairness Report
                      </div>
                      <div className="font-display text-3xl font-bold">loan_model_v3</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Report ID</div>
                      <div className="font-mono">FL-2025-0428</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { l: "Fairness", v: "92%", c: "text-success" },
                      { l: "Bias score", v: "0.11", c: "text-foreground" },
                      { l: "Risk", v: "Low", c: "text-success" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl border border-border/50 p-4">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          {m.l}
                        </div>
                        <div className={`font-display text-2xl font-bold ${m.c}`}>{m.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed">
                    <div>
                      <div className="font-display font-semibold text-foreground mb-1">
                        Executive summary
                      </div>
                      <p className="text-muted-foreground">
                        After applying reweighting and threshold optimization, the model meets the
                        80% rule across gender and age groups. Disparate impact ratio improved from
                        0.62 to 0.91 with negligible accuracy loss (-0.4%).
                      </p>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-foreground mb-1">
                        Methodology
                      </div>
                      <p className="text-muted-foreground">
                        We measured demographic parity, equal opportunity, and calibration across
                        protected attributes. Mitigation: Kamiran-Calders reweighting + per-group
                        threshold tuning.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-success text-xs pt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Compliant with EU AI Act, NYC Local Law 144
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mt-4"
            >
              <Button
                onClick={() => toast.success("Downloading PDF...")}
                className="bg-gradient-primary border-0 hover:shadow-glow flex-1"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="lg" className="glass border-border/60">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </motion.div>
          )}
        </div>

        {/* Past reports */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="font-display font-semibold mb-4">Past reports</div>
            <div className="space-y-2">
              {pastReports.map((r) => (
                <motion.div
                  key={r.name}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.model}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {r.date}
                        </div>
                        <div className="font-mono">{r.score}%</div>
                      </div>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="font-display font-semibold mb-2">Includes</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Methodology & metrics",
                "Group-level breakdowns",
                "SHAP explanations",
                "Mitigation recommendations",
                "Regulatory mapping",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;