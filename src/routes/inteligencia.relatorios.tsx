import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/inteligencia/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — PassoFirme" }] }),
  component: RelatoriosPage,
});

const relatorios = [
  { titulo: "Saving Mensal por Categoria", desc: "Economia obtida em negociações de compra." },
  { titulo: "Cobertura de Estoque MP", desc: "Cobertura em dias por item de matéria-prima." },
  { titulo: "Ranking de Fornecedores (IQF)", desc: "Avaliação consolidada por critérios ponderados." },
  { titulo: "OTIF por Fornecedor", desc: "Desempenho de entregas no prazo e completas." },
  { titulo: "Consumo Planejado x Real", desc: "Análise de desvio de consumo de MP." },
  { titulo: "Funil Comercial B2B/B2C", desc: "Distribuição de leads por estágio do funil." },
];

function RelatoriosPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Modelos prontos para exportação e envio.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((r) => (
          <div key={r.titulo} className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold">{r.titulo}</h3>
            </div>
            <p className="text-xs text-muted-foreground flex-1 mb-3">{r.desc}</p>
            <Button size="sm" variant="outline" onClick={() => toast.success(`Gerando "${r.titulo}"`, { description: "Relatório em PDF disponibilizado." })}>
              <Download className="h-3.5 w-3.5" /> Gerar PDF
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
