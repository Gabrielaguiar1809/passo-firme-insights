import { createFileRoute } from "@tanstack/react-router";
import { useData, useIndicadores } from "@/lib/passofirme/store";
import { calcIQF } from "@/lib/passofirme/data";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { Activity, AlertCircle, Box, Clock, Layers, Package, ShieldCheck, Timer, TrendingDown, TrendingUp, Trophy } from "lucide-react";

export const Route = createFileRoute("/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores — PassoFirme" }] }),
  component: IndicadoresPage,
});

function IndicadoresPage() {
  const ind = useIndicadores();
  const { pedidos, materias, fornecedores } = useData();

  const comprasEmergenciais = pedidos.filter((p) => p.status === "Atrasado" || p.status === "Em Transporte").length;
  const tempoMedio = pedidos.filter((p) => p.entregaRealizada).reduce((a, p) => {
    const dias = (new Date(p.entregaRealizada!).getTime() - new Date(p.emissao).getTime()) / 86400000;
    return a + dias;
  }, 0) / Math.max(1, pedidos.filter((p) => p.entregaRealizada).length);

  // Estoque
  const giro = materias.length
    ? +(materias.reduce((a, m) => a + (m.consumoMedioDiario * 365) / Math.max(1, (m.estoqueMinimo + m.estoqueMaximo) / 2), 0) / materias.length).toFixed(2)
    : 0;
  const coberturaMedia = materias.length
    ? Math.floor(materias.reduce((a, m) => a + (m.consumoMedioDiario ? m.estoqueAtual / m.consumoMedioDiario : 0), 0) / materias.length)
    : 0;
  const hoje = new Date();
  const estoqueParado = materias.filter((m) => (hoje.getTime() - new Date(m.ultimaMovimentacao).getTime()) / 86400000 > 90).length;

  const rankingFornecedores = useMemo(
    () => [...fornecedores].map((f) => ({ nome: f.nome, iqf: calcIQF(f), otif: f.otif, leadTime: f.leadTime })).sort((a, b) => b.iqf - a.iqf),
    [fornecedores],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores</h1>
        <p className="text-sm text-muted-foreground">Visão analítica em três dimensões.</p>
      </div>

      <Tabs defaultValue="compras">
        <TabsList>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
        </TabsList>

        <TabsContent value="compras" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard label="Saving" value={brl(ind.saving)} tone="success" icon={<TrendingUp className="h-5 w-5" />} />
            <KpiCard label="Compras Emergenciais" value={comprasEmergenciais} tone="warning" icon={<AlertCircle className="h-5 w-5" />} />
            <KpiCard label="Tempo Médio de Compra" value={`${Math.floor(tempoMedio)} dias`} tone="info" icon={<Clock className="h-5 w-5" />} />
            <KpiCard label="Categorias ativas" value={ind.categoriasChart.length} tone="default" icon={<Layers className="h-5 w-5" />} />
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Compras por Categoria</h3>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={ind.categoriasChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="categoria" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]} fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="estoque" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard label="Giro de Estoque" value={`${giro}x`} tone="info" icon={<Activity className="h-5 w-5" />} hint="Consumo anual / estoque médio" />
            <KpiCard label="Cobertura Média" value={`${coberturaMedia} dias`} tone="default" icon={<Timer className="h-5 w-5" />} />
            <KpiCard label="Itens em Ruptura" value={ind.itensRuptura} tone="danger" icon={<TrendingDown className="h-5 w-5" />} />
            <KpiCard label="Estoque Parado" value={estoqueParado} tone="warning" icon={<Box className="h-5 w-5" />} hint=">90 dias sem movimentação" />
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Cobertura por item (dias)</h3>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={materias.map((m) => ({ nome: m.nome, cobertura: m.consumoMedioDiario ? Math.floor(m.estoqueAtual / m.consumoMedioDiario) : 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="nome" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="cobertura" radius={[6, 6, 0, 0]}>
                    {materias.map((m, i) => {
                      const c = m.consumoMedioDiario ? m.estoqueAtual / m.consumoMedioDiario : 0;
                      const color = c < 7 ? "var(--destructive)" : c < 15 ? "var(--warning)" : "var(--success)";
                      return <Cell key={i} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard label="IQF Médio" value={ind.iqfMedio} tone="default" icon={<ShieldCheck className="h-5 w-5" />} />
            <KpiCard label="OTIF Médio" value={`${ind.otif}%`} tone="success" icon={<Package className="h-5 w-5" />} />
            <KpiCard label="Lead Time Médio" value={`${Math.floor(fornecedores.reduce((a, f) => a + f.leadTime, 0) / Math.max(1, fornecedores.length))}d`} tone="info" icon={<Clock className="h-5 w-5" />} />
            <KpiCard label="Total Fornecedores" value={fornecedores.length} tone="default" icon={<Trophy className="h-5 w-5" />} />
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Ranking IQF</h3>
            <div className="space-y-2">
              {rankingFornecedores.map((f, i) => (
                <div key={f.nome} className="flex items-center gap-3">
                  <span className="w-6 text-xs text-muted-foreground">{i + 1}º</span>
                  <span className="flex-1 text-sm font-medium">{f.nome}</span>
                  <div className="flex-[2] h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(f.iqf / 10) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold">{f.iqf}</span>
                  <span className="w-16 text-right text-xs text-muted-foreground">OTIF {f.otif}%</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
