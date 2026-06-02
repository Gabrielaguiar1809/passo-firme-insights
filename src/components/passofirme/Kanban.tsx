import type { ReactNode } from "react";
import { brl } from "./ui-bits";

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  valor?: number;
  meta?: ReactNode;
  badge?: { label: string; tone: "esportivo" | "casual" | "neutro" };
  sla?: "verde" | "amarelo" | "vermelho";
  diasNaEtapa?: number;
  onClick?: () => void;
}

const slaColor: Record<string, string> = {
  verde: "bg-success",
  amarelo: "bg-warning",
  vermelho: "bg-destructive",
};
const badgeTone: Record<string, string> = {
  esportivo: "bg-info/15 text-info",
  casual: "bg-success/15 text-success",
  neutro: "bg-muted text-muted-foreground",
};

export function KanbanBoard({ stages, items, stageLabels }: { stages: string[]; items: (KanbanItem & { stage: string })[]; stageLabels?: Record<string, string> }) {
  return (
    <div className="grid gap-3 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))` }}>
      {stages.map((s) => {
        const cards = items.filter((i) => i.stage === s);
        const total = cards.reduce((a, c) => a + (c.valor ?? 0), 0);
        return (
          <div key={s} className="rounded-xl border bg-muted/30 p-3 flex flex-col gap-2 min-h-[200px]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stageLabels?.[s] ?? s}</h4>
              <span className="text-[10px] rounded-full bg-card border px-2 py-0.5">{cards.length}</span>
            </div>
            {total > 0 && <p className="text-[10px] text-muted-foreground -mt-1">{brl(total)}</p>}
            <div className="flex flex-col gap-2">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={c.onClick}
                  className="text-left rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition relative"
                >
                  {c.sla && <span className={`absolute right-2 top-2 h-2 w-2 rounded-full ${slaColor[c.sla]}`} />}
                  <p className="text-sm font-semibold leading-tight pr-4">{c.title}</p>
                  {c.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</p>}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {c.badge && (
                      <span className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeTone[c.badge.tone]}`}>
                        {c.badge.label}
                      </span>
                    )}
                    {c.valor !== undefined && <span className="text-xs font-medium text-primary">{brl(c.valor)}</span>}
                  </div>
                  {(c.meta || c.diasNaEtapa !== undefined) && (
                    <div className="mt-1.5 text-[10px] text-muted-foreground flex items-center justify-between gap-2">
                      <span>{c.meta}</span>
                      {c.diasNaEtapa !== undefined && <span>{c.diasNaEtapa}d nesta etapa</span>}
                    </div>
                  )}
                </button>
              ))}
              {cards.length === 0 && <p className="text-[11px] text-muted-foreground italic">vazio</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
