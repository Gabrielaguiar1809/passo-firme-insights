import type { ReactNode } from "react";
import { brl } from "./ui-bits";

export interface KanbanItem { id: string; title: string; subtitle?: string; valor?: number; meta?: ReactNode; }

export function KanbanBoard({ stages, items }: { stages: string[]; items: (KanbanItem & { stage: string })[] }) {
  return (
    <div className="grid gap-3 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))` }}>
      {stages.map((s) => {
        const cards = items.filter((i) => i.stage === s);
        const total = cards.reduce((a, c) => a + (c.valor ?? 0), 0);
        return (
          <div key={s} className="rounded-xl border bg-muted/30 p-3 flex flex-col gap-2 min-h-[200px]">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s}</h4>
              <span className="text-[10px] rounded-full bg-card border px-2 py-0.5">{cards.length}</span>
            </div>
            {total > 0 && <p className="text-[10px] text-muted-foreground -mt-1">{brl(total)}</p>}
            <div className="flex flex-col gap-2">
              {cards.map((c) => (
                <div key={c.id} className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition">
                  <p className="text-sm font-semibold leading-tight">{c.title}</p>
                  {c.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</p>}
                  {c.valor !== undefined && <p className="text-xs font-medium text-primary mt-1.5">{brl(c.valor)}</p>}
                  {c.meta && <div className="mt-1.5 text-[10px] text-muted-foreground">{c.meta}</div>}
                </div>
              ))}
              {cards.length === 0 && <p className="text-[11px] text-muted-foreground italic">vazio</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
