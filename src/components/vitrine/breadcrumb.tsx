import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="breadcrumb">
        {items.map((item, i) => (
          <li key={item.label} aria-current={i === items.length - 1 ? "page" : undefined}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
