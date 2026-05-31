import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";

export const Route = createFileRoute("/producao/consumo")({
  head: () => ({ meta: [{ title: "Consumo de Matéria-Prima — PassoFirme" }] }),
  component: ConsumoPage,
});

function ConsumoPage() {
  const { planejamentos, materias, movimentacoes } = useData();
  // agrega consumo planejado vs consumido por MP
  const linhas = materias.map((m) => {
    const planejado = planejamentos.reduce((a, pl) => {
      const b = pl.bom.find((x) => x.materiaId === m.id);
      return b ? a + pl.quantidadePlanejada * b.consumoPorUnidade : a;
    }, 0);
    const consumido = movimentacoes
      .filter((mv) => mv.itemTipo === "MP" && mv.itemId === m.id && mv.tipo === "Saída")
      .reduce((a, mv) => a + mv.quantidade, 0);
    const diff = consumido - planejado;
    return { id: m.id, nome: m.nome, planejado, consumido, diff };
  }).filter((l) => l.planejado > 0 || l.consumido > 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Consumo de Matéria-Prima</h1>
        <p className="text-sm text-muted-foreground">Planejado × Consumido (baseado em movimentações reais de saída).</p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Matéria-Prima</th><th className="px-4 py-3 text-right">Planejado</th><th className="px-4 py-3 text-right">Consumido</th><th className="px-4 py-3 text-right">Diferença</th></tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.nome}</td>
                <td className="px-4 py-3 text-right tabular-nums">{l.planejado.toFixed(0)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{l.consumido}</td>
                <td className={`px-4 py-3 text-right tabular-nums font-medium ${l.diff > 0 ? "text-destructive" : l.diff < 0 ? "text-success" : ""}`}>{l.diff > 0 ? "+" : ""}{l.diff.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
