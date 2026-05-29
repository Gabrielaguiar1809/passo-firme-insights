import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { brl } from "@/components/passofirme/ui-bits";
import { useData } from "@/lib/passofirme/store";
import { calcIQF, type Cotacao } from "@/lib/passofirme/data";
import { useMemo } from "react";
import { Award, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cotacoes")({
  head: () => ({ meta: [{ title: "Cotações — PassoFirme" }] }),
  component: CotacoesPage,
});

function CotacoesPage() {
  const { cotacoes, fornecedores, addCotacao } = useData();
  const fMap = useMemo(() => Object.fromEntries(fornecedores.map((f) => [f.id, f])), [fornecedores]);

  // melhores
  const { melhorPreco, melhorPrazo, melhorCB } = useMemo(() => {
    if (!cotacoes.length) return { melhorPreco: null, melhorPrazo: null, melhorCB: null };
    const mp = [...cotacoes].sort((a, b) => a.precoUnitario - b.precoUnitario)[0];
    const mz = [...cotacoes].sort((a, b) => a.prazo - b.prazo)[0];
    // Custo-Benefício: preço 50%, prazo 30%, IQF 20% (normalizados)
    const maxP = Math.max(...cotacoes.map((c) => c.precoUnitario));
    const maxL = Math.max(...cotacoes.map((c) => c.prazo));
    const scored = cotacoes.map((c) => {
      const iqf = fMap[c.fornecedorId] ? calcIQF(fMap[c.fornecedorId]) : 7;
      const sPreco = (1 - c.precoUnitario / maxP) * 50;
      const sPrazo = (1 - c.prazo / maxL) * 30;
      const sIqf = (iqf / 10) * 20;
      return { c, score: sPreco + sPrazo + sIqf };
    }).sort((a, b) => b.score - a.score);
    return { melhorPreco: mp, melhorPrazo: mz, melhorCB: scored[0].c };
  }, [cotacoes, fMap]);

  const cols: Column<Cotacao>[] = [
    { key: "numero", label: "Número" },
    { key: "item", label: "Item" },
    { key: "quantidade", label: "Qtd", render: (r) => r.quantidade.toLocaleString("pt-BR") },
    { key: "fornecedor", label: "Fornecedor", accessor: (r) => fMap[r.fornecedorId]?.nome ?? "", render: (r) => fMap[r.fornecedorId]?.nome ?? "—" },
    { key: "precoUnitario", label: "Preço Unit.", accessor: (r) => r.precoUnitario, render: (r) => brl(r.precoUnitario) },
    { key: "frete", label: "Frete", accessor: (r) => r.frete, render: (r) => brl(r.frete) },
    { key: "prazo", label: "Prazo", render: (r) => `${r.prazo} dias` },
    { key: "condicao", label: "Condição" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <BestCard icon={<DollarSign className="h-4 w-4" />} label="Melhor Preço" cot={melhorPreco} fMap={fMap} />
        <BestCard icon={<Clock className="h-4 w-4" />} label="Melhor Prazo" cot={melhorPrazo} fMap={fMap} />
        <BestCard icon={<Award className="h-4 w-4" />} label="Melhor Custo-Benefício" cot={melhorCB} fMap={fMap} />
      </div>

      <DataTable
        title="Cotações"
        columns={cols}
        rows={cotacoes}
        onNew={() => {
          addCotacao({
            numero: `COT-${String(1300 + cotacoes.length).padStart(5, "0")}`,
            item: "Couro Preto Premium",
            quantidade: 200,
            fornecedorId: fornecedores[0]?.id ?? "",
            precoUnitario: 45,
            frete: 200,
            prazo: 7,
            condicao: "30 dias",
          });
          toast.success("Nova cotação adicionada");
        }}
      />
    </div>
  );
}

function BestCard({ icon, label, cot, fMap }: { icon: React.ReactNode; label: string; cot: Cotacao | null; fMap: Record<string, { nome: string }> }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">{icon}</span>
        {label}
      </div>
      {cot ? (
        <div className="mt-3">
          <div className="text-lg font-semibold">{fMap[cot.fornecedorId]?.nome}</div>
          <div className="text-sm text-muted-foreground">{cot.item}</div>
          <div className="mt-2 flex gap-4 text-sm">
            <span><strong>{brl(cot.precoUnitario)}</strong>/un</span>
            <span>{cot.prazo} dias</span>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Sem cotações.</p>
      )}
    </div>
  );
}
