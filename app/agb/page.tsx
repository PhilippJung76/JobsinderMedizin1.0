import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "AGB | Jobs in der Medizin",
  description: "Allgemeine Geschäftsbedingungen von Jobs in der Medizin",
};

export default function AGBPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <p className="mb-8 text-muted-foreground">Stand: Januar 2026</p>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">§ 1 Geltungsbereich</h2>
            <p className="mb-4">
              (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle
              Verträge zwischen der Jung & Jung Projekt GmbH, Goebenstraße 50, 58097
              Hagen (nachfolgend "Anbieter") und dem Nutzer (nachfolgend
              "Kunde") über die Nutzung der Plattform "Jobs in der Medizin".
            </p>
            <p className="mb-4">
              (2) Die Plattform richtet sich an Bewerber im Gesundheitswesen
              sowie an Unternehmen, die Stellenangebote im medizinischen Bereich
              veröffentlichen möchten.
            </p>
            <p>
              (3) Abweichende Bedingungen des Kunden werden nicht anerkannt, es
              sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich
              schriftlich zu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 2 Vertragsgegenstand
            </h2>
            <p className="mb-4">
              (1) Der Anbieter stellt eine Online-Plattform zur Verfügung, auf
              der Bewerber ihr Profil erstellen und Unternehmen Stellenangebote
              veröffentlichen können.
            </p>
            <p className="mb-4">
              (2) Die Veröffentlichung von Profilen und Stellenangeboten
              unterliegt einer Prüfung und Freigabe durch den Anbieter.
            </p>
            <p>
              (3) Der Anbieter behält sich vor, Profile und Stellenangebote
              abzulehnen, die nicht den Qualitätsstandards entsprechen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 3 Registrierung und Nutzerkonto
            </h2>
            <p className="mb-4">
              (1) Die Nutzung der Plattform erfordert eine Registrierung. Der
              Kunde verpflichtet sich, bei der Registrierung wahrheitsgemäße
              Angaben zu machen.
            </p>
            <p className="mb-4">
              (2) Der Kunde ist für die Geheimhaltung seiner Zugangsdaten
              verantwortlich und haftet für alle Aktivitäten, die unter seinem
              Nutzerkonto erfolgen.
            </p>
            <p>
              (3) Der Anbieter ist berechtigt, Nutzerkonten zu sperren oder zu
              löschen, wenn gegen diese AGB verstoßen wird.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 4 Qualitätsstandards für Arbeitgeber
            </h2>
            <p className="mb-4">
              (1) Unternehmen, die Stellenangebote veröffentlichen möchten,
              müssen bestimmte Qualitätsstandards erfüllen. Insbesondere werden
              folgende Kriterien geprüft:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
              <li>
                Kununu-Bewertung von mindestens 3,5 Sternen (sofern vorhanden)
              </li>
              <li>Transparente Arbeitsbedingungen</li>
              <li>Faire Vergütung</li>
              <li>Wertschätzende Unternehmenskultur</li>
            </ul>
            <p>
              (2) Der Anbieter behält sich vor, Stellenangebote von Unternehmen
              abzulehnen, die diese Standards nicht erfüllen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 5 Pflichten der Nutzer
            </h2>
            <p className="mb-4">(1) Der Kunde verpflichtet sich:</p>
            <ul className="mb-4 list-inside list-disc space-y-2 pl-4">
              <li>nur wahrheitsgemäße Angaben zu machen</li>
              <li>keine rechtswidrigen Inhalte zu veröffentlichen</li>
              <li>keine Rechte Dritter zu verletzen</li>
              <li>
                die Plattform nicht für unzulässige Zwecke zu missbrauchen
              </li>
            </ul>
            <p>
              (2) Der Kunde ist für alle von ihm eingestellten Inhalte selbst
              verantwortlich.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">§ 6 Haftung</h2>
            <p className="mb-4">
              (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe
              Fahrlässigkeit. Bei leichter Fahrlässigkeit haftet der Anbieter
              nur bei Verletzung wesentlicher Vertragspflichten.
            </p>
            <p className="mb-4">
              (2) Der Anbieter übernimmt keine Gewähr für die Richtigkeit und
              Vollständigkeit der von Nutzern eingestellten Inhalte.
            </p>
            <p>
              (3) Der Anbieter haftet nicht für den Erfolg der Stellenvermittlung.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">§ 7 Datenschutz</h2>
            <p>
              Die Erhebung und Verarbeitung personenbezogener Daten erfolgt
              gemäß unserer Datenschutzerklärung, die unter dem Menüpunkt
              "Datenschutz" einsehbar ist.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 8 Änderung der AGB
            </h2>
            <p className="mb-4">
              (1) Der Anbieter ist berechtigt, diese AGB mit Wirkung für die
              Zukunft zu ändern.
            </p>
            <p>
              (2) Der Anbieter wird den Kunden über Änderungen rechtzeitig
              informieren. Die Änderungen gelten als genehmigt, wenn der Kunde
              nicht innerhalb von vier Wochen nach Zugang der Änderungsmitteilung
              widerspricht.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 9 Kommunikation & Information
            </h2>
            <p className="mb-4">
              (1) Mit der Aufnahme auf unserer Plattform erklären sich die
              teilnehmenden Unternehmen damit einverstanden, dass wir ihnen
              vereinzelt per E-Mail Informationen zusenden dürfen.
            </p>
            <p className="mb-4">
              (2) Diese Informationen stammen ausschließlich von der Jung & Jung Projekt
              GmbH und beziehen sich auf Themen rund um Arbeitsmarkt, Recruiting,
              Fördermöglichkeiten und relevante Entwicklungen im HR-Umfeld.
            </p>
            <p className="mb-4">
              (3) Selbstverständlich erfolgt keine Weitergabe der Kontaktdaten
              an Dritte.
            </p>
            <p>
              (4) Der Erhalt der Informationen kann jederzeit formlos
              widersprochen werden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              § 10 Schlussbestimmungen
            </h2>
            <p className="mb-4">
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter
              Ausschluss des UN-Kaufrechts.
            </p>
            <p className="mb-4">
              (2) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist
              Hagen, sofern der Kunde Kaufmann, juristische Person des
              öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
            </p>
            <p>
              (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
              werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Kontakt</h2>
            <address className="not-italic">
              <p className="font-medium">Jung & Jung Projekt GmbH</p>
              <p>Goebenstraße 50</p>
              <p>58097 Hagen</p>
              <p className="mt-2">Ansprechpartner: Philipp Jung</p>
              <p>Tel: 0151 23 58 10 44</p>
              <p>E-Mail: info@jobsindermedizin.de</p>
            </address>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
