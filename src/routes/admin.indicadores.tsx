import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { KpiCard, brl } from "@/components/passofirme/ui-bits";
import { Boxes, ClipboardList, ShieldCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/indicadores")({
  head: () => ({ meta: [{ title: "Indicadores Administrativos — PassoFirme" }] }),
  component: IndAdminPage,
});

function IndAdminPage() {
  const { itensOperacional, requisicoes } = useData();
  const valorOP = itensOperacional.reduce((a, i) => a + i.estoqueAtual * i.custoUnitario, 0);
  const ruptura = itensOperacional.filter((i) => i.estoqueAtual < i.estoqueMinimo).length;
  const reqOP = requisicoes.filter((r) => r.itemTipo === "OP").length;
  const epis = itensOperacional.filter((i) => i.categoria === "EPI").reduce((a, i) => a + i.estoqueAtual, 0);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Indicadores Administrativos</h1>
        <p className="text-sm text-muted-foreground">Acompanhamento de consumo, EPIs e requisições internas.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Valor em Estoque OP" value={brl(valorOP)} icon={<Boxes className="h-5 w-5" />} tone="default" />
        <KpiCard label="Itens em Ruptura" value={ruptura} icon={<FileText className="h-5 w-5" />} tone={ruptura > 0 ? "danger" : "success"} />
        <KpiCard label="Requisições OP" value={reqOP} icon={<ClipboardList className="h-5 w-5" />} tone="info" />
        <KpiCard label="EPIs Disponíveis" value={epis} icon={<ShieldCheck className="h-5 w-5" />} tone="success" />
      </div>
    </div>
  );
}
