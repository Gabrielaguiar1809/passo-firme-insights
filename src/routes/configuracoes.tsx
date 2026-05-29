import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIAS } from "@/lib/passofirme/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Plug } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — PassoFirme" }] }),
  component: ConfigPage,
});

const usuariosSeed = [
  { nome: "Ricardo Ferreira", email: "ricardo@passofirme.com", papel: "Administrador" },
  { nome: "Marina Reis", email: "marina@passofirme.com", papel: "Comprador" },
  { nome: "Carlos Lima", email: "carlos@passofirme.com", papel: "Almoxarifado" },
  { nome: "Juliana Castro", email: "juliana@passofirme.com", papel: "Gestor" },
];

const integracoes = [
  { nome: "Omie ERP", desc: "Sincronização de pedidos e estoque", on: true },
  { nome: "Bling", desc: "Cadastro de fornecedores", on: false },
  { nome: "SAP B1", desc: "Integração financeira", on: false },
  { nome: "WhatsApp Business", desc: "Notificações para fornecedores", on: true },
];

function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Personalize sua instância PassoFirme.</p>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-4 rounded-xl border bg-card p-5">
          <div className="space-y-2">
            {usuariosSeed.map((u) => (
              <div key={u.email} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                    {u.nome.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{u.nome}</div>
                    <div className="text-xs text-muted-foreground">{u.email}</div>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs">{u.papel}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissoes" className="mt-4 rounded-xl border bg-card p-5 space-y-3">
          {["Aprovar pedidos", "Cadastrar fornecedores", "Editar estoque", "Visualizar indicadores", "Exportar dados"].map((p) => (
            <div key={p} className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">{p}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="categorias" className="mt-4 rounded-xl border bg-card p-5">
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <span key={c} className="rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium">{c}</span>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parametros" className="mt-4 rounded-xl border bg-card p-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Moeda padrão</Label>
            <Input defaultValue="BRL — Real brasileiro" />
          </div>
          <div className="space-y-2">
            <Label>Fuso horário</Label>
            <Input defaultValue="America/Sao_Paulo" />
          </div>
          <div className="space-y-2">
            <Label>Dias úteis lead time padrão</Label>
            <Input type="number" defaultValue={7} />
          </div>
          <div className="space-y-2">
            <Label>Margem alerta OTIF</Label>
            <Input type="number" defaultValue={85} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => toast.success("Parâmetros salvos")}>
              <Check className="h-4 w-4" /> Salvar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="integracoes" className="mt-4 space-y-2">
          {integracoes.map((i) => (
            <div key={i.nome} className="flex items-center justify-between rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Plug className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{i.nome}</div>
                  <div className="text-xs text-muted-foreground">{i.desc}</div>
                </div>
              </div>
              <Switch defaultChecked={i.on} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
