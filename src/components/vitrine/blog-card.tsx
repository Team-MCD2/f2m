import Link from "next/link";
import type { BlogPost } from "@/lib/vitrine/blog-posts";
import { VitrineImage } from "./vitrine-image";
import { VitrineImageZoom } from "./vitrine-image-zoom";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link className="blog-card" href={`/blog/${post.slug}`}>
      <VitrineImageZoom className="blog-card-media">
        <VitrineImage
          src={post.image}
          fallback={post.imageFallback}
          alt={post.imageAlt}
          width={600}
          height={375}
          className="blog-card-thumb"
        />
      </VitrineImageZoom>
      <div className="blog-card-body">
        <time dateTime={post.date}>{post.dateLabel}</time>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </div>
    </Link>
  );
}
