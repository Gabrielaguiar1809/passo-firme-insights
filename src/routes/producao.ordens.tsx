import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";

export const Route = createFileRoute("/producao/ordens")({
  head: () => ({ meta: [{ title: "Ordens de Produção — PassoFirme" }] }),
  component: OPsPage,
});

const statusCls: Record<string, string> = {
  Planejada: "bg-info/15 text-info",
  "Em Produção": "bg-primary/10 text-primary",
  Concluída: "bg-success/15 text-success",
  Atrasada: "bg-destructive/15 text-destructive",
};

function OPsPage() {
  const { ordensProducao } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ordens de Produção</h1>
        <p className="text-sm text-muted-foreground">{ordensProducao.length} ordens controladas. Ao concluir, atualiza automaticamente o Produto Acabado.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ordensProducao.map((o) => {
          const saldo = Math.max(0, o.quantidadePlanejada - o.quantidadeProduzida);
          const pct = o.quantidadePlanejada > 0 ? Math.min(100, (o.quantidadeProduzida / o.quantidadePlanejada) * 100) : 0;
          return (
            <div key={o.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{o.numero}</p>
                  <h3 className="text-sm font-semibold">{o.produto}</h3>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls[o.status]}`}>{o.status}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                <div><p className="text-muted-foreground text-[10px] uppercase">Planejada</p><p className="font-semibold">{o.quantidadePlanejada}</p></div>
                <div><p className="text-muted-foreground text-[10px] uppercase">Produzida</p><p className="font-semibold text-success">{o.quantidadeProduzida}</p></div>
                <div><p className="text-muted-foreground text-[10px] uppercase">Saldo</p><p className="font-semibold">{saldo}</p></div>
                <div><p className="text-muted-foreground text-[10px] uppercase">Operadores</p><p className="font-semibold">{o.operadores}</p></div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground">{o.dataInicio} → {o.dataFim} · Retrabalho: {o.retrabalho}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
