import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";

export const Route = createFileRoute("/vendas/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos de Venda — PassoFirme" }] }),
  component: PedidosVendaPage,
});

const statusCls: Record<string, string> = {
  "Negociação": "bg-info/15 text-info",
  "Reservado": "bg-warning/25 text-warning-foreground",
  "Produção": "bg-primary/10 text-primary",
  "Pronto para envio": "bg-info/15 text-info",
  "Finalizado": "bg-success/15 text-success",
};

function PedidosVendaPage() {
  const { pedidosVenda } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pedidos de Venda</h1>
        <p className="text-sm text-muted-foreground">{pedidosVenda.length} pedidos integrados ao Produto Acabado e à Produção.</p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nº</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Canal</th>
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-right">Qtd</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-left">Entrega</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidosVenda.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{p.numero}</td>
                <td className="px-4 py-3 font-medium">{p.cliente}</td>
                <td className="px-4 py-3 text-xs"><span className="rounded-full bg-muted px-2 py-0.5">{p.canal}</span></td>
                <td className="px-4 py-3">{p.produto}</td>
                <td className="px-4 py-3 text-right">{p.quantidade}</td>
                <td className="px-4 py-3 text-right font-medium">{brl(p.valor)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.previsaoEntrega}</td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls[p.status]}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
