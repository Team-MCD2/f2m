import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/vitrine/blog-card";
import { PageHero } from "@/components/vitrine/page-hero";
import { Section } from "@/components/vitrine/section";
import { BLOG_POSTS } from "@/lib/vitrine/blog-posts";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

export const metadata: Metadata = {
  title: "Blog & Ressources Sécurité Privée",
  description:
    "Articles SEO : CNAPS, CPF sécurité privée, convention collective 3196, DGESP — ressources F2M Consulting Toulouse.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog & ressources"
        lead="Actualités réglementaires, financement et métiers de la sécurité privée à Toulouse et en France."
        image={VITRINE_IMAGES.blog}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Blog" },
        ]}
      />

      <Section variant="light" className="reveal-on-scroll">
        <div className="blog-grid reveal-on-scroll reveal-stagger">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <p className="reveal-on-scroll" data-reveal style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link className="btn btn-gold" href="/formation-dgesp">
            Formation DGESP
          </Link>
          <Link className="btn btn-navy" href="/contact" style={{ marginLeft: "0.5rem" }}>
            Contact
          </Link>
        </p>
      </Section>
    </>
  );
}
