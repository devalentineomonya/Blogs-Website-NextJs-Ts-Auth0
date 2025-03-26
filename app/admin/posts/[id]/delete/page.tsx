"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DeletePostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/rpc/getBlogBySlug`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Number.parseInt(params.id) }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch post")
        }

        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error("Error fetching post:", error)
        setError("Failed to load post data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch("/api/rpc/deleteBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number.parseInt(params.id) }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete blog post")
      }

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Error deleting post:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Post not found</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Delete Post</CardTitle>
          <CardDescription>Are you sure you want to delete this post? This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="font-medium">{post.title}</p>
            <p className="text-sm text-muted-foreground">Slug: {post.slug}</p>
            <p className="text-sm text-muted-foreground">Status: {post.published ? "Published" : "Draft"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/admin")} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

