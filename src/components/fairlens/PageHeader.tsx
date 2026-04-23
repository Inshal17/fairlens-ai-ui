import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
      )}
    </motion.div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);