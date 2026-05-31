import { createFileRoute } from "@tanstack/react-router";
import { useIndicadoresVendas } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Award, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/vendas/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores Comerciais — PassoFirme" }] }),
  component: IndComerciaisPage,
});

function IndComerciaisPage() {
  const ind = useIndicadoresVendas();
  const data = ind.ranking.slice(0, 6).map(([nome, qtd]) => ({ nome: nome.length > 18 ? nome.slice(0, 18) + "…" : nome, qtd }));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores Comerciais</h1>
        <p className="text-sm text-muted-foreground">Performance de vendas integrada ao funil e Produto Acabado.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Conversão" value={`${ind.conversao}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <KpiCard label="Ticket Médio" value={brl(ind.ticketMedio)} icon={<ShoppingBag className="h-5 w-5" />} tone="info" />
        <KpiCard label="Pedidos Fechados" value={ind.pedidosFechados} icon={<Award className="h-5 w-5" />} tone="default" />
        <KpiCard label="Novos Clientes" value={ind.novosClientes} icon={<Users className="h-5 w-5" />} tone="warning" />
        <KpiCard label="Mais Vendido" value={<span className="text-base">{ind.maisVendido}</span>} icon={<Award className="h-5 w-5" />} tone="success" />
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold mb-4">Ranking de produtos vendidos</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="nome" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="qtd" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
