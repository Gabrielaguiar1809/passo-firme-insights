import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useData } from "@/lib/passofirme/store";
import { CATEGORIAS_OP, type CategoriaOP } from "@/lib/passofirme/data";
import { StockCard } from "@/components/passofirme/StockCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Boxes } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/estoque-operacional")({
  head: () => ({ meta: [{ title: "Estoque Operacional — PassoFirme" }] }),
  component: EstoqueOpPage,
});

function EstoqueOpPage() {
  const { itensOperacional, addRequisicao, requisicoes } = useData();
  const [cat, setCat] = useState<CategoriaOP | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, { total: number; ruptura: number }> = {};
    CATEGORIAS_OP.forEach((c) => (map[c.nome] = { total: 0, ruptura: 0 }));
    itensOperacional.forEach((m) => {
      if (!map[m.categoria]) map[m.categoria] = { total: 0, ruptura: 0 };
      map[m.categoria].total += 1;
      if (m.estoqueAtual < m.estoqueMinimo) map[m.categoria].ruptura += 1;
    });
    return map;
  }, [itensOperacional]);

  const itens = cat ? itensOperacional.filter((m) => m.categoria === cat) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Boxes className="h-6 w-6 text-primary" /> Estoque Operacional
        </h1>
        <p className="text-sm text-muted-foreground">Itens de uso interno: limpeza, escritório, EPI, manutenção, copa e tecnologia.</p>
      </div>

      {!cat ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIAS_OP.map((c) => {
            const info = counts[c.nome] ?? { total: 0, ruptura: 0 };
            return (
              <button
                key={c.nome}
                onClick={() => setCat(c.nome)}
                className="rounded-xl border bg-card p-5 text-left hover:border-primary hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  {info.ruptura > 0 && (
                    <span className="inline-flex rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-[10px] font-medium">
                      {info.ruptura} em ruptura
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-semibold">{c.nome}</h3>
                <p className="text-xs text-muted-foreground mt-1">{info.total} itens cadastrados</p>
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
            <h2 className="text-lg font-semibold">{cat} — {itens.length} itens</h2>
            <span className="text-xs text-muted-foreground">{itens.filter((i) => i.estoqueAtual < i.estoqueMinimo).length} em ruptura</span>
          </div>
          {itens.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">Nenhum item nessa categoria.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {itens.map((i) => (
                <StockCard
                  key={i.id}
                  item={i}
                  onSolicitar={(it) => {
                    addRequisicao({
                      numero: `REQ-${String(3000 + requisicoes.length).padStart(5, "0")}`,
                      setor: "Administrativo",
                      itemTipo: "OP",
                      itemId: it.id,
                      item: it.nome,
                      quantidade: Math.max(2, Math.ceil(i.consumoMedioDiario * 10)),
                      data: new Date().toISOString().slice(0, 10),
                      prioridade: i.estoqueAtual < i.estoqueMinimo ? "Alta" : "Média",
                      status: "Aberta",
                      observacao: "Reposição operacional",
                    });
                    toast.success(`Requisição criada para ${it.nome}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
