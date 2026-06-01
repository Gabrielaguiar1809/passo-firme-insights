import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useData, useIndicadoresEstoque } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { BarChart3, Boxes, CheckCircle2, Clock, PackageX, RefreshCw, Target } from "lucide-react";

export const Route = createFileRoute("/estoque/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores de Estoque — PassoFirme" }] }),
  component: IndEstoquePage,
});

function IndEstoquePage() {
  const ind = useIndicadoresEstoque();
  const { materias, movimentacoes } = useData();

  const calc = useMemo(() => {
    const hoje = new Date("2026-05-31");
    // Giro = saídas anuais estimadas / estoque médio (em quantidade)
    const saidas = movimentacoes.filter((m) => m.tipo === "Saída" && m.itemTipo === "MP");
    const totalSaidas = saidas.reduce((a, m) => a + m.quantidade, 0);
    const estoqueQt = materias.reduce((a, m) => a + m.estoqueAtual, 0);
    const giro = estoqueQt > 0 ? +((totalSaidas * 12) / estoqueQt).toFixed(2) : 0;
    // Sem movimento >30d
    const semMov30 = materias.filter((m) => (hoje.getTime() - new Date(m.ultimaMovimentacao).getTime()) / 86400000 > 30);
    const valorSemMov = semMov30.reduce((a, m) => a + m.estoqueAtual * m.custoUnitario, 0);
    // Precisão de inventário: 100% - desvios (ajustes / total movimentos)
    const ajustes = movimentacoes.filter((m) => m.tipo === "Ajuste").length;
    const precisao = movimentacoes.length ? +(100 - (ajustes / movimentacoes.length) * 100).toFixed(1) : 100;
    // Distribuição de status
    const dist = { OK: 0, "Ponto de Pedido": 0, Ruptura: 0 };
    materias.forEach((m) => {
      const ponto = m.consumoMedioDiario * m.leadTime + m.estoqueSeguranca;
      if (m.estoqueAtual < m.estoqueMinimo) dist.Ruptura += 1;
      else if (m.estoqueAtual <= ponto) dist["Ponto de Pedido"] += 1;
      else dist.OK += 1;
    });
    const tot = materias.length || 1;
    const dPct = {
      OK: (dist.OK / tot) * 100,
      "Ponto de Pedido": (dist["Ponto de Pedido"] / tot) * 100,
      Ruptura: (dist.Ruptura / tot) * 100,
    };
    return { giro, semMov30, valorSemMov, precisao, dist, dPct };
  }, [materias, movimentacoes]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Indicadores de Estoque
        </h1>
        <p className="text-sm text-muted-foreground">Visão consolidada da saúde do estoque de matéria-prima.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Cobertura Média" value={`${ind.coberturaMedia}d`} icon={<Clock className="h-5 w-5" />} tone="info" />
        <KpiCard label="Giro de Estoque" value={`${calc.giro}x`} hint="rotações/ano (estimado)" icon={<RefreshCw className="h-5 w-5" />} tone="default" />
        <KpiCard label="Itens em Ruptura" value={ind.ruptura} icon={<PackageX className="h-5 w-5" />} tone="danger" />
        <KpiCard label="Precisão Inventário" value={`${calc.precisao}%`} icon={<Target className="h-5 w-5" />} tone="success" />
        <KpiCard label="Itens OK" value={ind.ok} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <KpiCard label="Valor em Estoque" value={brl(ind.valorEstoque)} icon={<Boxes className="h-5 w-5" />} tone="default" />
        <KpiCard label="Sem movim. >30 dias" value={calc.semMov30.length} hint={brl(calc.valorSemMov)} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <KpiCard label="Total de SKUs" value={ind.ok + ind.ruptura} icon={<Boxes className="h-5 w-5" />} tone="info" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">Distribuição por status</h3>
          <div className="space-y-3">
            {(["OK", "Ponto de Pedido", "Ruptura"] as const).map((k) => {
              const cls = k === "OK" ? "bg-success" : k === "Ponto de Pedido" ? "bg-warning" : "bg-destructive";
              return (
                <div key={k}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{k}</span>
                    <span className="tabular-nums">{calc.dist[k]} itens ({calc.dPct[k].toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${cls}`} style={{ width: `${calc.dPct[k]}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">Materiais sem movimentação há mais de 30 dias</h3>
          {calc.semMov30.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum material parado.</p>
          ) : (
            <ul className="divide-y">
              {calc.semMov30.slice(0, 6).map((m) => (
                <li key={m.id} className="py-2 flex justify-between text-sm">
                  <span className="truncate">{m.nome}</span>
                  <span className="text-muted-foreground tabular-nums">{brl(m.estoqueAtual * m.custoUnitario)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
