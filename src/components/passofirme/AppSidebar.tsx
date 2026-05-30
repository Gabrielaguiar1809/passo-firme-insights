import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Factory,
  PackageCheck,
  Package,
  Footprints,
  TrendingUp,
  Settings,
  Sparkles,
  Boxes,
  ArrowLeftRight,
  Target,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Planejamento", url: "/planejamento", icon: Target },
  { title: "Requisições", url: "/requisicoes", icon: ShoppingCart },
  { title: "Cotações", url: "/cotacoes", icon: ClipboardList },
  { title: "Fornecedores", url: "/fornecedores", icon: Factory },
  { title: "Pedidos de Compra", url: "/pedidos", icon: PackageCheck },
  { title: "Estoque MP", url: "/estoque", icon: Package },
  { title: "Estoque Operacional", url: "/estoque-operacional", icon: Boxes },
  { title: "Movimentações", url: "/movimentacoes", icon: ArrowLeftRight },
  { title: "Produto Acabado", url: "/produtos", icon: Footprints },
  { title: "Indicadores", url: "/indicadores", icon: TrendingUp },
  { title: "Assistente IA", url: "/assistente", icon: Sparkles },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            P
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-none text-sidebar-foreground">PassoFirme</span>
            <span className="text-[10px] text-sidebar-foreground/60 mt-0.5">Gestão Calçadista</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operacional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
