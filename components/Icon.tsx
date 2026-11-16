import {
  BarChart3,
  Calculator,
  Crown,
  FileText,
  Flower2,
  Hand,
  Keyboard,
  Layers,
  Monitor,
  Palette,
  Ruler,
  Scissors,
  Shirt,
  Sparkles,
  Spool,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/types";

const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  scissors: Scissors,
  palette: Palette,
  hand: Hand,
  shirt: Shirt,
  ruler: Ruler,
  needle: Spool,
  flower: Flower2,
  layers: Layers,
  crown: Crown,
  monitor: Monitor,
  file: FileText,
  calculator: Calculator,
  keyboard: Keyboard,
  chart: BarChart3,
};

export const iconNames = Object.keys(icons) as IconName[];

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp {...props} />;
}
