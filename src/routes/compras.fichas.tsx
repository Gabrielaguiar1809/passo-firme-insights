import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/lib/passofirme/store";
import { FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/compras/fichas")({
  head: () => ({ meta: [{ title: "Fichas de Especificação — PassoFirme" }] }),
  component: FichasPage,
});

function FichasPage() {
  const { materias } = useData();
  const [sel, setSel] = useState<string | null>(null);
  const item = sel ? materias.find((m) => m.id === sel) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> Fichas de Especificação
        </h1>
        <p className="text-sm text-muted-foreground">Padrões técnicos vinculados a cada MP. Usados como referência em cotações, recebimento e inspeção.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border bg-card overflow-hidden max-h-[600px] overflow-y-auto">
          {materias.map((m) => (
            <button key={m.id} onClick={() => setSel(m.id)} className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-muted/40 ${sel === m.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
              <p className="text-[10px] uppercase text-muted-foreground">{m.sku}</p>
              <p className="text-sm font-medium">{m.nome}</p>
              <p className="text-xs text-muted-foreground">{m.categoria}</p>
            </button>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-5">
          {!item ? (
            <p className="text-sm text-muted-foreground text-center py-20">Selecione uma matéria-prima para ver a ficha técnica.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">{item.sku}</p>
                  <h2 className="text-lg font-semibold">{item.nome}</h2>
                  <p className="text-xs text-muted-foreground">{item.categoria}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Aprovada</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Espessura", "1.8 ± 0.1 mm"],
                  ["Resistência à tração", "≥ 18 N/mm²"],
                  ["Cor padrão", "Pantone 4625 C"],
                  ["Densidade", "0.95 g/cm³"],
                  ["Unidade de compra", "m² / par"],
                  ["Lote mínimo", "200 un"],
                  ["Embalagem", "Caixa 50 un"],
                  ["Validade", "12 meses"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-muted/40 px-3 py-2">
                    <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                    <p className="text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Critérios de Inspeção no Recebimento</h3>
                <ul className="space-y-1.5 text-sm">
                  {["Conferência visual (cor, integridade, etiquetagem)", "Amostragem por NQA 2.5", "Teste destrutivo em 1% do lote", "Validação da nota fiscal × pedido"].map((c) => (
                    <li key={c} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /><span>{c}</span></li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">Imprimir ficha</Button>
                <Button size="sm" variant="outline">Histórico de revisões</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
