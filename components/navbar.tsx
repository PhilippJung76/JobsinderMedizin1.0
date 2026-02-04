"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Jobs in der Medizin - Zur Startseite"
            width={240}
            height={72}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
            Startseite
          </Link>
          <Link href="/unsere-haltung" className="text-sm font-bold text-primary hover:text-primary/80">
            Unsere Haltung
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-foreground hover:text-primary">
            Stellenangebote
          </Link>
          <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary">
            Bewerberbereich
          </Link>
          <Link href="/auth/unternehmen/login" className="text-sm font-medium text-foreground hover:text-primary">
            Für Unternehmen
          </Link>
          <Button asChild>
            <Link href="/jobs">Jobs finden</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Startseite
            </Link>
            <Link
              href="/unsere-haltung"
              className="text-sm font-bold text-primary hover:text-primary/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Unsere Haltung
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stellenangebote
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bewerberbereich
            </Link>
            <Link
              href="/auth/unternehmen/login"
              className="text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Für Unternehmen
            </Link>
            <Button asChild className="w-full">
              <Link href="/jobs" onClick={() => setMobileMenuOpen(false)}>
                Jobs finden
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
