import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useData } from "@/lib/passofirme/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/planejamento")({
  head: () => ({ meta: [{ title: "Planejamento — PassoFirme" }] }),
  component: PlanejamentoPage,
});

function PlanejamentoPage() {
  const { planejamentos, materias, addPlanejamento, updatePlanejamento } = useData();
  const [open, setOpen] = useState(false);

  const analises = useMemo(() => planejamentos.map((pl) => {
    const restante = Math.max(0, pl.quantidadePlanejada - pl.producaoRealizada);
    const atingimento = pl.quantidadePlanejada > 0 ? (pl.producaoRealizada / pl.quantidadePlanejada) * 100 : 0;
    const necessidades = pl.bom.map((b) => {
      const mp = materias.find((m) => m.id === b.materiaId);
      const necessidade = restante * b.consumoPorUnidade;
      const deficit = mp ? Math.max(0, necessidade - mp.estoqueAtual) : necessidade;
      return { nome: mp?.nome ?? b.materiaId, necessidade, disponivel: mp?.estoqueAtual ?? 0, deficit };
    });
    const totalDeficit = necessidades.filter((n) => n.deficit > 0).length;
    return { pl, atingimento, necessidades, totalDeficit, restante };
  }), [planejamentos, materias]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" /> Planejamento de Produção
          </h1>
          <p className="text-sm text-muted-foreground">Acompanhe metas, atingimento e necessidade de matéria-prima.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Novo Planejamento</Button></DialogTrigger>
          <NovoPlanejamento close={() => setOpen(false)} materias={materias} onSubmit={(p) => { addPlanejamento(p); toast.success("Planejamento criado"); }} />
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {analises.map(({ pl, atingimento, necessidades, totalDeficit, restante }) => (
          <div key={pl.id} className="rounded-xl border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{pl.produto}</h3>
                <p className="text-xs text-muted-foreground">Início {new Date(pl.inicio).toLocaleDateString("pt-BR")} · {pl.periodoMeses} {pl.periodoMeses === 1 ? "mês" : "meses"}</p>
              </div>
              {totalDeficit > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-[11px] font-medium">
                  <AlertTriangle className="h-3 w-3" /> {totalDeficit} déficits
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Meta</p>
                <p className="text-lg font-semibold">{pl.quantidadePlanejada}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Realizado</p>
                <p className="text-lg font-semibold">{pl.producaoRealizada}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Restante</p>
                <p className="text-lg font-semibold">{restante}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Atingimento</span>
                <span className="font-semibold">{atingimento.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(100, atingimento)} className="h-2" />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1"><Package className="h-3 w-3" /> Necessidade de Matéria-Prima</p>
              <div className="space-y-1.5">
                {necessidades.map((n, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs">
                    <span className="font-medium truncate">{n.nome}</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-muted-foreground">Nec: {Math.ceil(n.necessidade)}</span>
                      <span className="text-muted-foreground">Disp: {n.disponivel}</span>
                      <span className={n.deficit > 0 ? "text-destructive font-semibold" : "text-success font-semibold"}>
                        {n.deficit > 0 ? `−${Math.ceil(n.deficit)}` : "OK"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                updatePlanejamento(pl.id, { producaoRealizada: Math.min(pl.quantidadePlanejada, pl.producaoRealizada + 25) });
                toast.info(`+25 unidades em ${pl.produto}`);
              }}>+25 produzidos</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NovoPlanejamento({
  close, onSubmit, materias,
}: {
  close: () => void;
  onSubmit: (p: Parameters<ReturnType<typeof import("@/lib/passofirme/store").useData>["addPlanejamento"]>[0]) => void;
  materias: { id: string; nome: string }[];
}) {
  const [produto, setProduto] = useState("Novo Produto");
  const [qtd, setQtd] = useState(500);
  const [meses, setMeses] = useState(3);

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Novo Planejamento de Produção</DialogTitle></DialogHeader>
      <div className="grid gap-3">
        <div><Label>Produto</Label><Input value={produto} onChange={(e) => setProduto(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Quantidade Planejada</Label><Input type="number" value={qtd} onChange={(e) => setQtd(Number(e.target.value))} /></div>
          <div><Label>Período (meses)</Label><Input type="number" value={meses} onChange={(e) => setMeses(Number(e.target.value))} /></div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={close}>Cancelar</Button>
        <Button onClick={() => {
          onSubmit({
            produto, quantidadePlanejada: qtd, periodoMeses: meses,
            inicio: new Date().toISOString().slice(0, 10),
            producaoRealizada: 0,
            bom: materias.slice(0, 3).map((m) => ({ materiaId: m.id, consumoPorUnidade: 0.5 })),
          });
          close();
        }}>Criar</Button>
      </DialogFooter>
    </DialogContent>
  );
}
