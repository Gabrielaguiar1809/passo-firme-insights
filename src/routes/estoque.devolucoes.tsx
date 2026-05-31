import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/estoque/devolucoes")({
  head: () => ({ meta: [{ title: "Devoluções — PassoFirme" }] }),
  component: DevolucoesPage,
});

function DevolucoesPage() {
  const { movimentacoes } = useData();
  const devs = movimentacoes.filter((m) => m.tipo === "Devolução");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Devoluções</h1>
        <p className="text-sm text-muted-foreground">Devoluções de matéria-prima e itens operacionais que retornam ao estoque.</p>
      </div>
      <div className="grid gap-3">
        {devs.map((m) => (
          <div key={m.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/15 text-info"><RotateCcw className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{m.itemNome}</p>
              <p className="text-xs text-muted-foreground">{m.itemTipo} · {m.origem} · {m.data} · {m.responsavel}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums">+{m.quantidade}</span>
          </div>
        ))}
        {devs.length === 0 && <p className="text-sm text-muted-foreground italic">Nenhuma devolução registrada.</p>}
      </div>
    </div>
  );
}
