import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle, AlertOctagon, type LucideIcon } from "lucide-react";

export const Route = createFileRoute("/producao/gargalos")({
  head: () => ({ meta: [{ title: "Gargalos da Produção — PassoFirme" }] }),
  component: GargalosPage,
});

const semaforo: Record<string, { cls: string; Icon: LucideIcon; iconCls: string }> = {
  Normal: { cls: "border-success/40 bg-success/5", Icon: CheckCircle2, iconCls: "text-success" },
  Atenção: { cls: "border-warning/40 bg-warning/5", Icon: AlertTriangle, iconCls: "text-warning-foreground" },
  Atrasado: { cls: "border-destructive/40 bg-destructive/5", Icon: AlertOctagon, iconCls: "text-destructive" },
};

function GargalosPage() {
  const { gargalos, updateGargalo } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gargalos da Produção</h1>
        <p className="text-sm text-muted-foreground">Visão semafórica por etapa do processo produtivo.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {gargalos.map((g) => {
          const s = semaforo[g.status];
          const Icon = s.Icon;
          return (
            <div key={g.id} className={`rounded-xl border-2 ${s.cls} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">{g.etapa}</h3>
                <Icon className={`h-5 w-5 ${s.iconCls}`} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Capacidade utilizada</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${g.capacidadeUso >= 95 ? "bg-destructive" : g.capacidadeUso >= 85 ? "bg-warning" : "bg-success"}`} style={{ width: `${g.capacidadeUso}%` }} />
                </div>
                <span className="text-sm font-semibold tabular-nums">{g.capacidadeUso}%</span>
              </div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Observação</p>
              <Textarea
                className="text-xs min-h-[60px]"
                value={g.observacao}
                onChange={(e) => updateGargalo(g.id, { observacao: e.target.value })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
