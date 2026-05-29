import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type Column } from "@/components/passofirme/DataTable";
import { useData } from "@/lib/passofirme/store";
import { calcIQF, type Fornecedor } from "@/lib/passofirme/data";
import { Trophy } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/fornecedores")({
  head: () => ({ meta: [{ title: "Fornecedores — PassoFirme" }] }),
  component: FornecedoresPage,
});

function FornecedoresPage() {
  const { fornecedores, addFornecedor, updateFornecedor } = useData();

  const ranking = useMemo(() => [...fornecedores].sort((a, b) => calcIQF(b) - calcIQF(a)), [fornecedores]);

  const cols: Column<Fornecedor>[] = [
    { key: "nome", label: "Fornecedor" },
    { key: "categoria", label: "Categoria" },
    { key: "cidade", label: "Cidade", render: (r) => `${r.cidade}/${r.estado}` },
    { key: "qualidade", label: "Qualidade" },
    { key: "entrega", label: "Entrega" },
    { key: "preco", label: "Preço" },
    { key: "atendimento", label: "Atend." },
    { key: "iqf", label: "IQF", accessor: (r) => calcIQF(r), render: (r) => (
      <span className="font-semibold text-primary">{calcIQF(r)}</span>
    ) },
    { key: "otif", label: "OTIF", render: (r) => `${r.otif}%` },
    { key: "leadTime", label: "Lead Time", render: (r) => `${r.leadTime}d` },
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
            <div key={f.id} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary font-semibold text-xs">{i + 1}</span>
                <div>
                  <div className="text-sm font-medium">{f.nome}</div>
                  <div className="text-xs text-muted-foreground">{f.categoria}</div>
                </div>
              </div>
              <span className="text-base font-semibold text-primary">{calcIQF(f)}</span>
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
            nome: "Novo Fornecedor",
            categoria: "Couro",
            cidade: "São Paulo",
            estado: "SP",
            qualidade: 8, entrega: 8, preco: 8, atendimento: 8,
            leadTime: 7, otif: 85,
          });
          toast.success("Fornecedor adicionado");
        }}
        onRowClick={(r) => {
          updateFornecedor(r.id, { qualidade: Math.min(10, +(r.qualidade + 0.1).toFixed(1)) });
          toast.info(`Qualidade de ${r.nome} ajustada`);
        }}
      />
    </div>
  );
}
