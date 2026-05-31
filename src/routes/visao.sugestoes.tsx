import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/visao/sugestoes")({
  head: () => ({ meta: [{ title: "Sugestões de Melhoria — PassoFirme" }] }),
  component: SugestoesPage,
});

function SugestoesPage() {
  const { sugestoes } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sugestões de Melhoria</h1>
        <p className="text-sm text-muted-foreground">Recomendações geradas a partir do comportamento dos dados.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sugestoes.map((s) => (
          <div key={s.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15 text-info"><Lightbulb className="h-4 w-4" /></div>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.categoria}</span>
            </div>
            <h3 className="text-sm font-semibold mb-1">{s.titulo}</h3>
            <p className="text-xs text-muted-foreground">{s.descricao}</p>
            {s.potencialEconomia && (
              <p className="mt-3 text-sm font-semibold text-success">Economia potencial: {brl(s.potencialEconomia)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
