import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Datenschutz | Jobs in der Medizin",
  description: "Datenschutzerklärung von Jobs in der Medizin",
};

export default function DatenschutzPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">Datenschutzerklärung</h1>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="mb-2 text-lg font-medium">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              2. Verantwortliche Stelle
            </h2>
            <p className="mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser
              Website ist:
            </p>
            <address className="mb-4 not-italic">
              <p className="font-medium">Jung & Jung Projekt GmbH</p>
              <p>Goebenstraße 50</p>
              <p>58097 Hagen</p>
              <p className="mt-2">Ansprechpartner: Philipp Jung</p>
              <p>Tel: 0151 23 58 10 44</p>
              <p>E-Mail: datenschutz@jobsindermedizin.de</p>
            </address>
            <p>
              Verantwortliche Stelle ist die natürliche oder juristische Person,
              die allein oder gemeinsam mit anderen über die Zwecke und Mittel
              der Verarbeitung von personenbezogenen Daten entscheidet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              3. Datenerfassung auf dieser Website
            </h2>

            <h3 className="mb-2 text-lg font-medium">Cookies</h3>
            <p className="mb-4">
              Unsere Internetseiten verwenden so genannte "Cookies". Cookies
              sind kleine Datenpakete und richten auf Ihrem Endgerät keinen
              Schaden an. Sie werden entweder vorübergehend für die Dauer einer
              Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf
              Ihrem Endgerät gespeichert.
            </p>

            <h3 className="mb-2 text-lg font-medium">Server-Log-Dateien</h3>
            <p className="mb-4">
              Der Provider der Seiten erhebt und speichert automatisch
              Informationen in so genannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              4. Registrierung und Nutzerkonto
            </h2>
            <p className="mb-4">
              Sie können sich auf dieser Website registrieren, um zusätzliche
              Funktionen auf der Seite zu nutzen. Die dazu eingegebenen Daten
              verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes
              oder Dienstes, für den Sie sich registriert haben.
            </p>
            <p className="mb-4">
              Bei der Registrierung werden folgende Daten erhoben:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1 pl-4">
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
              <li>Vor- und Nachname</li>
              <li>Optional: Telefonnummer, Beruf, Lebenslauf, Profilbild</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">5. Ihre Rechte</h2>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über
              Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht,
              die Berichtigung oder Löschung dieser Daten zu verlangen.
            </p>
            <p className="mb-4">Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden:</p>
            <address className="not-italic">
              <p className="font-medium">Jung & Jung Projekt GmbH</p>
              <p>Goebenstraße 50</p>
              <p>58097 Hagen</p>
              <p className="mt-2">Ansprechpartner: Philipp Jung</p>
              <p>Tel: 0151 23 58 10 44</p>
              <p>E-Mail: datenschutz@jobsindermedizin.de</p>
            </address>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">
              6. Widerspruch gegen Werbe-E-Mails
            </h2>
            <p>
              Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
              Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter
              Werbung und Informationsmaterialien wird hiermit widersprochen.
              Die Betreiber der Seiten behalten sich ausdrücklich rechtliche
              Schritte im Falle der unverlangten Zusendung von
              Werbeinformationen, etwa durch Spam-E-Mails, vor.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
