import { createFileRoute } from "@tanstack/react-router";
import { useIndicadoresProducao } from "@/lib/passofirme/store";
import { KpiCard } from "@/components/passofirme/ui-bits";
import { AlertTriangle, Clock, Factory, Gauge, Target } from "lucide-react";

export const Route = createFileRoute("/producao/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores Operacionais — PassoFirme" }] }),
  component: IndProducaoPage,
});

function IndProducaoPage() {
  const ind = useIndicadoresProducao();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores Operacionais</h1>
        <p className="text-sm text-muted-foreground">Performance da produção alimentando a Visão Geral automaticamente.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Atingimento da Meta" value={`${ind.atingimento}%`} hint={`${ind.realizado}/${ind.planejado} pares`} icon={<Target className="h-5 w-5" />} tone={ind.atingimento >= 85 ? "success" : "warning"} />
        <KpiCard label="Produtividade" value={`${ind.produtividade}`} hint="pares por operador" icon={<Gauge className="h-5 w-5" />} tone="info" />
        <KpiCard label="Retrabalho" value={`${ind.retrabalho}%`} icon={<AlertTriangle className="h-5 w-5" />} tone={ind.retrabalho > 5 ? "danger" : "warning"} />
        <KpiCard label="Lead Time Médio" value={`${ind.leadTime} dias`} icon={<Clock className="h-5 w-5" />} tone="default" />
      </div>
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-2"><Factory className="h-4 w-4 text-primary" /><h3 className="text-base font-semibold">Resumo</h3></div>
        <p className="text-sm text-muted-foreground">A produção totalizou {ind.realizado} pares no período, frente a uma meta de {ind.planejado} pares. O retrabalho de {ind.retrabalho}% mantém-se sob observação.</p>
      </div>
    </div>
  );
}
