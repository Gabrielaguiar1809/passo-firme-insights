import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import { calcIQF, type Fornecedor } from "@/lib/passofirme/data";
import { Trophy, StickyNote, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/fornecedores")({
  head: () => ({ meta: [{ title: "Fornecedores — PassoFirme" }] }),
  component: FornecedoresPage,
});

function FornecedoresPage() {
  const { fornecedores, addFornecedor, updateFornecedor } = useData();
  const [editing, setEditing] = useState<Fornecedor | null>(null);
  const [obs, setObs] = useState("");

  const ranking = useMemo(() => [...fornecedores].sort((a, b) => calcIQF(b) - calcIQF(a)), [fornecedores]);

  const cols: Column<Fornecedor>[] = [
    { key: "nome", label: "Fornecedor" },
    { key: "categoria", label: "Categoria" },
    { key: "cidade", label: "Cidade", render: (r) => `${r.cidade}/${r.estado}` },
    { key: "qualidade", label: "Qualidade" },
    { key: "entrega", label: "Entrega" },
    { key: "preco", label: "Preço" },
    { key: "atendimento", label: "Atend." },
    { key: "iqf", label: "IQF", accessor: (r) => calcIQF(r), render: (r) => <span className="font-semibold text-primary">{calcIQF(r)}</span> },
    { key: "otif", label: "OTIF", render: (r) => `${r.otif}%` },
    { key: "leadTime", label: "Lead Time", render: (r) => `${r.leadTime}d` },
    { key: "obs", label: "Obs. Internas", render: (r) => (
      <button onClick={(e) => { e.stopPropagation(); setEditing(r); setObs(r.observacoes ?? ""); }}
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
        <StickyNote className="h-3 w-3" /> {r.observacoes ? "Editar" : "Adicionar"}
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-warning-foreground" />
          <h3 className="text-base font-semibold">Ranking de Fornecedores (por IQF)</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ranking.map((f, i) => (
            <div key={f.id} className="rounded-lg border bg-background px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{f.nome}</div>
                    <div className="text-xs text-muted-foreground">{f.categoria}</div>
                  </div>
                </div>
                <span className="text-base font-semibold text-primary">{calcIQF(f)}</span>
              </div>
              {f.observacoes && (
                <p className="mt-2 text-[11px] text-muted-foreground italic line-clamp-2" title={f.observacoes}>“{f.observacoes}”</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <DataTable
        title="Fornecedores"
        columns={cols}
        rows={fornecedores}
        onNew={() => {
          addFornecedor({
            nome: "Novo Fornecedor", categoria: "Couro", cidade: "São Paulo", estado: "SP",
            qualidade: 8, entrega: 8, preco: 8, atendimento: 8, leadTime: 7, otif: 85,
            observacoes: "",
          });
          toast.success("Fornecedor adicionado");
        }}
        onRowClick={(r) => { setEditing(r); setObs(r.observacoes ?? ""); }}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Observações Internas — {editing?.nome}</DialogTitle></DialogHeader>
          <Textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Ex: Produto aprovado pela equipe. Houve devolução de material. Problemas recorrentes de qualidade."
            rows={6}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={() => {
              if (editing) {
                updateFornecedor(editing.id, { observacoes: obs });
                toast.success("Observações atualizadas");
              }
              setEditing(null);
            }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
