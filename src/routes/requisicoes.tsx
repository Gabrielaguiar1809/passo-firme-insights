import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import { SETORES, type Requisicao, type Setor, type Prioridade, type StatusRequisicao } from "@/lib/passofirme/data";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requisicoes")({
  head: () => ({ meta: [{ title: "Requisições — PassoFirme" }] }),
  component: RequisicoesPage,
});

const statusCfg: Record<StatusRequisicao, string> = {
  Aberta: "bg-info/15 text-info",
  "Em Separação": "bg-warning/25 text-warning-foreground",
  "Pronta para Retirada": "bg-primary/10 text-primary",
  Entregue: "bg-success/15 text-success",
};
const prioridadeCfg: Record<Prioridade, string> = {
  Baixa: "bg-muted text-muted-foreground",
  Média: "bg-info/15 text-info",
  Alta: "bg-warning/25 text-warning-foreground",
  Crítica: "bg-destructive/15 text-destructive",
};

function RequisicoesPage() {
  const { requisicoes, materias, itensOperacional, addRequisicao, avancarStatusRequisicao } = useData();
  const [open, setOpen] = useState(false);

  const kpi = useMemo(() => {
    const c: Record<StatusRequisicao, number> = { Aberta: 0, "Em Separação": 0, "Pronta para Retirada": 0, Entregue: 0 };
    requisicoes.forEach((r) => (c[r.status] += 1));
    return c;
  }, [requisicoes]);

  const cols: Column<Requisicao>[] = [
    { key: "numero", label: "Número" },
    { key: "setor", label: "Setor" },
    { key: "item", label: "Item" },
    { key: "itemTipo", label: "Origem", render: (r) => <span className="text-xs">{r.itemTipo === "MP" ? "MP" : "Operacional"}</span> },
    { key: "quantidade", label: "Qtd", render: (r) => r.quantidade.toLocaleString("pt-BR") },
    { key: "data", label: "Data", render: (r) => new Date(r.data).toLocaleDateString("pt-BR") },
    { key: "prioridade", label: "Prioridade", render: (r) => <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", prioridadeCfg[r.prioridade])}>{r.prioridade}</span> },
    { key: "status", label: "Status", render: (r) => <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusCfg[r.status])}>{r.status}</span> },
    { key: "acao", label: "Ação", render: (r) => r.status !== "Entregue" ? (
      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); avancarStatusRequisicao(r.id); toast.info(`Requisição ${r.numero} avançou`); }}>
        Avançar <ArrowRight className="h-3 w-3" />
      </Button>
    ) : <span className="text-xs text-muted-foreground">Concluída</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" /> Requisições
          </h1>
          <p className="text-sm text-muted-foreground">Fluxo: setor solicita → almoxarifado separa → retirada → entrega (atualiza estoque automaticamente).</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Nova Requisição</Button></DialogTrigger>
          <NovaRequisicao close={() => setOpen(false)} materias={materias} ops={itensOperacional}
            onSubmit={(r) => { addRequisicao(r); toast.success("Requisição criada"); }} total={requisicoes.length} />
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(kpi) as StatusRequisicao[]).map((s) => (
          <div key={s} className="rounded-xl border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">{s}</p>
            <p className="text-2xl font-semibold mt-1">{kpi[s]}</p>
            <span className={cn("inline-flex mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium", statusCfg[s])}>{s}</span>
          </div>
        ))}
      </div>

      <DataTable title="Requisições Internas" columns={cols} rows={requisicoes} />
    </div>
  );
}

function NovaRequisicao({
  close, onSubmit, materias, ops, total,
}: {
  close: () => void;
  onSubmit: (r: Omit<Requisicao, "id">) => void;
  materias: { id: string; nome: string }[];
  ops: { id: string; nome: string }[];
  total: number;
}) {
  const [setor, setSetor] = useState<Setor>("Produção A");
  const [itemTipo, setItemTipo] = useState<"MP" | "OP">("MP");
  const [itemId, setItemId] = useState(materias[0]?.id ?? "");
  const [quantidade, setQuantidade] = useState(50);
  const [prioridade, setPrioridade] = useState<Prioridade>("Média");
  const [observacao, setObservacao] = useState("");

  const lista = itemTipo === "MP" ? materias : ops;

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle>Nova Requisição</DialogTitle></DialogHeader>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Setor</Label>
            <Select value={setor} onValueChange={(v) => setSetor(v as Setor)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SETORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Prioridade</Label>
            <Select value={prioridade} onValueChange={(v) => setPrioridade(v as Prioridade)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(["Baixa", "Média", "Alta", "Crítica"] as Prioridade[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tipo do Item</Label>
            <Select value={itemTipo} onValueChange={(v) => { setItemTipo(v as "MP" | "OP"); setItemId((v === "MP" ? materias : ops)[0]?.id ?? ""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MP">Matéria-Prima</SelectItem>
                <SelectItem value="OP">Operacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantidade</Label>
            <Input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <Label>Item</Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{lista.map((i) => <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Observação</Label>
          <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: urgente para produção" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={close}>Cancelar</Button>
        <Button onClick={() => {
          const item = lista.find((i) => i.id === itemId);
          if (!item) return;
          onSubmit({
            numero: `REQ-${String(5000 + total).padStart(5, "0")}`,
            setor, itemTipo, itemId, item: item.nome,
            quantidade, data: new Date().toISOString().slice(0, 10),
            prioridade, status: "Aberta",
            observacao: observacao || undefined,
          });
          close();
        }}>Criar Requisição</Button>
      </DialogFooter>
    </DialogContent>
  );
}
