import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Jobs in der Medizin</h3>
            <p className="text-background/70">
              Ihre Plattform für Stellenangebote im medizinischen Bereich in ganz Deutschland.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-medium">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-background/70 hover:text-background">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-background/70 hover:text-background">
                  Stellenangebote
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-medium">Kontakt</h4>
            <address className="not-italic text-background/70">
              <p>Jung & Jung Projekt GmbH</p>
              <p>Goebenstraße 50</p>
              <p>58097 Hagen</p>
              <p className="mt-2">Ansprechpartner: Philipp Jung</p>
              <p>Tel: 0151 23 58 10 44</p>
              <p>E-Mail: info@jobsindermedizin.de</p>
            </address>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-medium">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-background/70 hover:text-background">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-background/70 hover:text-background">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-background/70 hover:text-background">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-background/20 pt-6 text-center text-background/50">
          <p className="mx-auto mb-3 max-w-3xl text-xs">
            Aus Gründen der besseren Lesbarkeit wird auf dieser Website auf die gleichzeitige
            Verwendung männlicher, weiblicher und diverser Sprachformen verzichtet. Sämtliche
            Personenbezeichnungen gelten gleichermaßen für alle Geschlechter.
          </p>
          <p>&copy; {new Date().getFullYear()} Jobs in der Medizin. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
