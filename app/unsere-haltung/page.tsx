import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShieldCheck, Star, Heart, Users, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Unsere Haltung | Jobs in der Medizin",
  description: "Unsere Qualitätsrichtlinie für Arbeitgeber - Warum wir nicht jeden Arbeitgeber akzeptieren und wie wir faire Arbeitsbedingungen fördern.",
};

export default function UnsereHaltungPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Geprüfte Arbeitgeber
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Unsere Haltung
              </h1>
              <p className="text-xl text-muted-foreground">
                Diese Plattform ist <span className="font-semibold text-foreground">bewusst anders</span>.
                <br />
                Wir veröffentlichen Stellenangebote nicht von jedem Unternehmen.
              </p>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Warum?</h2>
                  <p className="text-xl text-foreground">
                    Weil <span className="font-semibold text-primary">gute Arbeit</span> faire Bedingungen verdient.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content - Kununu Schranke */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                  Unsere Qualitätsrichtlinie für Arbeitgeber
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    Wir prüfen Arbeitgeber, <span className="font-semibold text-foreground">bevor</span> sie bei uns inserieren dürfen.
                  </p>
                  <p>
                    Unternehmen mit dauerhaft schlechten Bewertungen auf unabhängigen Bewertungsplattformen
                    (z.B. Kununu oder vergleichbaren Portalen) werden <span className="font-semibold text-foreground">nicht aufgenommen</span>.
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Als Richtwert gilt:</p>
                    <p className="text-muted-foreground">
                      Eine solide, überwiegend positive Arbeitgeberbewertung (z.B. ab ca. 3,5 von 5 Sternen).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Emotional Reasoning */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
                  Unsere Überzeugung
                </h2>
              </div>

              <div className="space-y-6 text-lg">
                <p className="text-center text-muted-foreground">
                  Menschen in Medizin und Pflege tragen täglich Verantwortung –
                  <br />
                  für Patienten, Angehörige und Kolleg:innen.
                </p>

                <Card className="border-primary/20">
                  <CardContent className="p-8">
                    <p className="text-center text-lg text-foreground">
                      Wir sind der Überzeugung:
                      <br />
                      <span className="mt-2 block text-xl font-semibold text-primary">
                        Wer diese Arbeit leistet, sollte nicht zusätzlich unter schlechten Arbeitsbedingungen leiden.
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <p className="text-center text-muted-foreground">
                  Deshalb geben wir Arbeitgebern mit einem problematischen Standing
                  <br />
                  in der Mitarbeiterschaft <span className="font-semibold text-foreground">keine Bühne</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Clarification */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Card>
                <CardContent className="p-8">
                  <h3 className="mb-4 text-xl font-semibold text-foreground">Klarstellung</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Diese Plattform ersetzt keine unabhängigen Bewertungsportale.
                      Aber wir nutzen deren Rückmeldungen als Orientierung,
                      um eine <span className="font-semibold text-foreground">faire Vorauswahl</span> zu treffen.
                    </p>
                    <p>
                      Unser Ziel ist kein Perfektionismus –
                      <br />
                      sondern <span className="font-semibold text-primary">Respekt</span>, <span className="font-semibold text-primary">Transparenz</span> und <span className="font-semibold text-primary">Mindeststandards</span>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Badge/Trust Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Geprüfte Arbeitgeber</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Bei uns inserieren nur Unternehmen,
                      die von ihren Mitarbeitenden überwiegend positiv bewertet werden.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <Users className="h-8 w-8 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Auf Ihrer Seite</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Diese Plattform steht auf der Seite der Beschäftigten.
                      Nicht auf der Seite von schlechten Strukturen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Strong Statement */}
        <section className="bg-foreground py-16 text-background">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Nicht jeder Arbeitgeber passt zu uns.
              </h2>
              <p className="mb-8 text-xl opacity-90">
                Und das ist Absicht.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/jobs">
                  Jobs durchsuchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
