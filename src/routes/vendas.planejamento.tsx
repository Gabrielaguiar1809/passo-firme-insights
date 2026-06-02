import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useData, usePlanejamentoComercial, useFollowUpAlerts } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Target, TrendingUp, Crosshair, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/vendas/planejamento")({
  head: () => ({ meta: [{ title: "Planejamento Estratégico — PassoFirme" }] }),
  component: PlanejamentoPage,
});

function PlanejamentoPage() {
  const { metas, setMetas, vendedores, pedidosVenda } = useData();
  const plan = usePlanejamentoComercial();
  const churn = useFollowUpAlerts().filter((f) => f.motivo === "Risco de Churn");
  const [open, setOpen] = useState(false);

  const produtoRanking = Object.entries(
    pedidosVenda.filter((p) => p.status === "Finalizado").reduce<Record<string, { qtd: number; valor: number }>>((acc, p) => {
      const k = p.produtoComercial ?? p.produto;
      acc[k] = acc[k] ?? { qtd: 0, valor: 0 };
      acc[k].qtd += p.quantidade; acc[k].valor += p.valor;
      return acc;
    }, {}),
  ).map(([produto, v]) => ({ produto, ...v })).sort((a, b) => b.valor - a.valor);
  const totalReceita = produtoRanking.reduce((a, p) => a + p.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Planejamento Estratégico</h1>
          <p className="text-sm text-muted-foreground">Visão executiva de metas, crescimento e projeções.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button>Configurar Metas</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Metas Comerciais</DialogTitle></DialogHeader>
            <MetasForm metas={metas} onSave={(m) => { setMetas(m); setOpen(false); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Meta do Mês" value={brl(metas.mensal)} hint={`Realizado: ${brl(plan.realizadoMes)} (${plan.pctMeta}%)`} icon={<Target className="h-5 w-5" />} tone="info" />
        <KpiCard label="Projeção de Fechamento" value={brl(plan.projecaoMes)} hint={plan.projecaoMes >= metas.mensal ? "Acima da meta" : "Abaixo da meta"} icon={<Crosshair className="h-5 w-5" />} tone={plan.projecaoMes >= metas.mensal ? "success" : "warning"} />
        <KpiCard label="Crescimento Mensal" value={`${plan.crescMensal}%`} icon={<TrendingUp className="h-5 w-5" />} tone={plan.crescMensal >= 0 ? "success" : "danger"} />
        <KpiCard label="Pipeline Ponderado" value={brl(plan.pipelinePonderado)} icon={<Sparkles className="h-5 w-5" />} />
        <KpiCard label="Conversão histórica" value={`${(plan.taxaConvHist * 100).toFixed(0)}%`} icon={<BarChart3 className="h-5 w-5" />} />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold mb-4">Receita planejada vs realizada</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={plan.serie}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="meta" fill="var(--muted)" name="Meta" />
              <Bar dataKey="realizado" fill="var(--primary)" name="Realizado" />
              <Line type="monotone" dataKey="projecao" stroke="#f59e0b" strokeDasharray="5 5" name="Projeção" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Produtos mais vendidos</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr><th className="text-left py-2">Produto</th><th className="text-right">Pares</th><th className="text-right">Receita</th><th className="text-right">% Total</th></tr>
            </thead>
            <tbody>
              {produtoRanking.map((p) => (
                <tr key={p.produto} className="border-t">
                  <td className="py-2 font-medium">{p.produto}</td>
                  <td className="text-right">{p.qtd}</td>
                  <td className="text-right">{brl(p.valor)}</td>
                  <td className="text-right">{totalReceita ? ((p.valor / totalReceita) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-base font-semibold mb-4">Clientes em risco de churn</h3>
          {churn.length === 0 && <p className="text-sm text-muted-foreground italic">Nenhum cliente em risco no momento.</p>}
          <ul className="space-y-2">
            {churn.map(({ cliente, diasDesdeUltimoPed }) => {
              const vd = vendedores.find((v) => v.id === cliente.vendedorId);
              return (
                <li key={cliente.id} className="border rounded-md p-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{cliente.empresa}</p>
                    <p className="text-xs text-muted-foreground">{vd?.nome ?? "—"} · ciclo médio {cliente.cicloMedio}d · sem pedido há {diasDesdeUltimoPed}d</p>
                  </div>
                  <Button size="sm" variant="outline">Criar Follow-up</Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetasForm({ metas, onSave }: { metas: { mensal: number; trimestral: number; anual: number }; onSave: (m: { mensal: number; trimestral: number; anual: number }) => void }) {
  const [m, setM] = useState(metas);
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(m); }}>
      <div><Label>Meta mensal (R$)</Label><Input type="number" value={m.mensal} onChange={(e) => setM({ ...m, mensal: Number(e.target.value) })} /></div>
      <div><Label>Meta trimestral (R$)</Label><Input type="number" value={m.trimestral} onChange={(e) => setM({ ...m, trimestral: Number(e.target.value) })} /></div>
      <div><Label>Meta anual (R$)</Label><Input type="number" value={m.anual} onChange={(e) => setM({ ...m, anual: Number(e.target.value) })} /></div>
      <Button type="submit" className="w-full">Salvar metas</Button>
    </form>
  );
}
