import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneRing: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneRing[tone])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aberta: "bg-info/15 text-info",
    "Em Aprovação": "bg-warning/25 text-warning-foreground",
    Cotando: "bg-primary/10 text-primary",
    Aprovada: "bg-success/15 text-success",
    Cancelada: "bg-muted text-muted-foreground",
    Emitido: "bg-info/15 text-info",
    Confirmado: "bg-primary/10 text-primary",
    "Em Transporte": "bg-warning/25 text-warning-foreground",
    Recebido: "bg-success/15 text-success",
    Atrasado: "bg-destructive/15 text-destructive",
    Baixa: "bg-muted text-muted-foreground",
    Média: "bg-info/15 text-info",
    Alta: "bg-warning/25 text-warning-foreground",
    Crítica: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
}

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
