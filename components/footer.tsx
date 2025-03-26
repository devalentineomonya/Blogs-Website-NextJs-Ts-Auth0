export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Modern Blog. All rights reserved.</p>
      </div>
    </footer>
  )
}

