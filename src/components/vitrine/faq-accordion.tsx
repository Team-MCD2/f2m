import { DGESP_FAQ } from "@/lib/vitrine/faq-dgesp";

type FaqAccordionProps = {
  id?: string;
};

export function FaqAccordion({ id }: FaqAccordionProps) {
  return (
    <div className="faq-accordion" id={id}>
      {DGESP_FAQ.map((item) => (
        <details key={item.q} className="accordion-item">
          <summary className="accordion-trigger">{item.q}</summary>
          <div className="accordion-panel">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
