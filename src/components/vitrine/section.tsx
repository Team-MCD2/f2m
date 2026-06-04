type SectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  variant?: "default" | "light" | "brand" | "alt";
  className?: string;
  children: React.ReactNode;
  ariaLabelledBy?: string;
};

const variantClass: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "section",
  light: "section section-light",
  brand: "section section-brand",
  alt: "section section-alt",
};

export function Section({
  id,
  title,
  subtitle,
  variant = "default",
  className = "",
  children,
  ariaLabelledBy,
}: SectionProps) {
  const headingId = ariaLabelledBy ?? (title ? `${id ?? "section"}-title` : undefined);

  return (
    <section
      id={id}
      className={`${variantClass[variant]} ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="section-header">
            {title && <h2 id={headingId}>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
