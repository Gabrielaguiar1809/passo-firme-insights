import { createFileRoute } from "@tanstack/react-router";
import { useIndicadoresEstoque } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Boxes, CheckCircle2, Clock, PackageX } from "lucide-react";

export const Route = createFileRoute("/estoque/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores de Estoque — PassoFirme" }] }),
  component: IndEstoquePage,
});

function IndEstoquePage() {
  const ind = useIndicadoresEstoque();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores de Estoque</h1>
        <p className="text-sm text-muted-foreground">Cobertura, valor parado e itens em ruptura.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Itens OK" value={ind.ok} icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
        <KpiCard label="Itens em Ruptura" value={ind.ruptura} icon={<PackageX className="h-5 w-5" />} tone="danger" />
        <KpiCard label="Cobertura Média" value={`${ind.coberturaMedia}d`} icon={<Clock className="h-5 w-5" />} tone="info" />
        <KpiCard label="Valor em Estoque" value={brl(ind.valorEstoque)} icon={<Boxes className="h-5 w-5" />} tone="default" />
      </div>
    </div>
  );
}
