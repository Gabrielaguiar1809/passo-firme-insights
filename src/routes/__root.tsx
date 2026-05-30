import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/passofirme/AppSidebar";
import { DataProvider } from "@/lib/passofirme/store";
import { Toaster } from "@/components/ui/sonner";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">A rota acessada não existe.</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Voltar ao Dashboard</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PassoFirme — Gestão de Compras Calçadista" },
      { name: "description", content: "SaaS para gestão de compras, estoque e fornecedores em indústrias de calçados." },
      { property: "og:title", content: "PassoFirme — Gestão de Compras Calçadista" },
      { name: "twitter:title", content: "PassoFirme — Gestão de Compras Calçadista" },
      { property: "og:description", content: "SaaS para gestão de compras, estoque e fornecedores em indústrias de calçados." },
      { name: "twitter:description", content: "SaaS para gestão de compras, estoque e fornecedores em indústrias de calçados." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5aea27c3-cd87-446b-b95e-d1337ebbaffa/id-preview-8a2e176f--72f50897-ddbd-4e18-860f-da174674f3ba.lovable.app-1780058377819.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5aea27c3-cd87-446b-b95e-d1337ebbaffa/id-preview-8a2e176f--72f50897-ddbd-4e18-860f-da174674f3ba.lovable.app-1780058377819.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 backdrop-blur px-4">
                <SidebarTrigger />
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar em todo o sistema..." className="w-72 pl-8 h-9" />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="relative rounded-md p-2 hover:bg-muted">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                  </button>
                  <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">RF</div>
                    <span className="font-medium">Ricardo F.</span>
                  </div>
                </div>
              </header>
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </div>
          <Toaster richColors position="top-right" />
        </SidebarProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}
