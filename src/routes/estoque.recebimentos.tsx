import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { Truck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { StatusConferencia } from "@/lib/passofirme/data";

export const Route = createFileRoute("/estoque/recebimentos")({
  head: () => ({ meta: [{ title: "Recebimentos — PassoFirme" }] }),
  component: RecebimentosPage,
});

const confCfg: Record<StatusConferencia, { cls: string; Icon: typeof CheckCircle2 }> = {
  Conferido: { cls: "bg-success/15 text-success", Icon: CheckCircle2 },
  Pendente: { cls: "bg-warning/25 text-warning-foreground", Icon: Clock },
  "Com divergência": { cls: "bg-destructive/15 text-destructive", Icon: AlertTriangle },
};

function RecebimentosPage() {
  const { pedidos, fornecedores } = useData();
  const recs = useMemo(
    () => pedidos
      .filter((p) => p.status === "Recebido")
      .sort((a, b) => (b.entregaRealizada ?? "").localeCompare(a.entregaRealizada ?? "")),
    [pedidos],
  );
  const fMap = useMemo(() => Object.fromEntries(fornecedores.map((f) => [f.id, f.nome])), [fornecedores]);

  const totais = useMemo(() => {
    const t = { Conferido: 0, Pendente: 0, "Com divergência": 0 } as Record<StatusConferencia, number>;
    recs.forEach((r) => { if (r.statusConferencia) t[r.statusConferencia] += 1; });
    return t;
  }, [recs]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" /> Recebimentos
        </h1>
        <p className="text-sm text-muted-foreground">Materiais recebidos vinculados aos pedidos de compra.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(Object.keys(totais) as StatusConferencia[]).map((k) => {
          const c = confCfg[k];
          return (
            <div key={k} className="rounded-xl border bg-card p-5 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg grid place-items-center ${c.cls}`}><c.Icon className="h-5 w-5" /></div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">{k}</p>
                <p className="text-2xl font-semibold">{totais[k]}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">OC</th>
                <th className="px-4 py-3 text-left font-medium">Fornecedor</th>
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-right font-medium">Quantidade</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 text-left font-medium">Data recebimento</th>
                <th className="px-4 py-3 text-left font-medium">Conferência</th>
              </tr>
            </thead>
            <tbody>
              {recs.map((p) => {
                const sc = p.statusConferencia ?? "Pendente";
                const c = confCfg[sc];
                return (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.numero}</td>
                    <td className="px-4 py-3">{fMap[p.fornecedorId] ?? "—"}</td>
                    <td className="px-4 py-3">{p.itemNome ?? p.categoria}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.quantidade?.toLocaleString("pt-BR") ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{brl(p.valor)}</td>
                    <td className="px-4 py-3">{p.entregaRealizada ? new Date(p.entregaRealizada).toLocaleDateString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.cls}`}>
                        <c.Icon className="h-3 w-3" />{sc}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recs.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Nenhum recebimento registrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
