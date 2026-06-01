import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useData } from "@/lib/passofirme/store";

export const Route = createFileRoute("/producao/consumo")({
  head: () => ({ meta: [{ title: "Consumo de Matéria-Prima — PassoFirme" }] }),
  component: ConsumoPage,
});

function ConsumoPage() {
  const { planejamentos, materias, movimentacoes, ordensProducao } = useData();

  const linhas = useMemo(() => {
    // Estimativa por OPs em produção: consumo estimado = necessidade × % avanço
    // Necessidade é distribuída via BOM do planejamento do mesmo produto.
    const estimadoPorMP: Record<string, number> = {};
    ordensProducao
      .filter((o) => o.status === "Em Produção" && o.quantidadePlanejada > 0)
      .forEach((o) => {
        const pl = planejamentos.find((p) => p.produto === o.produto);
        if (!pl) return;
        const avanco = Math.min(1, o.quantidadeProduzida / o.quantidadePlanejada);
        pl.bom.forEach((b) => {
          const necessidade = o.quantidadePlanejada * b.consumoPorUnidade;
          estimadoPorMP[b.materiaId] = (estimadoPorMP[b.materiaId] ?? 0) + necessidade * avanco;
        });
      });

    return materias.map((m) => {
      const planejado = planejamentos.reduce((a, pl) => {
        const b = pl.bom.find((x) => x.materiaId === m.id);
        return b ? a + pl.quantidadePlanejada * b.consumoPorUnidade : a;
      }, 0);
      const consumido = movimentacoes
        .filter((mv) => mv.itemTipo === "MP" && mv.itemId === m.id && mv.tipo === "Saída")
        .reduce((a, mv) => a + mv.quantidade, 0);
      const estimado = Math.round(estimadoPorMP[m.id] ?? 0);
      const total = consumido + estimado;
      const diff = total - planejado;
      return { id: m.id, nome: m.nome, planejado, consumido, estimado, total, diff };
    }).filter((l) => l.planejado > 0 || l.total > 0);
  }, [planejamentos, materias, movimentacoes, ordensProducao]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Consumo de Matéria-Prima</h1>
        <p className="text-sm text-muted-foreground">
          Planejado × Consumido (real + estimado das OPs em produção, calculado pela fórmula <em>necessidade × % de avanço</em>).
        </p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Matéria-Prima</th>
              <th className="px-4 py-3 text-right">Planejado</th>
              <th className="px-4 py-3 text-right">Real</th>
              <th className="px-4 py-3 text-right">Estimado (OPs)</th>
              <th className="px-4 py-3 text-right">Total Consumido</th>
              <th className="px-4 py-3 text-right">Diferença</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.nome}</td>
                <td className="px-4 py-3 text-right tabular-nums">{l.planejado.toFixed(0)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{l.consumido}</td>
                <td className="px-4 py-3 text-right tabular-nums text-info">{l.estimado > 0 ? `~${l.estimado}` : "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{l.total.toFixed(0)}</td>
                <td className={`px-4 py-3 text-right tabular-nums font-medium ${l.diff > 0 ? "text-destructive" : l.diff < 0 ? "text-success" : ""}`}>{l.diff > 0 ? "+" : ""}{l.diff.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
