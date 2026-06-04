import Link from "next/link";
import { DGESP_FAQ } from "@/lib/vitrine/faq-dgesp";

type FaqAccordionProps = {
  id?: string;
  limit?: number;
  showAllLink?: boolean;
};

export function FaqAccordion({ id, limit, showAllLink }: FaqAccordionProps) {
  const items = limit ? DGESP_FAQ.slice(0, limit) : DGESP_FAQ;

  return (
    <>
      <div className="faq-accordion reveal-on-scroll reveal-stagger" id={id}>
        {items.map((item) => (
          <details key={item.q} className="accordion-item">
            <summary className="accordion-trigger">{item.q}</summary>
            <div className="accordion-panel">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
      {showAllLink && limit ? (
        <p className="faq-more-link">
          <Link href="/formation-dgesp#faq" className="btn btn-outline">
            Voir toutes les questions
          </Link>
        </p>
      ) : null}
    </>
  );
}
