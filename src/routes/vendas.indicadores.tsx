import { createFileRoute } from "@tanstack/react-router";
import { useData, useIndicadoresVendas, useFunilConversao, useMotivosPerda, useVendedoresPerformance, useFollowUpAlerts, usePlanejamentoComercial } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, ShoppingBag, TrendingUp, Users, Target, Activity, Clock, AlertTriangle, BadgeDollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, LineChart, Line } from "recharts";

export const Route = createFileRoute("/vendas/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores Comerciais — PassoFirme" }] }),
  component: IndComerciaisPage,
});

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function IndComerciaisPage() {
  const ind = useIndicadoresVendas();
  const { clientesB2B, pedidosVenda, metas } = useData();
  const funil = useFunilConversao();
  const motivos = useMotivosPerda();
  const performance = useVendedoresPerformance(1);
  const followUps = useFollowUpAlerts();
  const plan = usePlanejamentoComercial();

  const abertas = clientesB2B.filter((c) => c.estagio !== "Pedido Fechado" && c.estagio !== "Perdido");
  const ganhas = clientesB2B.filter((c) => c.estagio === "Pedido Fechado").length;
  const perdidas = clientesB2B.filter((c) => c.estagio === "Perdido").length;
  const pipelineTotal = abertas.reduce((a, c) => a + c.valor, 0);
  const slaOk = abertas.length - followUps.length;
  const slaCompliance = abertas.length ? +(slaOk / abertas.length * 100).toFixed(1) : 100;

  const receitaB2B = pedidosVenda.filter((p) => p.canal === "B2B" && p.status === "Finalizado").reduce((a, p) => a + p.valor, 0);
  const receitaB2C = pedidosVenda.filter((p) => p.canal === "B2C" && p.status === "Finalizado").reduce((a, p) => a + p.valor, 0);
  const fin = pedidosVenda.filter((p) => p.status === "Finalizado");
  const tkB2B = fin.filter((p) => p.canal === "B2B").length ? receitaB2B / fin.filter((p) => p.canal === "B2B").length : 0;
  const tkB2C = fin.filter((p) => p.canal === "B2C").length ? receitaB2C / fin.filter((p) => p.canal === "B2C").length : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores Comerciais</h1>
        <p className="text-sm text-muted-foreground">Performance comercial integrada ao CRM e Pedidos.</p>
      </div>

      <Tabs defaultValue="ops">
        <TabsList>
          <TabsTrigger value="ops">Operacionais</TabsTrigger>
          <TabsTrigger value="ger">Gerenciais</TabsTrigger>
        </TabsList>

        <TabsContent value="ops" className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label="Oportunidades Abertas" value={abertas.length} icon={<Activity className="h-5 w-5" />} tone="info" />
            <KpiCard label="Ganhas" value={ganhas} icon={<Award className="h-5 w-5" />} tone="success" />
            <KpiCard label="Perdidas" value={perdidas} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
            <KpiCard label="Taxa de Conversão" value={`${ind.conversao}%`} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
            <KpiCard label="Tempo Médio Fechamento" value={`${performance[0]?.cicloMedio ?? 0}d`} icon={<Clock className="h-5 w-5" />} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Pipeline Total" value={brl(pipelineTotal)} icon={<BadgeDollarSign className="h-5 w-5" />} />
            <KpiCard label="Pipeline Ponderado" value={brl(plan.pipelinePonderado)} icon={<Target className="h-5 w-5" />} tone="info" />
            <KpiCard label="SLA Compliance" value={`${slaCompliance}%`} icon={<Activity className="h-5 w-5" />} tone={slaCompliance >= 80 ? "success" : "warning"} />
            <KpiCard label="Follow-ups pendentes" value={followUps.length} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-base font-semibold mb-4">Funil de conversão</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funil} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis dataKey="etapa" type="category" stroke="var(--muted-foreground)" fontSize={11} width={120} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Bar dataKey="quantidade" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-base font-semibold mb-4">Motivos de perda</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={motivos} dataKey="qtd" nameKey="motivo" outerRadius={90} label>
                      {motivos.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-base font-semibold mb-4">Ciclo de venda por vendedor</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance.map((p) => ({ nome: p.vendedor.nome, ciclo: p.cicloMedio }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis dataKey="nome" type="category" stroke="var(--muted-foreground)" fontSize={11} width={140} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="ciclo" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ger" className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label="Receita Realizada" value={brl(plan.realizadoMes)} icon={<TrendingUp className="h-5 w-5" />} tone="success" />
            <KpiCard label="Meta do Período" value={brl(metas.mensal)} icon={<Target className="h-5 w-5" />} />
            <KpiCard label="% Meta Atingida" value={`${plan.pctMeta}%`} icon={<Activity className="h-5 w-5" />} tone={plan.pctMeta >= 80 ? "success" : "warning"} />
            <KpiCard label="Ticket Médio" value={brl(ind.ticketMedio)} icon={<ShoppingBag className="h-5 w-5" />} />
            <KpiCard label="OTIF" value="92%" icon={<Award className="h-5 w-5" />} tone="success" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard label="Receita B2B" value={brl(receitaB2B)} icon={<Users className="h-5 w-5" />} />
            <KpiCard label="Receita B2C" value={brl(receitaB2C)} icon={<Users className="h-5 w-5" />} />
            <KpiCard label="Ticket B2B" value={brl(tkB2B)} icon={<ShoppingBag className="h-5 w-5" />} />
            <KpiCard label="Ticket B2C" value={brl(tkB2C)} icon={<ShoppingBag className="h-5 w-5" />} />
            <KpiCard label="Risco de Churn" value={followUps.filter((f) => f.motivo === "Risco de Churn").length} icon={<AlertTriangle className="h-5 w-5" />} tone="danger" />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-base font-semibold mb-4">Receita por vendedor</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performance.map((p) => ({ nome: p.vendedor.nome, receita: p.receita, meta: p.vendedor.metaMensal }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="nome" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="receita" fill="var(--primary)" name="Receita" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="meta" fill="var(--muted)" name="Meta" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-base font-semibold mb-4">Evolução da receita (6 meses)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={plan.serie.filter((s) => !s.projecao)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="realizado" stroke="var(--primary)" strokeWidth={2} name="Realizado" />
                    <Line type="monotone" dataKey="meta" stroke="var(--muted-foreground)" strokeDasharray="5 5" name="Meta" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
