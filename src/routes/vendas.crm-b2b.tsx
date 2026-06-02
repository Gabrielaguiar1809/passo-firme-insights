import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useData, useFollowUpAlerts, slaOportunidade } from "@/lib/passofirme/store";
import { KanbanBoard } from "@/components/passofirme/Kanban";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { brl } from "@/components/passofirme/ui-bits";
import { toast } from "sonner";
import type { ClienteB2B, EstagioB2B, MotivoPerda } from "@/lib/passofirme/data";
import { AlertTriangle, Phone, Mail, Users as UsersIcon, FileText, Calendar } from "lucide-react";

const stages: EstagioB2B[] = ["Lead", "Primeiro Contato", "Negociação", "Proposta", "Pedido Fechado", "Perdido"];
const stageLabels: Record<string, string> = {
  "Pedido Fechado": "Fechado — Ganho",
  "Perdido": "Fechado — Perdido",
};
const PROB: Record<string, number> = { "Lead": 10, "Primeiro Contato": 25, "Negociação": 50, "Proposta": 75, "Pedido Fechado": 100, "Perdido": 0 };
const MOTIVOS: MotivoPerda[] = ["Preço acima do mercado", "Prazo de entrega incompatível", "Produto não atende a necessidade", "Cliente escolheu concorrente", "Negociação não evoluiu", "Outro"];

export const Route = createFileRoute("/vendas/crm-b2b")({
  head: () => ({ meta: [{ title: "CRM B2B — PassoFirme" }] }),
  component: CrmB2BPage,
});

