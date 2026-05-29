import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import type { ProdutoAcabado } from "@/lib/passofirme/data";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/produtos")({
  head: () => ({ meta: [{ title: "Produto Acabado — PassoFirme" }] }),
  component: ProdutosPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ProdutosPage() {
  const { produtos, addProduto, updateProduto } = useData();

  const chartData = useMemo(() => {
    const grouped = produtos.reduce<Record<string, number>>((acc, p) => {
      acc[p.produto] = (acc[p.produto] || 0) + p.quantidade;
      return acc;
    }, {});
    return Object.entries(grouped).map(([produto, quantidade]) => ({ produto, quantidade })).sort((a, b) => b.quantidade - a.quantidade);
  }, [produtos]);

  const cols: Column<ProdutoAcabado>[] = [
    { key: "codigo", label: "Código" },
    { key: "produto", label: "Produto" },
    { key: "cor", label: "Cor" },
    { key: "numeracao", label: "Numeração" },
    { key: "quantidade", label: "Quantidade", render: (r) => r.quantidade.toLocaleString("pt-BR") },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold mb-1">Produtos com maior estoque</h3>
        <p className="text-xs text-muted-foreground mb-4">Total agrupado por modelo</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="produto" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable
        title="Produto Acabado"
        columns={cols}
        rows={produtos}
        onNew={() => {
          addProduto({
            codigo: `NV-${String(produtos.length + 1).padStart(3, "0")}`,
            produto: "Tênis Runner",
            cor: "Preto",
            numeracao: "40",
            quantidade: 50,
          });
          toast.success("Produto adicionado");
        }}
        onRowClick={(r) => {
          updateProduto(r.id, { quantidade: r.quantidade + 10 });
          toast.info("+10 unidades adicionadas");
        }}
      />
    </div>
  );
}
