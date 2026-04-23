import { AppLayout } from "@/components/fairlens/AppLayout";
import { PageHeader } from "@/components/fairlens/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => (
  <AppLayout>
    <PageHeader
      eyebrow="Account"
      title="Settings"
      description="Workspace preferences, integrations, and notification rules."
    />

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6">
          <div className="font-display font-semibold text-lg mb-4">Workspace</div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Workspace name</Label>
              <Input defaultValue="FairLens · Acme Inc." className="mt-1.5 bg-muted/30 border-border/50" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Default fairness threshold</Label>
              <Input defaultValue="0.80" className="mt-1.5 bg-muted/30 border-border/50 font-mono" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="font-display font-semibold text-lg mb-4">Notifications</div>
          <div className="space-y-4">
            {[
              { l: "Bias drift alerts", d: "Notify when fairness drops below threshold", v: true },
              { l: "Weekly digest", d: "Summary of all audits every Monday", v: true },
              { l: "Slack integration", d: "Post critical findings to #ml-fairness", v: false },
            ].map((s) => (
              <div key={s.l} className="flex items-start justify-between gap-4 py-2 border-b border-border/40 last:border-0">
                <div>
                  <div className="font-medium text-sm">{s.l}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
                <Switch defaultChecked={s.v} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => toast.success("Settings saved")} className="bg-gradient-primary border-0 hover:shadow-glow">
            Save changes
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-5">
          <div className="font-display font-semibold mb-1">Plan</div>
          <div className="gradient-text font-display text-2xl font-bold">Pro</div>
          <div className="text-xs text-muted-foreground mt-1 mb-4">Unlimited audits · 50K rows</div>
          <Button variant="outline" className="w-full glass border-border/60">Manage billing</Button>
        </div>
        <div className="glass-card p-5">
          <div className="font-display font-semibold mb-2">Danger zone</div>
          <p className="text-xs text-muted-foreground mb-3">Permanently delete this workspace and all reports.</p>
          <Button variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10">
            Delete workspace
          </Button>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Settings;