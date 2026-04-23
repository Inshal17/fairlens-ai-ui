import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/fairlens/AppLayout";
import { PageHeader } from "@/components/fairlens/PageHeader";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    setFile(f);
    toast.success(`${f.name} ready to analyze`);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const analyze = () => {
    setAnalyzing(true);
    setProgress(0);
    const steps = [
      "Parsing dataset...",
      "Detecting protected attributes...",
      "Computing fairness metrics...",
      "Generating explanations...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setProgress(Math.min((i / steps.length) * 100, 100));
      if (i <= steps.length) toast(steps[i - 1] ?? "Done");
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setAnalyzing(false);
          navigate("/dashboard");
        }, 600);
      }
    }, 700);
  };

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Upload your dataset"
        description="Drop a CSV with model predictions and protected attributes. We'll handle the rest."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "glass-card p-12 md:p-16 cursor-pointer transition-all border-2 border-dashed",
              dragOver
                ? "border-primary bg-primary/5 scale-[1.01] shadow-glow"
                : "border-border/60 hover:border-primary/60 hover:bg-muted/20",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center text-center">
              <motion.div
                animate={{ y: dragOver ? -8 : 0 }}
                className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-5"
              >
                <UploadCloud className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <div className="font-display font-semibold text-xl mb-2">
                {dragOver ? "Drop it like it's biased 🎯" : "Drag & drop your CSV"}
              </div>
              <div className="text-muted-foreground text-sm mb-5">
                or click to browse — up to 100 MB
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-primary border-0 hover:shadow-glow">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Choose file
                </Button>
                <Button variant="outline" className="glass border-border/60">
                  Use sample dataset
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-5 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    {file.name}
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB · ready
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="h-8 w-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={analyze}
                disabled={analyzing}
                className="bg-gradient-primary border-0 hover:shadow-glow h-12 flex-1 group"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing... {progress.toFixed(0)}%
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Bias
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {analyzing && (
            <div className="glass-card p-4">
              <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="font-display font-semibold mb-3">What we look for</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Disparate impact across groups",
                "Equal opportunity violations",
                "Calibration drift over time",
                "Demographic parity gaps",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-5">
            <div className="font-display font-semibold mb-2">Required columns</div>
            <p className="text-sm text-muted-foreground mb-3">
              Your CSV should include predictions, true labels, and at least one protected attribute.
            </p>
            <div className="font-mono text-xs bg-muted/40 rounded-lg p-3 text-muted-foreground">
              prediction, label, gender,<br />age_group, income, ...
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;