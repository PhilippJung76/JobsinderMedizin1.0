"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader2 } from "lucide-react";

export default function CompanyRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactPerson: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/unternehmen`,
        data: {
          user_type: "company",
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Notify admin about new company registration
    try {
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "company",
          email: formData.email,
          name: formData.companyName,
        }),
      });
    } catch (notifyError) {
      console.error("Failed to notify admin:", notifyError);
    }

    router.push("/auth/sign-up-success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Unternehmen registrieren</CardTitle>
          <CardDescription>
            Erstellen Sie Ihr Unternehmenskonto und finden Sie qualifizierte Bewerber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="companyName">Firmenname *</Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Muster GmbH"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Ansprechpartner *</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                type="text"
                placeholder="Max Mustermann"
                value={formData.contactPerson}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="kontakt@unternehmen.de"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrieren...
                </>
              ) : (
                "Unternehmen registrieren"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Bereits registriert?{" "}
              <Link
                href="/auth/unternehmen/login"
                className="font-medium text-primary hover:underline"
              >
                Jetzt anmelden
              </Link>
            </p>
            <p className="mt-2 text-muted-foreground">
              <Link
                href="/auth/registrieren"
                className="font-medium text-primary hover:underline"
              >
                Als Bewerber registrieren
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
