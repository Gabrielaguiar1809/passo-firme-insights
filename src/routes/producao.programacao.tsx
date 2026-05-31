import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";

export const Route = createFileRoute("/producao/programacao")({
  head: () => ({ meta: [{ title: "Programação de Produção — PassoFirme" }] }),
  component: ProgramacaoPage,
});

function ProgramacaoPage() {
  const { planejamentos } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Programação de Produção</h1>
        <p className="text-sm text-muted-foreground">Mesma base do Planejamento de Compras — visível para Produção e Vendas.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {planejamentos.map((p) => {
          const pct = p.quantidadePlanejada > 0 ? Math.min(100, (p.producaoRealizada / p.quantidadePlanejada) * 100) : 0;
          return (
            <div key={p.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Iniciado em {p.inicio} · {p.periodoMeses} meses</p>
                <h3 className="text-base font-semibold">{p.produto}</h3>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl font-bold">{p.producaoRealizada}<span className="text-sm text-muted-foreground font-normal"> / {p.quantidadePlanejada} pares</span></p>
                <span className="text-xs font-medium text-primary">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
