import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Stethoscope,
  Heart,
  Users,
  Briefcase,
  Clock,
  BookOpen,
  Handshake,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { getFeaturedJobs, getRecentJobs } from "@/lib/jobs-data"

const workplaceFeatures = [
  { icon: Heart, label: "Wertschätzendem Team" },
  { icon: Clock, label: "Verlässlicher Dienstplanung" },
  { icon: Home, label: "Vereinbarkeit von Beruf und Privatleben" },
  { icon: BookOpen, label: "Zeit für Weiterbildung" },
  { icon: Handshake, label: "Respektvollem Umgang auf Augenhöhe" },
]

export default function HomePage() {
  const featuredJobs = getFeaturedJobs()
  const recentJobs = getRecentJobs(4)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background pb-20 pt-20 md:pb-28 md:pt-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
              <div className="relative inline-block">
                <span className="absolute -right-20 -top-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground md:-right-24 md:-top-3 md:px-4 md:py-1.5 md:text-sm">
                  Betaversion
                </span>
                <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Weil Ihre Arbeit mehr ist als ein Job.
                </h1>
              </div>
              <p className="mb-4 text-xl text-foreground md:text-2xl">
                Finden Sie eine Stelle im Gesundheitswesen, die zu Ihrem Leben passt.
              </p>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Sie kümmern sich jeden Tag um andere Menschen.
                <br />
                Wir helfen Ihnen, einen Arbeitgeber zu finden, der Ihre Leistung{" "}
                <strong className="text-foreground">sieht</strong>,{" "}
                <strong className="text-foreground">respektiert</strong> und{" "}
                <strong className="text-foreground">wertschätzt</strong>.
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" />
                  Jobs durchsuchen
                </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Trust/Values Anchor Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed">
              Menschen in Medizin und Pflege arbeiten mit Verantwortung, Empathie und Belastbarkeit.
              <br />
              Diese Plattform wurde genau dafür geschaffen:
            </p>
            <div className="space-y-2 text-lg md:text-xl">
              <p className="text-muted-foreground">
                <span className="text-muted-foreground/70">nicht</span> für anonyme Massenbewerbungen,
              </p>
              <p className="font-medium text-foreground">
                <span className="text-primary">sondern</span> für Menschen, die ihren Beruf mit Haltung ausüben.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Berufe mit Verantwortung. Menschen mit Berufung.
            </h2>
            <p className="text-muted-foreground text-lg">
              Finden Sie Ihren Platz im Gesundheitswesen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Ärzte */}
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Stethoscope className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">Ärzte</h3>
                <p className="mb-2 text-muted-foreground">
                  Verantwortung übernehmen. Entscheidungen treffen. Menschen begleiten.
                </p>
                <p className="mb-6 text-muted-foreground">
                  Entdecken Sie ärztliche Positionen, die Ihrer{" "}
                  <strong className="text-foreground">Qualifikation</strong>,{" "}
                  <strong className="text-foreground">Erfahrung</strong> und Ihrem{" "}
                  <strong className="text-foreground">Anspruch</strong> gerecht werden.
                </p>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/jobs">Jobs ansehen</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pflegekräfte */}
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">Pflegekräfte</h3>
                <p className="mb-2 text-muted-foreground">
                  Pflege bedeutet Nähe, Stärke und tägliches Durchhalten.
                </p>
                <p className="mb-6 text-muted-foreground">
                  Finden Sie Stellen, in denen Ihre Arbeit nicht als selbstverständlich gilt –
                  <br />
                  sondern als <strong className="text-foreground">unverzichtbar</strong>.
                </p>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/jobs">Jobs ansehen</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Medizinische Fachangestellte */}
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">Medizinische Fachangestellte</h3>
                <p className="mb-2 text-muted-foreground">
                  Organisation, medizinisches Können und Empathie – oft alles gleichzeitig.
                </p>
                <p className="mb-6 text-muted-foreground">
                  Entdecken Sie Arbeitsplätze, die Ihre Vielseitigkeit ernst nehmen und fördern.
                </p>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/jobs">Jobs ansehen</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Verwaltung & Technik */}
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">Verwaltung & Technik</h3>
                <p className="mb-2 font-medium text-foreground">
                  Ohne Sie läuft nichts.
                </p>
                <p className="mb-6 text-muted-foreground">
                  Finden Sie Positionen im Hintergrund, die das Gesundheitswesen zuverlässig am Laufen halten.
                </p>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/jobs">Jobs ansehen</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Healthcare Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Warum Menschen sich für das Gesundheitswesen entscheiden
            </h2>
          </div>

          <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Weil Ihre Arbeit Sinn hat.</h3>
              <p className="text-muted-foreground">
                Sie begleiten Menschen in entscheidenden Momenten ihres Lebens – fachlich und menschlich.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Weil diese Berufe Zukunft haben.</h3>
              <p className="text-muted-foreground">
                Das Gesundheitswesen wächst. Gute Fachkräfte werden gebraucht – heute und morgen.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Weil Entwicklung dazugehört.</h3>
              <p className="text-muted-foreground">
                Weiterbildung, Spezialisierung und persönliches Wachstum sind kein Extra – sondern Teil des Berufs.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Weil es mehr Möglichkeiten gibt, als man denkt.</h3>
              <p className="text-muted-foreground">
                Von direkter Patientenarbeit bis Organisation, Technik und Verwaltung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Differentiation Section */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              Gute Arbeit braucht gute Rahmenbedingungen.
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              Deshalb legen wir Wert auf Stellenangebote,
              <br />
              bei denen nicht nur die Aufgabe stimmt –
              <br />
              sondern auch das Umfeld.
            </p>

            <p className="mb-6 text-muted-foreground">
              Viele Positionen sind gekennzeichnet mit:
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {workplaceFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                  >
                    <IconComponent className="h-4 w-4 text-primary" />
                    {feature.label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-background py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Ausgewählte Stellen mit fairen Bedingungen und klarer Perspektive.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Arbeitsplätze, bei denen Menschen nicht{" "}
              <strong className="text-foreground">funktionieren</strong> müssen –
              <br />
              sondern <strong className="text-foreground">wirken</strong> können.
            </p>
          </div>
          <div className="grid gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/jobs">Alle Stellenangebote ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Aktuelle Stellenangebote
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Die neuesten Positionen aus Medizin, Pflege und Gesundheitswesen –
              <br />
              übersichtlich, transparent und ohne unnötige Hürden.
            </p>
          </div>
          <div className="grid gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/jobs">Alle Stellenangebote ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Closing Emotional Section */}
      <section className="bg-gradient-to-b from-background to-secondary py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Diese Plattform richtet sich an Menschen,
              <br />
              die ihren Beruf ernst nehmen –
              <br />
              und einen Arbeitsplatz suchen, der das auch tut.
            </p>
            <p className="text-2xl font-bold text-foreground md:text-3xl leading-relaxed">
              Finden Sie nicht irgendeinen Job.
              <br />
              Finden Sie einen, der zu Ihnen passt.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
