import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { AlertTriangle, FileText } from "lucide-react";

export const Route = createFileRoute("/visao/observacoes")({
  head: () => ({ meta: [{ title: "Observações Estratégicas — PassoFirme" }] }),
  component: ObservacoesPage,
});

const impactoCls: Record<string, string> = {
  Alto: "bg-destructive/15 text-destructive border-destructive/30",
  Médio: "bg-warning/25 text-warning-foreground border-warning/30",
  Baixo: "bg-info/15 text-info border-info/30",
};

function ObservacoesPage() {
  const { observacoes } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Observações Estratégicas</h1>
        <p className="text-sm text-muted-foreground">Apontamentos consolidados pela gestão a partir dos dados operacionais.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {observacoes.map((o) => (
          <div key={o.id} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{o.categoria} · {o.data}</p>
                  <h3 className="text-sm font-semibold leading-tight">{o.titulo}</h3>
                </div>
              </div>
              <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${impactoCls[o.impacto]}`}>
                <AlertTriangle className="h-3 w-3" /> {o.impacto}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{o.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
