import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { CATEGORIAS_MP, calcIQF, type CategoriaMP, type Cotacao } from "@/lib/passofirme/data";
import { ICONS_MP } from "@/lib/passofirme/category-icons";
import { Button } from "@/components/ui/button";
import { Award, ChevronLeft, Clock, ClipboardList, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cotacoes")({
  head: () => ({ meta: [{ title: "Cotações — PassoFirme" }] }),
  component: CotacoesPage,
});

function CotacoesPage() {
  const { cotacoes, fornecedores, addCotacao, materias } = useData();
  const [cat, setCat] = useState<CategoriaMP | null>(null);
  const fMap = useMemo(() => Object.fromEntries(fornecedores.map((f) => [f.id, f])), [fornecedores]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIAS_MP.forEach((c) => (map[c.nome] = 0));
    cotacoes.forEach((c) => { map[c.categoria] = (map[c.categoria] ?? 0) + 1; });
    return map;
  }, [cotacoes]);

  // FILTRO: pela categoria do ITEM cotado — nunca pela categoria do fornecedor.
  const lista = cat ? cotacoes.filter((c) => c.categoria === cat) : [];

  const best = useMemo(() => {
    if (!lista.length) return null;
    const mp = [...lista].sort((a, b) => a.precoUnitario - b.precoUnitario)[0];
    const mz = [...lista].sort((a, b) => a.prazo - b.prazo)[0];
    const maxP = Math.max(...lista.map((c) => c.precoUnitario));
    const maxL = Math.max(...lista.map((c) => c.prazo));
    const scored = lista.map((c) => {
      const iqf = fMap[c.fornecedorId] ? calcIQF(fMap[c.fornecedorId]) : 7;
      const sPreco = (1 - c.precoUnitario / maxP) * 50;
      const sPrazo = (1 - c.prazo / maxL) * 30;
      const sIqf = (iqf / 10) * 20;
      return { c, score: sPreco + sPrazo + sIqf };
    }).sort((a, b) => b.score - a.score);
    return { mp, mz, mcb: scored[0].c };
  }, [lista, fMap]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Cotações
        </h1>
        <p className="text-sm text-muted-foreground">Selecione uma categoria para ver as cotações e o comparativo.</p>
      </div>

      {!cat ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIAS_MP.map((c) => {
            const Icon = ICONS_MP[c.nome];
            return (
              <button key={c.nome} onClick={() => setCat(c.nome)} className="rounded-xl border bg-card p-5 text-left hover:border-primary hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">{counts[c.nome] ?? 0} cotações</span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{c.nome}</h3>
                <p className="text-xs text-muted-foreground mt-1">Comparar fornecedores</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCat(null)}>
              <ChevronLeft className="h-4 w-4" /> Categorias
            </Button>
            <h2 className="text-lg font-semibold">{cat} — {lista.length} cotações</h2>
            <Button size="sm" onClick={() => {
              const mp = materias.find((m) => m.categoria === cat) ?? materias[0];
              addCotacao({
                numero: `COT-${String(1400 + cotacoes.length).padStart(5, "0")}`,
                categoria: cat, item: mp?.nome ?? `Item ${cat}`, quantidade: 200,
                fornecedorId: fornecedores.find((f) => f.categoria === cat)?.id ?? fornecedores[0]?.id ?? "",
                precoUnitario: mp?.custoUnitario ?? 45, frete: 200, prazo: 7, condicao: "30 dias",
              });
              toast.success("Nova cotação adicionada");
            }}><Plus className="h-4 w-4" /> Nova Cotação</Button>
          </div>

          {best && (
            <div className="grid gap-4 md:grid-cols-3">
              <BestCard icon={<DollarSign className="h-4 w-4" />} label="Melhor Preço" cot={best.mp} fMap={fMap} />
              <BestCard icon={<Clock className="h-4 w-4" />} label="Melhor Prazo" cot={best.mz} fMap={fMap} />
              <BestCard icon={<Award className="h-4 w-4" />} label="Melhor Custo-Benefício" cot={best.mcb} fMap={fMap} />
            </div>
          )}

          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Número</th>
                    <th className="px-4 py-3 text-left font-medium">Item</th>
                    <th className="px-4 py-3 text-left font-medium">Qtd</th>
                    <th className="px-4 py-3 text-left font-medium">Fornecedor</th>
                    <th className="px-4 py-3 text-left font-medium">Preço Unit.</th>
                    <th className="px-4 py-3 text-left font-medium">Frete</th>
                    <th className="px-4 py-3 text-left font-medium">Prazo</th>
                    <th className="px-4 py-3 text-left font-medium">Condição</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.numero}</td>
                      <td className="px-4 py-3">{c.item}</td>
                      <td className="px-4 py-3">{c.quantidade}</td>
                      <td className="px-4 py-3">{fMap[c.fornecedorId]?.nome ?? "—"}</td>
                      <td className="px-4 py-3">{brl(c.precoUnitario)}</td>
                      <td className="px-4 py-3">{brl(c.frete)}</td>
                      <td className="px-4 py-3">{c.prazo} dias</td>
                      <td className="px-4 py-3">{c.condicao}</td>
                    </tr>
                  ))}
                  {lista.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Nenhuma cotação nesta categoria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
      ) : <p className="mt-3 text-sm text-muted-foreground">Sem cotações.</p>}
    </div>
  );
}
