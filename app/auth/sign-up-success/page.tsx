import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Vielen Dank für Ihre Registrierung!
              </CardTitle>
              <CardDescription>Bitte bestätigen Sie Ihre E-Mail</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sie haben sich erfolgreich registriert. Bitte überprüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre E-Mail-Adresse, um sich anmelden zu können.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
