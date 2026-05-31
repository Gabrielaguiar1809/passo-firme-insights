import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/estoque/recebimentos")({
  head: () => ({ meta: [{ title: "Recebimentos — PassoFirme" }] }),
  component: RecebimentosPage,
});

function RecebimentosPage() {
  const { pedidos, fornecedores } = useData();
  const recs = pedidos.filter((p) => p.status === "Recebido").sort((a, b) => (b.entregaRealizada ?? "").localeCompare(a.entregaRealizada ?? ""));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recebimentos</h1>
        <p className="text-sm text-muted-foreground">Pedidos de compra concluídos e entregues ao almoxarifado.</p>
      </div>
      <div className="grid gap-3">
        {recs.map((p) => {
          const f = fornecedores.find((x) => x.id === p.fornecedorId);
          const ontime = p.entregaRealizada && p.entregaRealizada <= p.entregaPrevista;
          return (
            <div key={p.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success"><Truck className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{p.numero} · {f?.nome}</p>
                <p className="text-xs text-muted-foreground">{p.categoria} · {p.quantidade} un · recebido em {p.entregaRealizada}</p>
              </div>
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${ontime ? "bg-success/15 text-success" : "bg-warning/25 text-warning-foreground"}`}>{ontime ? "No prazo" : "Atrasado"}</span>
              <span className="text-sm font-semibold tabular-nums">{brl(p.valor)}</span>
            </div>
          );
        })}
        {recs.length === 0 && <p className="text-sm text-muted-foreground italic">Nenhum recebimento registrado.</p>}
      </div>
    </div>
  );
}
