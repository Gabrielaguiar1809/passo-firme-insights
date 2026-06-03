import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useData, useDisponibilidade } from "@/lib/passofirme/store";
import { PRODUTOS_OFICIAIS, NUMERACOES, CORES_OFICIAIS, type ProdutoOficial } from "@/lib/passofirme/data";
import { brl } from "@/components/passofirme/ui-bits";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vendas/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos de Venda — PassoFirme" }] }),
  component: PedidosVendaPage,
});

const statusCls: Record<string, string> = {
  "Negociação": "bg-info/15 text-info",
  "Validado": "bg-primary/10 text-primary",
  "Reservado": "bg-warning/25 text-warning-foreground",
  "Produção": "bg-primary/10 text-primary",
  "Pronto para envio": "bg-info/15 text-info",
  "Finalizado": "bg-success/15 text-success",
};

const HOJE = new Date("2026-05-31");
function slaEntrega(prev: string): { cor: string; label: string } {
  const dias = Math.floor((new Date(prev).getTime() - HOJE.getTime()) / 86400000);
  if (dias < 3) return { cor: "bg-destructive", label: `${dias}d` };
  if (dias <= 7) return { cor: "bg-warning", label: `${dias}d` };
  return { cor: "bg-success", label: `${dias}d` };
}

function PedidosVendaPage() {
  const { pedidosVenda, vendedores, addPedidoVenda, addOrdemProducao, ordensProducao } = useData();
  const disponibilidade = useDisponibilidade();

  const [canal, setCanal] = useState("todos");
  const [vend, setVend] = useState("todos");
  const [produto, setProduto] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [open, setOpen] = useState(false);

  // Formulário do novo pedido
  const [fCliente, setFCliente] = useState("");
  const [fCanal, setFCanal] = useState<"B2B" | "B2C">("B2B");
  const [fVend, setFVend] = useState(vendedores[0]?.id ?? "");
  const [fProduto, setFProduto] = useState<ProdutoOficial>("Tênis Esportivo");
  const [fCor, setFCor] = useState<string>(CORES_OFICIAIS["Tênis Esportivo"][0]);
  const [fPreco, setFPreco] = useState<number>(220);
  const [grade, setGrade] = useState<Record<string, number>>(
    Object.fromEntries(NUMERACOES.map((n) => [n, 0]))
  );

  const filtered = useMemo(() => pedidosVenda.filter((p) => {
    if (canal !== "todos" && p.canal !== canal) return false;
    if (vend !== "todos" && p.vendedorId !== vend) return false;
    if (produto !== "todos" && p.produtoComercial !== produto) return false;
    if (status !== "todos" && p.status !== status) return false;
    return true;
  }), [pedidosVenda, canal, vend, produto, status]);

  // Linhas da grade com cálculo de Situação
  const linhas = NUMERACOES.map((num) => {
    const sku = disponibilidade.find(
      (d) => d.produto === fProduto && d.cor === fCor && d.numeracao === num
    );
    const disponivel = sku?.disponivel ?? 0;
    const solicitada = grade[num] ?? 0;
    let situacao: "verde" | "amarelo" | "vermelho" | "vazio" = "vazio";
    if (solicitada > 0) {
      if (disponivel < solicitada) situacao = "vermelho";
      else if ((disponivel - solicitada) / Math.max(1, solicitada) < 0.2) situacao = "amarelo";
      else situacao = "verde";
    }
    return { num, sku, disponivel, solicitada, situacao };
  });

  const totalPares = linhas.reduce((a, l) => a + l.solicitada, 0);
  const totalValor = totalPares * fPreco;
  const vermelhos = linhas.filter((l) => l.situacao === "vermelho");
  const podeConfirmar = totalPares > 0 && fCliente.trim().length > 0;

  function resetForm() {
    setFCliente(""); setFCanal("B2B"); setFVend(vendedores[0]?.id ?? "");
    setFProduto("Tênis Esportivo"); setFCor(CORES_OFICIAIS["Tênis Esportivo"][0]);
    setFPreco(220);
    setGrade(Object.fromEntries(NUMERACOES.map((n) => [n, 0])));
  }

  function confirmar() {
    if (!podeConfirmar) return;
    const baseNumero = `PV-${String(5300 + pedidosVenda.length + 1).padStart(5, "0")}`;
    const hoje = new Date().toISOString().slice(0, 10);
    const entrega = new Date(HOJE);
    entrega.setUTCDate(entrega.getUTCDate() + 15);
    const previsao = entrega.toISOString().slice(0, 10);
    const produtoComercial = fProduto === "Tênis Esportivo" ? "Esportivo" : "Casual";
    let countOk = 0, countOp = 0;

    linhas.forEach((l, idx) => {
      if (l.solicitada <= 0) return;
      const skuId = l.sku?.id ?? `pa-${fProduto.split(" ")[1][0]}-${fCor.slice(0, 2).toUpperCase()}-${l.num}`;
      const skuLabel = `${fProduto} ${fCor} ${l.num}`;
      const temEstoque = l.situacao !== "vermelho";
      addPedidoVenda({
        numero: `${baseNumero}-${l.num}`,
        cliente: fCliente,
        canal: fCanal,
        produtoId: skuId,
        produto: skuLabel,
        quantidade: l.solicitada,
        valor: l.solicitada * fPreco,
        emissao: hoje,
        previsaoEntrega: previsao,
        status: temEstoque ? "Reservado" : "Produção",
        vendedorId: fVend,
        produtoComercial,
      });
      if (temEstoque) countOk++;
      else {
        const falta = l.solicitada - l.disponivel;
        addOrdemProducao({
          numero: `OP-${String(7400 + ordensProducao.length + idx).padStart(5, "0")}`,
          produto: fProduto,
          quantidadePlanejada: falta,
          quantidadeProduzida: 0,
          dataInicio: hoje,
          dataFim: previsao,
          status: "Planejada",
          retrabalho: 0,
          operadores: 6,
        });
        countOp++;
      }
    });

    toast.success(`Pedido ${baseNumero} criado — ${countOk} SKU(s) reservado(s), ${countOp} enviado(s) para produção.`);
    setOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos de Venda</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} pedidos integrados ao Produto Acabado e à Produção.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Novo pedido</Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-3">
        <Select value={canal} onValueChange={setCanal}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos canais</SelectItem>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="B2C">B2C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vend} onValueChange={setVend}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos vendedores</SelectItem>
            {vendedores.map((v) => <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={produto} onValueChange={setProduto}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos produtos</SelectItem>
            <SelectItem value="Esportivo">Tênis Esportivo</SelectItem>
            <SelectItem value="Casual">Tênis Casual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            {Object.keys(statusCls).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Nº</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Vendedor</th>
              <th className="px-4 py-3 text-left">Canal</th>
              <th className="px-4 py-3 text-left">Produto</th>
              <th className="px-4 py-3 text-right">Qtd</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-left">Entrega</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const sla = slaEntrega(p.previsaoEntrega);
              const vd = vendedores.find((v) => v.id === p.vendedorId);
              return (
                <tr key={p.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.numero}</td>
                  <td className="px-4 py-3 font-medium">{p.cliente}</td>
                  <td className="px-4 py-3 text-muted-foreground">{vd?.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-xs"><span className="rounded-full bg-muted px-2 py-0.5">{p.canal}</span></td>
                  <td className="px-4 py-3">{p.produto}</td>
                  <td className="px-4 py-3 text-right">{p.quantidade}</td>
                  <td className="px-4 py-3 text-right font-medium">{brl(p.valor)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${sla.cor}`} />
                      {p.previsaoEntrega}
                    </span>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCls[p.status]}`}>{p.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Novo pedido de venda — Grade de numeração</DialogTitle></DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Cliente</Label>
              <Input value={fCliente} onChange={(e) => setFCliente(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div className="space-y-1">
              <Label>Canal</Label>
              <Select value={fCanal} onValueChange={(v) => setFCanal(v as "B2B" | "B2C")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2B">B2B</SelectItem>
                  <SelectItem value="B2C" disabled>B2C (Mês 5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Vendedor</Label>
              <Select value={fVend} onValueChange={setFVend}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {vendedores.map((v) => <SelectItem key={v.id} value={v.id}>{v.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Preço unitário (R$)</Label>
              <Input type="number" min={0} value={fPreco} onChange={(e) => setFPreco(Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <Label>Produto</Label>
              <Select value={fProduto} onValueChange={(v) => { setFProduto(v as ProdutoOficial); setFCor(CORES_OFICIAIS[v as ProdutoOficial][0]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUTOS_OFICIAIS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Cor</Label>
              <Select value={fCor} onValueChange={setFCor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CORES_OFICIAIS[fProduto].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Numeração</th>
                  <th className="px-3 py-2 text-right">Solicitada</th>
                  <th className="px-3 py-2 text-right">Disponível</th>
                  <th className="px-3 py-2 text-center">Situação</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.num} className="border-t">
                    <td className="px-3 py-2 font-medium">{l.num}</td>
                    <td className="px-3 py-2 text-right">
                      <Input
                        type="number" min={0} className="h-8 w-24 ml-auto text-right"
                        value={l.solicitada}
                        onChange={(e) => setGrade((g) => ({ ...g, [l.num]: Math.max(0, Number(e.target.value) || 0) }))}
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{l.disponivel}</td>
                    <td className="px-3 py-2 text-center">
                      {l.situacao === "vazio" ? <span className="text-xs text-muted-foreground">—</span> :
                       l.situacao === "verde" ? <span className="inline-flex items-center gap-1 text-xs text-success"><span className="h-2 w-2 rounded-full bg-success" />OK</span> :
                       l.situacao === "amarelo" ? <span className="inline-flex items-center gap-1 text-xs text-warning-foreground"><span className="h-2 w-2 rounded-full bg-warning" />Atenção</span> :
                       <span className="inline-flex items-center gap-1 text-xs text-destructive"><span className="h-2 w-2 rounded-full bg-destructive" />Indisponível</span>}
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-muted/30 font-medium">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right">{totalPares}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground" colSpan={2}>{brl(totalValor)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {vermelhos.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p>
                <strong>Atenção:</strong> as numerações <strong>{vermelhos.map((v) => v.num).join(", ")}</strong> não possuem disponibilidade suficiente.
                Verifique com o PCP antes de confirmar o prazo. O sistema gerará automaticamente Ordens de Produção para essas numerações.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={confirmar} disabled={!podeConfirmar}>Confirmar pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
