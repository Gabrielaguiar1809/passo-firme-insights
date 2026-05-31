import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { History, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/inteligencia/historico")({
  head: () => ({ meta: [{ title: "Histórico de Melhorias — PassoFirme" }] }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const { historicoMelhorias } = useData();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Histórico de Melhorias</h1>
        <p className="text-sm text-muted-foreground">Iniciativas concluídas com ganhos mensuráveis.</p>
      </div>
      <ol className="relative border-s border-border ml-4 space-y-5">
        {historicoMelhorias.map((h) => (
          <li key={h.id} className="ms-6">
            <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success ring-4 ring-background">
              <History className="h-3 w-3" />
            </span>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs text-muted-foreground">{h.data}</p>
              <h3 className="text-sm font-semibold">{h.titulo}</h3>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-success"><TrendingUp className="h-3.5 w-3.5" /> {h.ganho}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
