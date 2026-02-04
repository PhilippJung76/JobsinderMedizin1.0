import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jobsindermedizin.de"

export async function POST(request: Request) {
  try {
    const { type, userId, email, name } = await request.json()

    const supabase = await createClient()

    // Log the notification
    await supabase.from("notification_logs").insert({
      notification_type: type === "applicant" ? "new_applicant" : "new_company",
      recipient_email: ADMIN_EMAIL,
      subject:
        type === "applicant"
          ? `Neue Bewerber-Registrierung: ${name || email}`
          : `Neue Unternehmens-Registrierung: ${name || email}`,
      content: JSON.stringify({
        user_id: userId,
        email,
        name,
        type,
        registered_at: new Date().toISOString(),
      }),
      sent_at: new Date().toISOString(),
    })

    // In production, you would send an actual email here using a service like Resend, SendGrid, etc.
    // For now, we log it to the database for the admin to see
    console.log(`[v0] Admin notification logged for ${type}: ${email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error logging notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
