import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, params.slug)).limit(1)

  if (!post.length) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post[0].title,
    description: post[0].excerpt || post[0].content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, params.slug)).limit(1)

  if (!post.length || !post[0].published) {
    notFound()
  }

  // Get author information
  const author = await db.select().from(users).where(eq(users.id, post[0].authorId)).limit(1)

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post[0].title}</h1>
        <div className="text-muted-foreground">
          <time dateTime={post[0].createdAt.toISOString()}>{formatDate(post[0].createdAt)}</time>
          {author.length > 0 && <span> · By {author[0].name || author[0].email}</span>}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ node, ...props }) => (
              <img className="rounded-lg my-8 mx-auto max-h-[600px] object-contain" {...props} />
            ),
            a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
            p: ({ node, ...props }) => <p className="my-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
            ),
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
              ) : (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                  <code {...props} />
                </pre>
              ),
          }}
        >
          {post[0].content}
        </Markdown>
      </div>
    </article>
  )
}

