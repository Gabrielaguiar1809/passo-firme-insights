import { createFileRoute } from "@tanstack/react-router";
import { useIndicadores } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { ClipboardList, PackageX, ShoppingCart, Target, TrendingUp, Truck } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/compras/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores de Compras — PassoFirme" }] }),
  component: IndComprasPage,
});

function IndComprasPage() {
  const ind = useIndicadores();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores de Compras</h1>
        <p className="text-sm text-muted-foreground">Saving, OTIF, IQF e acompanhamento mensal.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Compras Pendentes" value={ind.comprasPendentes} icon={<ShoppingCart className="h-5 w-5" />} tone="info" />
        <KpiCard label="Saving" value={brl(ind.saving)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
        <KpiCard label="Ruptura MP" value={ind.itensRuptura} icon={<PackageX className="h-5 w-5" />} tone="danger" />
        <KpiCard label="OTIF" value={`${ind.otif}%`} icon={<Target className="h-5 w-5" />} tone={ind.otif >= 90 ? "success" : "warning"} />
        <KpiCard label="IQF Médio" value={ind.iqfMedio} icon={<ClipboardList className="h-5 w-5" />} tone="default" />
        <KpiCard label="Pedidos Abertos" value={ind.pedidosAberto} icon={<Truck className="h-5 w-5" />} tone="warning" />
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold mb-4">Evolução de compras (12 meses)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ind.meses}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="valor" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
