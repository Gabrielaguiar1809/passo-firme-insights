import { useData } from "@/lib/passofirme/store";
import { StockCard } from "@/components/passofirme/StockCard";
import type { CategoriaOP } from "@/lib/passofirme/data";

export function ControleOP({ titulo, descricao, categoria }: { titulo: string; descricao: string; categoria: CategoriaOP }) {
  const { itensOperacional } = useData();
  const itens = itensOperacional.filter((i) => i.categoria === categoria);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {itens.map((i) => <StockCard key={i.id} item={i} />)}
      </div>
    </div>
  );
}
