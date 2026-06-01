import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/lib/passofirme/store";
import { brl } from "@/components/passofirme/ui-bits";
import { RotateCcw } from "lucide-react";
import type { SituacaoDevolucao } from "@/lib/passofirme/data";

export const Route = createFileRoute("/estoque/devolucoes")({
  head: () => ({ meta: [{ title: "Devoluções — PassoFirme" }] }),
  component: DevolucoesPage,
});

const sitCls: Record<SituacaoDevolucao, string> = {
  "Aguardando crédito": "bg-warning/25 text-warning-foreground",
  "Em análise": "bg-info/15 text-info",
  Concluída: "bg-success/15 text-success",
};

function DevolucoesPage() {
  const { devolucoesFornecedor, fornecedores } = useData();
  const fMap = Object.fromEntries(fornecedores.map((f) => [f.id, f.nome]));
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <RotateCcw className="h-6 w-6 text-primary" /> Devoluções ao Fornecedor
        </h1>
        <p className="text-sm text-muted-foreground">Materiais devolvidos por divergência de qualidade ou quantidade.</p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Data</th>
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-left font-medium">Fornecedor</th>
                <th className="px-4 py-3 text-left font-medium">Motivo</th>
                <th className="px-4 py-3 text-right font-medium">Qtd</th>
                <th className="px-4 py-3 text-right font-medium">Valor</th>
                <th className="px-4 py-3 text-left font-medium">Situação</th>
              </tr>
            </thead>
            <tbody>
              {devolucoesFornecedor.map((d) => (
                <tr key={d.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">{new Date(d.data).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 font-medium">{d.itemNome}</td>
                  <td className="px-4 py-3">{fMap[d.fornecedorId] ?? "—"}</td>
                  <td className="px-4 py-3">{d.motivo}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{d.quantidade}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{brl(d.valor)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sitCls[d.situacao]}`}>{d.situacao}</span>
                  </td>
                </tr>
              ))}
              {devolucoesFornecedor.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Nenhuma devolução registrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
