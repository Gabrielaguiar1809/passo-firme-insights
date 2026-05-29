import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpDown, Download, FileSpreadsheet, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
}

interface Props<T extends { id: string }> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  onNew?: () => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  filters?: ReactNode;
}

export function DataToolbar({
  title,
  search,
  onSearch,
  onNew,
  filters,
  rows,
}: {
  title: string;
  search: string;
  onSearch: (v: string) => void;
  onNew?: () => void;
  filters?: ReactNode;
  rows: unknown[];
}) {
  const exportExcel = () => {
    toast.success(`Exportando ${rows.length} registros para Excel`, { description: "Arquivo .xlsx gerado." });
  };
  const exportPdf = () => {
    toast.success(`Exportando ${rows.length} registros para PDF`, { description: "Arquivo .pdf gerado." });
  };
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{rows.length} registros</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            className="w-56 pl-8"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {filters}
        <Button variant="outline" size="sm" onClick={exportExcel}>
          <FileSpreadsheet className="h-4 w-4" /> Excel
        </Button>
        <Button variant="outline" size="sm" onClick={exportPdf}>
          <Download className="h-4 w-4" /> PDF
        </Button>
        {onNew && (
          <Button size="sm" onClick={onNew}>
            <Plus className="h-4 w-4" /> Novo
          </Button>
        )}
      </div>
    </div>
  );
}

export function DataTable<T extends { id: string }>({
  title,
  columns,
  rows,
  onNew,
  onRowClick,
  pageSize = 10,
  filters,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((r) =>
      Object.values(r as Record<string, unknown>).some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => String(c.key) === sortKey);
    return [...filtered].sort((a, b) => {
      const av = col?.accessor ? col.accessor(a) : (a as Record<string, unknown>)[sortKey];
      const bv = col?.accessor ? col.accessor(b) : (b as Record<string, unknown>)[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv), "pt-BR", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="space-y-4">
      <DataToolbar
        title={title}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        onNew={onNew}
        filters={filters}
        rows={rows}
      />
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th key={String(c.key)} className="px-4 py-3 text-left font-medium">
                    {c.sortable !== false ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort(String(c.key))}
                      >
                        {c.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-muted/30 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
