import { cn } from "@/lib/utils";

type CardRibbonProps = {
  label: string;
  className?: string;
};

/** Bandeau diagonal coin supérieur droit (corner ribbon). */
export function CardRibbon({ label, className }: CardRibbonProps) {
  return (
    <span className={cn("card-ribbon", className)} aria-hidden="true">
      {label}
    </span>
  );
}
