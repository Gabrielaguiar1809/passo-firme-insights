import {
  Layers, Footprints, Scissors, FlaskConical, Hand, Package, Wrench,
  Brush, Monitor, ShieldCheck, Coffee, Cpu, Settings,
  type LucideIcon,
} from "lucide-react";
import type { CategoriaMP, CategoriaOP } from "./data";

export const ICONS_MP: Record<CategoriaMP, LucideIcon> = {
  Couro: Layers,
  Solados: Footprints,
  "Linhas e Cadarços": Scissors,
  "Colas e Químicos": FlaskConical,
  Palmilhas: Hand,
  Embalagens: Package,
  Aviamentos: Wrench,
};

export const ICONS_OP: Record<CategoriaOP, LucideIcon> = {
  Limpeza: Brush,
  Escritório: Monitor,
  EPI: ShieldCheck,
  Manutenção: Settings,
  "Copa e Cozinha": Coffee,
  Tecnologia: Cpu,
};
