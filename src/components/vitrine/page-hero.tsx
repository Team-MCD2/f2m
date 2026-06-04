import { Breadcrumb } from "./breadcrumb";

type PageHeroProps = {
  title: string;
  lead?: string;
  image?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
};

export function PageHero({ title, lead, image, breadcrumbs, children }: PageHeroProps) {
  const style = image ? ({ ["--page-hero-image" as string]: `url('${image}')` } as React.CSSProperties) : undefined;

  return (
    <div
      className={`page-hero${image ? " page-hero--media page-hero--ken-burns" : ""}`}
      style={style}
    >
      <div className="container">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