function CrmB2BPage() {
  const { clientesB2B, vendedores, interacoes, addInteracao, updateClienteB2B } = useData();
  const followUps = useFollowUpAlerts();
  const [vendedor, setVendedor] = useState<string>("todos");
  const [produto, setProduto] = useState<string>("todos");
  const [periodo, setPeriodo] = useState<string>("mes");
  const [selected, setSelected] = useState<ClienteB2B | null>(null);

  const filtered = useMemo(() => clientesB2B.filter((c) => {
    if (vendedor !== "todos" && c.vendedorId !== vendedor) return false;
    if (produto !== "todos" && c.produto !== produto) return false;
    return true;
  }), [clientesB2B, vendedor, produto]);

  const items = filtered.map((c) => {
    const sla = slaOportunidade(c);
    const vd = vendedores.find((v) => v.id === c.vendedorId);
    return {
      id: c.id, title: c.empresa, subtitle: `${vd?.nome ?? "—"} · ${c.cidade}/${c.estado}`,
      valor: c.valor, stage: c.estagio,
      badge: c.produto ? { label: c.produto, tone: (c.produto === "Esportivo" ? "esportivo" : "casual") as const } : undefined,
      sla: sla.cor, diasNaEtapa: sla.dias,
      meta: `Últ. contato: ${c.ultimoContato}`,
      onClick: () => setSelected(c),
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM B2B</h1>
          <p className="text-sm text-muted-foreground">Funil comercial de clientes corporativos com SLA e protocolo de escalamento.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center rounded-xl border bg-card p-3">
        <Select value={vendedor} onValueChange={setVendedor}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Vendedor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Vendedores</SelectItem>
            <SelectItem value="v1">Meu CRM (Ricardo F.)</SelectItem>
            {vendedores.filter((v) => v.id !== "v1").map((v) => <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={produto} onValueChange={setProduto}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Produto" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Produtos</SelectItem>
            <SelectItem value="Esportivo">Produto 1 — Esportivo</SelectItem>
            <SelectItem value="Casual">Produto 2 — Casual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mes">Este mês</SelectItem>
            <SelectItem value="tri">Trimestre atual</SelectItem>
            <SelectItem value="sem">Semestre atual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Funil</TabsTrigger>
          <TabsTrigger value="follow">Follow-up <span className="ml-1.5 text-[10px] rounded-full bg-destructive/15 text-destructive px-1.5">{followUps.length}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <KanbanBoard stages={stages} items={items} stageLabels={stageLabels} />
        </TabsContent>

        <TabsContent value="follow" className="mt-4">
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Cliente</th>
                  <th className="px-4 py-3 text-left">Vendedor</th>
                  <th className="px-4 py-3 text-left">Produto</th>
                  <th className="px-4 py-3 text-left">Último pedido</th>
                  <th className="px-4 py-3 text-right">Ciclo médio</th>
                  <th className="px-4 py-3 text-left">Motivo</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map(({ cliente, motivo, diasDesdeUltimoPed }) => {
                  const vd = vendedores.find((v) => v.id === cliente.vendedorId);
                  return (
                    <tr key={cliente.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{cliente.empresa}</td>
                      <td className="px-4 py-3 text-muted-foreground">{vd?.nome ?? "—"}</td>
                      <td className="px-4 py-3"><span className="text-xs rounded bg-muted px-1.5 py-0.5">{cliente.produto ?? "—"}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{cliente.ultimoPedido ?? "—"} <span className="text-xs">({diasDesdeUltimoPed}d)</span></td>
                      <td className="px-4 py-3 text-right">{cliente.cicloMedio ?? "—"}d</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${motivo === "Risco de Churn" ? "bg-destructive/15 text-destructive" : motivo === "Janela de Compra" ? "bg-warning/25 text-warning-foreground" : "bg-info/15 text-info"}`}><AlertTriangle className="inline h-3 w-3 mr-1" />{motivo}</span></td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(cliente)}>Registrar Contato</Button>
                      </td>
                    </tr>
                  );
                })}
                {followUps.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Nenhum alerta de follow-up ativo.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <OpportunityDetail
              cliente={selected}
              vendedores={vendedores}
              interacoes={interacoes.filter((i) => i.clienteId === selected.id)}
              onAddInteracao={(payload) => addInteracao({ ...payload, clienteId: selected.id })}
              onUpdate={(patch) => { updateClienteB2B(selected.id, patch); setSelected({ ...selected, ...patch }); }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OpportunityDetail({ cliente, vendedores, interacoes, onAddInteracao, onUpdate }: {
  cliente: ClienteB2B;
  vendedores: { id: string; nome: string }[];
  interacoes: { id: string; data: string; tipo: string; descricao: string; vendedorId: string }[];
  onAddInteracao: (p: { data: string; tipo: "Ligação" | "E-mail" | "Visita" | "Proposta Enviada" | "Reunião"; descricao: string; vendedorId: string }) => void;
  onUpdate: (patch: Partial<ClienteB2B>) => void;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLoseDialog, setShowLoseDialog] = useState(false);
  const sla = slaOportunidade(cliente);
  const vd = vendedores.find((v) => v.id === cliente.vendedorId);
  return (
    <>
      <SheetHeader>
        <SheetTitle>{cliente.empresa}</SheetTitle>
        <SheetDescription>{cliente.contato} · {cliente.cidade}/{cliente.estado}</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Dados da oportunidade</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Vendedor" value={vd?.nome ?? "—"} />
            <Info label="Produto" value={cliente.produto ?? "—"} />
            <Info label="Valor estimado" value={brl(cliente.valor)} />
            <Info label="Etapa atual" value={stageLabels[cliente.estagio] ?? cliente.estagio} />
            <Info label="Probabilidade" value={`${PROB[cliente.estagio]}%`} />
            <Info label="SLA" value={`${sla.label} (${sla.dias}d)`} />
            <Info label="Criação" value={cliente.criacao ?? "—"} />
            <Info label="Últ. contato" value={cliente.ultimoContato} />
          </div>
          <div className="flex gap-2 pt-2">
            <Select value={cliente.estagio} onValueChange={(v) => onUpdate({ estagio: v as EstagioB2B, etapaDesde: new Date().toISOString().slice(0, 10) })}>
              <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((s) => <SelectItem key={s} value={s}>{stageLabels[s] ?? s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowLoseDialog(true)}>Marcar perdida</Button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Histórico de interações</h3>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>Registrar ação</Button>
          </div>
          <div className="space-y-2">
            {interacoes.length === 0 && <p className="text-sm text-muted-foreground italic">Sem interações registradas.</p>}
            {interacoes.sort((a, b) => b.data.localeCompare(a.data)).map((i) => (
              <div key={i.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    {i.tipo === "Ligação" && <Phone className="h-3 w-3" />}
                    {i.tipo === "E-mail" && <Mail className="h-3 w-3" />}
                    {i.tipo === "Reunião" && <UsersIcon className="h-3 w-3" />}
                    {i.tipo === "Proposta Enviada" && <FileText className="h-3 w-3" />}
                    {i.tipo === "Visita" && <Calendar className="h-3 w-3" />}
                    {i.tipo}
                  </span>
                  <span>{i.data}</span>
                </div>
                <p className="text-sm mt-1">{i.descricao}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar ação</DialogTitle></DialogHeader>
          <AddInteracaoForm onSubmit={(payload) => { onAddInteracao(payload); setShowAddDialog(false); toast.success("Interação registrada"); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showLoseDialog} onOpenChange={setShowLoseDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Motivo da perda</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {MOTIVOS.map((m) => (
              <Button key={m} variant="outline" className="w-full justify-start" onClick={() => { onUpdate({ estagio: "Perdido", motivoPerda: m }); setShowLoseDialog(false); toast.success("Oportunidade marcada como perdida"); }}>{m}</Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function AddInteracaoForm({ onSubmit }: { onSubmit: (p: { data: string; tipo: "Ligação" | "E-mail" | "Visita" | "Proposta Enviada" | "Reunião"; descricao: string; vendedorId: string }) => void }) {
  const [tipo, setTipo] = useState<"Ligação" | "E-mail" | "Visita" | "Proposta Enviada" | "Reunião">("Ligação");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [descricao, setDescricao] = useState("");
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit({ tipo, data, descricao, vendedorId: "v1" }); }}>
      <div>
        <Label>Tipo</Label>
        <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["Ligação", "E-mail", "Visita", "Proposta Enviada", "Reunião"] as const).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Data</Label>
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </div>
      <div>
        <Label>Descrição</Label>
        <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">Salvar</Button>
    </form>
  );
}
