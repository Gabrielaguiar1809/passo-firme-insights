import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ShoppingCart, ClipboardList, Factory, PackageCheck, Package,
  Footprints, TrendingUp, Settings, Sparkles, Boxes, ArrowLeftRight, Target,
  ChevronDown, BarChart3, Users, FileText, Lightbulb, History, AlertTriangle,
  Wrench, ListChecks, Brush, Briefcase, ShieldCheck, ClipboardCheck, Cog, Truck,
  RotateCcw, Layers, Gauge,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }>; badge?: string };
type Group = { id: string; title: string; icon: React.ComponentType<{ className?: string }>; emoji: string; items: Item[] };

const groups: Group[] = [
  {
    id: "visao", title: "Visão Geral", emoji: "📊", icon: LayoutDashboard,
    items: [
      { title: "Dashboard Executivo", url: "/", icon: LayoutDashboard },
      { title: "Indicadores Gerais", url: "/indicadores", icon: TrendingUp },
      { title: "Observações Estratégicas", url: "/visao/observacoes", icon: FileText },
      { title: "Plano de Ação", url: "/visao/plano-acao", icon: ListChecks },
      { title: "Sugestões de Melhoria", url: "/visao/sugestoes", icon: Lightbulb },
    ],
  },
  {
    id: "vendas", title: "Vendas", emoji: "💰", icon: TrendingUp,
    items: [
      { title: "CRM B2B", url: "/vendas/crm-b2b", icon: Briefcase },
      { title: "CRM B2C", url: "/vendas/crm-b2c", icon: Users, badge: "Mês 5" },
      { title: "Pedidos de Venda", url: "/vendas/pedidos", icon: ClipboardCheck },
      { title: "Disponibilidade", url: "/vendas/disponibilidade", icon: Layers },
      { title: "Programação de Produção", url: "/producao/programacao", icon: Target },
      { title: "Análise de Vendedores", url: "/vendas/analise-vendedores", icon: Users },
      { title: "Planejamento Estratégico", url: "/vendas/planejamento", icon: Target },
      { title: "Indicadores Comerciais", url: "/vendas/indicadores", icon: BarChart3 },
    ],
  },
  {
    id: "compras", title: "Compras", emoji: "🛒", icon: ShoppingCart,
    items: [
      { title: "Planejamento", url: "/planejamento", icon: Target },
      { title: "Requisições", url: "/requisicoes", icon: ShoppingCart },
      { title: "Cotações", url: "/cotacoes", icon: ClipboardList },
      { title: "Fornecedores", url: "/fornecedores", icon: Factory },
      { title: "Pedidos de Compra", url: "/pedidos", icon: PackageCheck },
      { title: "Indicadores de Compras", url: "/compras/indicadores", icon: BarChart3 },
    ],
  },
  {
    id: "estoque", title: "Estoque", emoji: "📦", icon: Package,
    items: [
      { title: "Estoque MP", url: "/estoque", icon: Package },
      { title: "Estoque Operacional", url: "/estoque-operacional", icon: Boxes },
      { title: "Movimentações", url: "/movimentacoes", icon: ArrowLeftRight },
      { title: "Recebimentos", url: "/estoque/recebimentos", icon: Truck },
      { title: "Devoluções", url: "/estoque/devolucoes", icon: RotateCcw },
      { title: "Indicadores de Estoque", url: "/estoque/indicadores", icon: BarChart3 },
    ],
  },
  {
    id: "producao", title: "Produção", emoji: "🏭", icon: Factory,
    items: [
      { title: "Programação", url: "/producao/programacao", icon: Target },
      { title: "Ordens de Produção", url: "/producao/ordens", icon: ClipboardCheck },
      { title: "Consumo de MP", url: "/producao/consumo", icon: Gauge },
      { title: "Produto Acabado", url: "/produtos", icon: Footprints },
      { title: "Gargalos", url: "/producao/gargalos", icon: AlertTriangle },
      { title: "Indicadores Operacionais", url: "/producao/indicadores", icon: BarChart3 },
    ],
  },
  {
    id: "admin", title: "Administrativo", emoji: "🏢", icon: Briefcase,
    items: [
      { title: "Solicitações Internas", url: "/admin/solicitacoes", icon: ShoppingCart },
      { title: "Controle de Limpeza", url: "/admin/limpeza", icon: Brush },
      { title: "Controle de Escritório", url: "/admin/escritorio", icon: FileText },
      { title: "Controle de EPIs", url: "/admin/epi", icon: ShieldCheck },
      { title: "Indicadores Administrativos", url: "/admin/indicadores", icon: BarChart3 },
    ],
  },
  {
    id: "ia", title: "Inteligência", emoji: "🤖", icon: Sparkles,
    items: [
      { title: "Assistente IA", url: "/assistente", icon: Sparkles },
      { title: "Relatórios", url: "/inteligencia/relatorios", icon: FileText },
      { title: "Observações Estratégicas", url: "/visao/observacoes", icon: FileText },
      { title: "Sugestões de Melhoria", url: "/visao/sugestoes", icon: Lightbulb },
      { title: "Histórico de Melhorias", url: "/inteligencia/historico", icon: History },
    ],
  },
  {
    id: "cfg", title: "Configurações", emoji: "⚙️", icon: Cog,
    items: [
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const initialOpen = Object.fromEntries(groups.map((g) => [g.id, g.items.some((i) => i.url === "/" ? path === "/" : path.startsWith(i.url))]));
  const [open, setOpen] = useState<Record<string, boolean>>({ ...initialOpen, visao: initialOpen.visao || path === "/" });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">P</div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-none text-sidebar-foreground">PassoFirme</span>
            <span className="text-[10px] text-sidebar-foreground/60 mt-0.5">Gestão Calçadista</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => {
          const Icon = g.icon;
          const isOpen = open[g.id] ?? false;
          const hasActive = g.items.some((i) => i.url === "/" ? path === "/" : path.startsWith(i.url));
          return (
            <SidebarGroup key={g.id}>
              <Collapsible open={isOpen} onOpenChange={(v) => setOpen((s) => ({ ...s, [g.id]: v }))}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer flex items-center justify-between hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {g.title}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                {/* When sidebar collapses to icon-only, render flat icons */}
                <div className="hidden group-data-[collapsible=icon]:block">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {g.items.map((item) => {
                        const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                        return (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                              <Link to={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </div>
                <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {g.items.map((item) => {
                        const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                        return (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild isActive={active} tooltip={item.title} size="sm">
                              <Link to={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
                {!isOpen && hasActive && (
                  <div className="h-0.5 mx-3 rounded-full bg-sidebar-primary/40 group-data-[collapsible=icon]:hidden" />
                )}
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
