import { createFileRoute } from "@tanstack/react-router";
import { useDisponibilidade } from "@/lib/passofirme/store";

export const Route = createFileRoute("/vendas/disponibilidade")({
  head: () => ({ meta: [{ title: "Disponibilidade de Produtos — PassoFirme" }] }),
  component: DisponibilidadePage,
});

function DisponibilidadePage() {
  const lista = useDisponibilidade();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Disponibilidade de Produtos</h1>
        <p className="text-sm text-muted-foreground">Mesma base do Produto Acabado, descontando reservas e somando produção em andamento.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lista.map((p) => (
          <div key={p.id} className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition">
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{p.codigo} · {p.cor} {p.numeracao}</p>
              <h3 className="text-sm font-semibold">{p.produto}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground uppercase">Estoque</p><p className="text-lg font-semibold">{p.quantidade}</p></div>
              <div className="rounded-lg bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground uppercase">Reservado</p><p className="text-lg font-semibold text-warning-foreground">{p.reservado}</p></div>
              <div className="rounded-lg bg-success/10 p-2"><p className="text-[10px] text-muted-foreground uppercase">Disponível</p><p className="text-lg font-semibold text-success">{p.disponivel}</p></div>
              <div className="rounded-lg bg-info/10 p-2"><p className="text-[10px] text-muted-foreground uppercase">Em Produção</p><p className="text-lg font-semibold text-info">{p.emProducao}</p></div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Disponibilidade futura: <span className="font-medium text-foreground">{p.futuro}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
