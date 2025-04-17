# Modern Blog Platform - Next.js + Drizzle + Auth0

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-000000?logo=next.js)
![Drizzle](https://img.shields.io/badge/Drizzle-0.30.8-FFDB1E?logo=postgresql)
![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E59B?logo=neon)
![Auth0](https://img.shields.io/badge/Auth0-3.0-blueviolet?logo=auth0)
![Hono](https://img.shields.io/badge/Hono-4.0.10-FF4785)
![Cloudinary](https://img.shields.io/badge/-cloudinary-3448C5?logo=cloudinary)

A high-performance blog platform built with modern web technologies, featuring serverless PostgreSQL, secure authentication, and optimized content delivery.

![Blog Platform Preview](public/screenshot.png) 

## 🌟 Features

- 🔐 **Auth0 Authentication**: Secure login with social providers & RBAC
- 📝 **MDX Blog System**: Rich content authoring with code blocks
- 🚀 **Edge Runtime**: Hono-powered API endpoints
- 🗄️ **Serverless DB**: Neon PostgreSQL with Drizzle ORM
- 📱 **Responsive Design**: Mobile-first layout with dark mode
- 🔍 **SEO Optimized**: Automatic sitemap & Open Graph tags
- ⚡ **Performance**: 90+ Lighthouse scores with edge caching

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Auth0 Next.js SDK
- **Content**: MDX + Contentlayer

### Backend
- **ORM**: Drizzle (TypeScript-first SQL toolkit)
- **Database**: Neon PostgreSQL (serverless)
- **API**: Hono.js edge routers
- **Validation**: Zod

### Infrastructure
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel Edge Network

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Auth0 account
- Neon PostgreSQL database
- pnpm 8+

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/devalentineomonya/Blogs-Website-NextJs-Ts-Auth0.git
   cd Blogs-Website-NextJs-Ts-Auth0
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```env
   # .env
   AUTH0_SECRET=your_auth0_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your_tenant.auth0.com
   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret

   DATABASE_URL=postgresql://user:pass@neon-hostname/project
   ```

4. **Database Setup**
   ```bash
   pnpm drizzle-kit generate
   pnpm db:push
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

## 📝 Content Management

1. Create MDX files in `/content/posts`:
   ```mdx
   ---
   title: "My First Post"
   date: "2024-03-20"
   description: "Post introduction"
   tags: ["webdev", "nextjs"]
   ---

   ## Blog Content

   ```js
   console.log("MDX code blocks supported")
   ```
   ```

2. Use Hono API for custom endpoints:
   ```ts
   // app/api/posts/[id]/route.ts
   import { Hono } from 'hono'

   const app = new Hono()

   app.get('/:id', async (c) => {
     const post = await db.query.posts.findFirst({
       where: eq(posts.id, c.req.param('id'))
     })
     return c.json(post)
   })
   ```

## 🔧 Configuration

### Auth0 Setup
1. Create Auth0 application
2. Configure callback URLs:
   - `http://localhost:3000/api/auth/callback`
3. Add required social connections

### Drizzle + Neon
1. Create Neon project
2. Update `DATABASE_URL` in `.env`
3. Edit schema in `/db/schema.ts`


## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdevalentineomonya%2FBlogs-Website-NextJs-Ts-Auth0)

1. Set environment variables in Vercel
2. Enable Edge Network in project settings
3. Connect GitHub repository

## 📄 License
MIT - See [LICENSE](LICENSE) for details
