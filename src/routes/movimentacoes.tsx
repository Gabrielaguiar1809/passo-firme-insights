import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import type { Movimentacao, TipoMovimentacao } from "@/lib/passofirme/data";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowDownToLine, ArrowUpFromLine, Undo2, Settings2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/movimentacoes")({
  head: () => ({ meta: [{ title: "Movimentações — PassoFirme" }] }),
  component: MovimentacoesPage,
});

const tipoCfg: Record<TipoMovimentacao, { cls: string; icon: typeof Plus }> = {
  Entrada: { cls: "bg-success/15 text-success", icon: ArrowDownToLine },
  Saída: { cls: "bg-destructive/15 text-destructive", icon: ArrowUpFromLine },
  Devolução: { cls: "bg-info/15 text-info", icon: Undo2 },
  Ajuste: { cls: "bg-warning/25 text-warning-foreground", icon: Settings2 },
};

function MovimentacoesPage() {
  const { movimentacoes, materias, itensOperacional, registrarMovimentacao } = useData();
  const [open, setOpen] = useState(false);

  const totais = useMemo(() => {
    const t: Record<TipoMovimentacao, number> = { Entrada: 0, Saída: 0, Devolução: 0, Ajuste: 0 };
    movimentacoes.forEach((m) => (t[m.tipo] += 1));
    return t;
  }, [movimentacoes]);

  const cols: Column<Movimentacao>[] = [
    { key: "data", label: "Data", render: (r) => new Date(r.data).toLocaleDateString("pt-BR") },
    { key: "tipo", label: "Tipo", render: (r) => {
      const c = tipoCfg[r.tipo];
      const Icon = c.icon;
      return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.cls}`}><Icon className="h-3 w-3" />{r.tipo}</span>;
    }},
    { key: "itemTipo", label: "Origem", render: (r) => <span className="text-xs font-medium">{r.itemTipo === "MP" ? "Matéria-Prima" : "Operacional"}</span> },
    { key: "itemNome", label: "Item" },
    { key: "quantidade", label: "Quantidade", render: (r) => r.quantidade.toLocaleString("pt-BR") },
    { key: "origem", label: "Documento" },
    { key: "responsavel", label: "Responsável" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(totais) as TipoMovimentacao[]).map((t) => {
          const c = tipoCfg[t];
          const Icon = c.icon;
          return (
            <div key={t} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg grid place-items-center ${c.cls}`}><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">{t}</p>
                  <p className="text-2xl font-semibold">{totais[t]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Nova Movimentação</Button>
          </DialogTrigger>
          <NovaMovimentacao
            close={() => setOpen(false)}
            onSubmit={(m) => { registrarMovimentacao(m); toast.success(`${m.tipo} registrada e estoque atualizado`); }}
            materias={materias}
            ops={itensOperacional}
          />
        </Dialog>
      </div>

      <DataTable title="Histórico de Movimentações" columns={cols} rows={movimentacoes} />
    </div>
  );
}

function NovaMovimentacao({
  close, onSubmit, materias, ops,
}: {
  close: () => void;
  onSubmit: (m: Omit<Movimentacao, "id">) => void;
  materias: { id: string; nome: string }[];
  ops: { id: string; nome: string }[];
}) {
  const [tipo, setTipo] = useState<TipoMovimentacao>("Entrada");
  const [itemTipo, setItemTipo] = useState<"MP" | "OP">("MP");
  const [itemId, setItemId] = useState<string>(materias[0]?.id ?? "");
  const [quantidade, setQuantidade] = useState(10);
  const [origem, setOrigem] = useState("Ajuste manual");
  const [observacao, setObservacao] = useState("");

  const lista = itemTipo === "MP" ? materias : ops;

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>Nova Movimentação</DialogTitle></DialogHeader>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoMovimentacao)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Entrada", "Saída", "Devolução", "Ajuste"] as TipoMovimentacao[]).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Categoria do Estoque</Label>
            <Select value={itemTipo} onValueChange={(v) => { setItemTipo(v as "MP" | "OP"); setItemId((v === "MP" ? materias : ops)[0]?.id ?? ""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MP">Matéria-Prima</SelectItem>
                <SelectItem value="OP">Operacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Item</Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {lista.map((i) => <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Quantidade {tipo === "Ajuste" ? "(use negativo para reduzir)" : ""}</Label>
            <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
          </div>
          <div>
            <Label>Documento / Origem</Label>
            <Input value={origem} onChange={(e) => setOrigem(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Observação</Label>
          <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={close}>Cancelar</Button>
        <Button onClick={() => {
          const item = lista.find((i) => i.id === itemId);
          if (!item) return;
          onSubmit({
            data: new Date().toISOString().slice(0, 10),
            itemTipo, itemId, itemNome: item.nome,
            tipo, quantidade,
            origem,
            responsavel: "Almoxarifado",
            observacao: observacao || undefined,
          });
          close();
        }}>Registrar</Button>
      </DialogFooter>
    </DialogContent>
  );
}
