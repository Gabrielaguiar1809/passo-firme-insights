import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useVendedoresPerformance } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { Award, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/vendas/analise-vendedores")({
  head: () => ({ meta: [{ title: "Análise de Vendedores — PassoFirme" }] }),
  component: AnalisePage,
});

function AnalisePage() {
  const [meses, setMeses] = useState(1);
  const data = useVendedoresPerformance(meses);
  const evolucao = Array.from({ length: 6 }, (_, i) => {
    const m = new Date(2026, 4 - (5 - i), 1).toLocaleDateString("pt-BR", { month: "short" });
    const row: Record<string, number | string> = { mes: m };
    data.forEach((d, idx) => { row[d.vendedor.nome] = Math.round(d.receita * (0.6 + i * 0.08) * (1 + (idx % 2 ? 0.05 : -0.03))); });
    return row;
  });
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Análise de Vendedores</h1>
          <p className="text-sm text-muted-foreground">Desempenho individual da equipe comercial.</p>
        </div>
        <Select value={String(meses)} onValueChange={(v) => setMeses(Number(v))}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Este mês</SelectItem>
            <SelectItem value="3">Trimestre</SelectItem>
            <SelectItem value="6">Semestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((d, idx) => (
          <div key={d.vendedor.id} className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">{d.vendedor.iniciais}</div>
                <div>
                  <p className="text-sm font-semibold">{d.vendedor.nome}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{d.vendedor.perfil}</p>
                </div>
              </div>
              {idx < 3 && <Award className={`h-5 w-5 ${idx === 0 ? "text-warning" : idx === 1 ? "text-muted-foreground" : "text-orange-400"}`} />}
            </div>
            <p className="text-xl font-semibold">{brl(d.receita)}</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min(100, d.pctMeta)}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">{d.pctMeta}% da meta ({brl(d.vendedor.metaMensal)})</p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div><p className="text-muted-foreground">Conv.</p><p className="font-medium">{d.conversao}%</p></div>
              <div><p className="text-muted-foreground">Ticket</p><p className="font-medium">{brl(d.ticketMedio)}</p></div>
              <div><p className="text-muted-foreground">Pedidos</p><p className="font-medium">{d.pedidos}</p></div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {d.pctMeta >= 80 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
              <span className={d.pctMeta >= 80 ? "text-success" : "text-destructive"}>vs período anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3 text-left">#</th>
              <th className="px-3 py-3 text-left">Vendedor</th>
              <th className="px-3 py-3 text-right">Receita</th>
              <th className="px-3 py-3 text-right">Meta</th>
              <th className="px-3 py-3 text-right">% Meta</th>
              <th className="px-3 py-3 text-right">Conv.</th>
              <th className="px-3 py-3 text-right">Ticket</th>
              <th className="px-3 py-3 text-right">Pedidos</th>
              <th className="px-3 py-3 text-right">Op. abertas</th>
              <th className="px-3 py-3 text-right">Pipeline pond.</th>
              <th className="px-3 py-3 text-right">Ciclo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.vendedor.id} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-medium">{d.vendedor.nome}</td>
                <td className="px-3 py-2 text-right">{brl(d.receita)}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{brl(d.vendedor.metaMensal)}</td>
                <td className="px-3 py-2 text-right">{d.pctMeta}%</td>
                <td className="px-3 py-2 text-right">{d.conversao}%</td>
                <td className="px-3 py-2 text-right">{brl(d.ticketMedio)}</td>
                <td className="px-3 py-2 text-right">{d.pedidos}</td>
                <td className="px-3 py-2 text-right">{d.oportunidadesAbertas}</td>
                <td className="px-3 py-2 text-right">{brl(d.pipelinePonderado)}</td>
                <td className="px-3 py-2 text-right">{d.cicloMedio}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold mb-4">Evolução de receita (6 meses)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              {data.map((d, i) => <Line key={d.vendedor.id} type="monotone" dataKey={d.vendedor.nome} stroke={colors[i % colors.length]} strokeWidth={2} />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
