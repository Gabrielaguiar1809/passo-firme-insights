import { createFileRoute } from "@tanstack/react-router";
import { useData, useIndicadores } from "@/lib/passofirme/store";
import { KpiCard } from "@/components/passofirme/ui-bits";
import { brl } from "@/components/passofirme/ui-bits";
import { AlertTriangle, ClipboardList, PackageX, ShoppingCart, Sparkles, Target, TrendingUp, Truck } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useInsights } from "@/lib/passofirme/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard Executivo — PassoFirme" }] }),
  component: Dashboard,
});

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const BAR_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--primary)", "var(--info)"];

function Dashboard() {
  const ind = useIndicadores();
  const insights = useInsights();
  const { fornecedores } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Executivo</h1>
        <p className="text-sm text-muted-foreground">Visão geral da operação de compras e estoque.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Compras Pendentes" value={ind.comprasPendentes} icon={<ShoppingCart className="h-5 w-5" />} tone="info" hint="Solicitações em aberto" />
        <KpiCard label="Economia Gerada" value={brl(ind.saving)} icon={<TrendingUp className="h-5 w-5" />} tone="success" hint="Saving acumulado" />
        <KpiCard label="Itens em Ruptura" value={ind.itensRuptura} icon={<PackageX className="h-5 w-5" />} tone="danger" hint="Abaixo do estoque mínimo" />
        <KpiCard label="OTIF Médio" value={`${ind.otif}%`} icon={<Target className="h-5 w-5" />} tone={ind.otif >= 90 ? "success" : "warning"} hint="Entrega no prazo + completa" />
        <KpiCard label="IQF Médio" value={ind.iqfMedio} icon={<ClipboardList className="h-5 w-5" />} tone="default" hint={`${fornecedores.length} fornecedores`} />
        <KpiCard label="Pedidos em Aberto" value={ind.pedidosAberto} icon={<Truck className="h-5 w-5" />} tone="warning" hint="Ainda não recebidos" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Compras por mês</h3>
              <p className="text-xs text-muted-foreground">Últimos 12 meses</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ind.meses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => brl(v)}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="valor" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-base font-semibold">Compras por categoria</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribuição por matéria-prima</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ind.categoriasChart} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="categoria" stroke="var(--muted-foreground)" fontSize={11} width={80} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
                  {ind.categoriasChart.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
            <h3 className="text-base font-semibold">Alertas automáticos</h3>
          </div>
          <ul className="space-y-2">
            {ind.alertas.length === 0 && <li className="text-sm text-muted-foreground">Nenhum alerta no momento.</li>}
            {ind.alertas.map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.tipo === "danger" ? "bg-destructive" : a.tipo === "warning" ? "bg-warning" : "bg-info"}`} />
                <span>{a.texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-info/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Assistente Inteligente PassoFirme</h3>
          </div>
          <ul className="space-y-2">
            {insights.slice(0, 4).map((t, i) => (
              <li key={i} className="rounded-lg bg-card/70 backdrop-blur p-3 text-sm border">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
