import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Impressum | Jobs in der Medizin",
  description: "Impressum und rechtliche Angaben zu Jobs in der Medizin",
};

export default function ImpressumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">Impressum</h1>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
            <address className="not-italic">
              <p className="font-medium">Jung & Jung Projekt GmbH</p>
              <p>Goebenstraße 50</p>
              <p>58097 Hagen</p>
            </address>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Vertreten durch</h2>
            <p>Snezana Jung (Geschäftsführerin)</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Kontakt</h2>
            <p>Telefon: 0151 23 58 10 44</p>
            <p>E-Mail: info@jobsindermedizin.de</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Registereintrag</h2>
            <p>Eintragung im Handelsregister.</p>
            <p>Registergericht: Amtsgericht Hagen</p>
            <p>Registernummer: HRB 10971</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            </p>
            <p>DE341551758</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>Snezana Jung</p>
            <p>Goebenstraße 50</p>
            <p>58097 Hagen</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Streitschlichtung</h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Haftung für Inhalte</h2>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
              auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
              §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
              Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Haftung für Links</h2>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
              fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
              mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
              Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
              inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
              Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
              Bekanntwerden von Rechtsverletzungen werden wir derartige Links
              umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Urheberrecht</h2>
            <p className="mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
              Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
              Dritter beachtet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
