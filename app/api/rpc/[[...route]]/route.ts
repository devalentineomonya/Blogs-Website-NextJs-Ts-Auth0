import { Hono } from "hono"
import { handle } from "hono/vercel"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { db } from "@/lib/db"
import { blogPosts, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSession } from "@auth0/nextjs-auth0"
import { desc } from "drizzle-orm"

// Create a new Hono app
const app = new Hono().basePath("/api/rpc")

// Middleware to check if user is admin
async function isAdmin(c: any, next: any) {
  const session = await getSession()

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  // Get user from database
  const userEmail = session.user.email
  const userResult = await db.select().from(users).where(eq(users.email, userEmail))

  if (userResult.length === 0 || userResult[0].role !== "admin") {
    return c.json({ error: "Forbidden" }, 403)
  }

  return next()
}

// Schemas for validation
const blogPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

const updateBlogPostSchema = blogPostSchema.partial().extend({
  id: z.number(),
})

// Get all blog posts (public)
app.post("/getAllBlogs", async (c) => {
  const { page = 1, limit = 10, onlyPublished = true } = await c.req.json()

  const offset = (page - 1) * limit

  let query = db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset)

  if (onlyPublished) {
    query = query.where(eq(blogPosts.published, true))
  }

  const posts = await query
  const totalCount = await db.select({ count: db.fn.count() }).from(blogPosts)

  return c.json({
    posts,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(Number(totalCount[0].count) / limit),
      totalCount: Number(totalCount[0].count),
    },
  })
})

// Get blog post by slug (public)
app.post("/getBlogBySlug", async (c) => {
  const { slug } = await c.req.json()

  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug))

  if (post.length === 0) {
    return c.json({ error: "Blog post not found" }, 404)
  }

  return c.json(post[0])
})

// Create blog post (admin only)
app.post("/createBlog", isAdmin, zValidator("json", blogPostSchema), async (c) => {
  const session = await getSession()
  const data = await c.req.valid("json")

  // Get user ID
  const userEmail = session!.user.email
  const userResult = await db.select().from(users).where(eq(users.email, userEmail))

  if (userResult.length === 0) {
    return c.json({ error: "User not found" }, 404)
  }

  // Check if slug already exists
  const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug))

  if (existingPost.length > 0) {
    return c.json({ error: "Slug already exists" }, 400)
  }

  const newPost = await db
    .insert(blogPosts)
    .values({
      ...data,
      authorId: userResult[0].id,
    })
    .returning()

  return c.json(newPost[0])
})

// Update blog post (admin only)
app.post("/updateBlog", isAdmin, zValidator("json", updateBlogPostSchema), async (c) => {
  const data = await c.req.valid("json")

  const { id, ...updateData } = data

  // Check if blog post exists
  const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, id))

  if (existingPost.length === 0) {
    return c.json({ error: "Blog post not found" }, 404)
  }

  // If slug is being updated, check if it already exists
  if (updateData.slug && updateData.slug !== existingPost[0].slug) {
    const slugExists = await db.select().from(blogPosts).where(eq(blogPosts.slug, updateData.slug))

    if (slugExists.length > 0) {
      return c.json({ error: "Slug already exists" }, 400)
    }
  }

  const updatedPost = await db
    .update(blogPosts)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
    .returning()

  return c.json(updatedPost[0])
})

// Delete blog post (admin only)
app.post("/deleteBlog", isAdmin, async (c) => {
  const { id } = await c.req.json()

  // Check if blog post exists
  const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.id, id))

  if (existingPost.length === 0) {
    return c.json({ error: "Blog post not found" }, 404)
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id))

  return c.json({ success: true })
})

// Export the Hono app as a Vercel Edge Function
export const GET = handle(app)
export const POST = handle(app)

