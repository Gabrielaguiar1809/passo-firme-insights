import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/vendas/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos de Venda — PassoFirme" }] }),
  component: PedidosVendaPage,
});

const statusCls: Record<string, string> = {
  "Negociação": "bg-info/15 text-info",
  "Validado": "bg-primary/10 text-primary",
  "Reservado": "bg-warning/25 text-warning-foreground",
  "Produção": "bg-primary/10 text-primary",
  "Pronto para envio": "bg-info/15 text-info",
  "Finalizado": "bg-success/15 text-success",
};

const HOJE = new Date("2026-05-31");
function slaEntrega(prev: string): { cor: string; label: string } {
  const dias = Math.floor((new Date(prev).getTime() - HOJE.getTime()) / 86400000);
  if (dias < 3) return { cor: "bg-destructive", label: `${dias}d` };
  if (dias <= 7) return { cor: "bg-warning", label: `${dias}d` };
  return { cor: "bg-success", label: `${dias}d` };
}

function PedidosVendaPage() {
  const { pedidosVenda, vendedores } = useData();
  const [canal, setCanal] = useState("todos");
  const [vend, setVend] = useState("todos");
  const [produto, setProduto] = useState("todos");
  const [status, setStatus] = useState("todos");

  const filtered = useMemo(() => pedidosVenda.filter((p) => {
    if (canal !== "todos" && p.canal !== canal) return false;
    if (vend !== "todos" && p.vendedorId !== vend) return false;
    if (produto !== "todos" && p.produtoComercial !== produto) return false;
    if (status !== "todos" && p.status !== status) return false;
    return true;
  }), [pedidosVenda, canal, vend, produto, status]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pedidos de Venda</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} pedidos integrados ao Produto Acabado e à Produção.</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-3">
        <Select value={canal} onValueChange={setCanal}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos canais</SelectItem>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="B2C">B2C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vend} onValueChange={setVend}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos vendedores</SelectItem>
            {vendedores.map((v) => <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={produto} onValueChange={setProduto}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos produtos</SelectItem>
            <SelectItem value="Esportivo">Produto 1 — Esportivo</SelectItem>
            <SelectItem value="Casual">Produto 2 — Casual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            {Object.keys(statusCls).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nº</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Vendedor</th>
              <th className="px-4 py-3 text-left">Canal</th>
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-right">Qtd</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-left">Entrega</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const sla = slaEntrega(p.previsaoEntrega);
              const vd = vendedores.find((v) => v.id === p.vendedorId);
              return (
                <tr key={p.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.numero}</td>
                  <td className="px-4 py-3 font-medium">{p.cliente}</td>
                  <td className="px-4 py-3 text-muted-foreground">{vd?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-xs"><span className="rounded-full bg-muted px-2 py-0.5">{p.canal}</span></td>
                  <td className="px-4 py-3">{p.produto}</td>
                  <td className="px-4 py-3 text-right">{p.quantidade}</td>
                  <td className="px-4 py-3 text-right font-medium">{brl(p.valor)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${sla.cor}`} />
                      {p.previsaoEntrega}
                    </span>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls[p.status]}`}>{p.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
