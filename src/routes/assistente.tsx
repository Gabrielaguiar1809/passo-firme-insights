import { createFileRoute } from "@tanstack/react-router";
import { useInsights, useIndicadores, useData } from "@/lib/passofirme/store";
import { Sparkles, RefreshCw, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl } from "@/components/passofirme/ui-bits";
import { useState } from "react";
import { toast } from "sonner";
import { calcIQF } from "@/lib/passofirme/data";

export const Route = createFileRoute("/assistente")({
  head: () => ({ meta: [{ title: "Assistente IA — PassoFirme" }] }),
  component: AssistentePage,
});

function AssistentePage() {
  const insights = useInsights();
  const ind = useIndicadores();
  const { fornecedores, materias } = useData();
  const [tick, setTick] = useState(0);

  const ranking = [...fornecedores].sort((a, b) => calcIQF(b) - calcIQF(a));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/15 via-info/10 to-background p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Assistente Inteligente PassoFirme</h1>
              <p className="text-sm text-muted-foreground">Insights gerados automaticamente a partir dos dados da operação.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setTick(tick + 1); toast.success("Insights atualizados"); }}>
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-warning-foreground" />
            <h3 className="font-semibold">Recomendações</h3>
          </div>
          <ul className="space-y-3">
            {insights.map((t, i) => (
              <li key={i} className="rounded-lg border bg-background p-3 text-sm leading-relaxed">
                {t}
              </li>
            ))}
            {insights.length === 0 && <li className="text-sm text-muted-foreground">Sem recomendações no momento.</li>}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="font-semibold">Resumo executivo</h3>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/40 p-3">
                <dt className="text-xs text-muted-foreground">Saving acumulado</dt>
                <dd className="text-lg font-semibold text-success">{brl(ind.saving)}</dd>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <dt className="text-xs text-muted-foreground">Itens críticos</dt>
                <dd className="text-lg font-semibold text-destructive">{ind.itensRuptura}</dd>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <dt className="text-xs text-muted-foreground">OTIF</dt>
                <dd className="text-lg font-semibold">{ind.otif}%</dd>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <dt className="text-xs text-muted-foreground">IQF médio</dt>
                <dd className="text-lg font-semibold">{ind.iqfMedio}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">Top fornecedor recomendado</h3>
            {ranking[0] && (
              <div className="rounded-lg border bg-background p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{ranking[0].nome}</div>
                    <div className="text-xs text-muted-foreground">{ranking[0].categoria} · {ranking[0].cidade}/{ranking[0].estado}</div>
                  </div>
                  <span className="text-2xl font-semibold text-primary">{calcIQF(ranking[0])}</span>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Baseado em qualidade, entrega, preço e atendimento de {fornecedores.length} fornecedores e {materias.length} matérias-primas monitoradas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
