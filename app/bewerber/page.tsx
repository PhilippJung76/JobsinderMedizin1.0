"use client";

import React from "react"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  Upload,
  User,
  FileText,
  Trash2,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const PROFESSIONS = [
  { value: "arzt", label: "Arzt/Ärztin" },
  { value: "pflege", label: "Pflegekraft" },
  { value: "mfa", label: "Medizinische/r Fachangestellte/r" },
  { value: "verwaltung", label: "Verwaltung" },
  { value: "technik", label: "Medizintechnik" },
  { value: "therapie", label: "Therapeut/in" },
  { value: "sonstige", label: "Sonstige" },
];

const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "0-1 Jahre" },
  { value: "1-3", label: "1-3 Jahre" },
  { value: "3-5", label: "3-5 Jahre" },
  { value: "5-10", label: "5-10 Jahre" },
  { value: "10+", label: "Mehr als 10 Jahre" },
];

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profession: string;
  experience: string;
  education: string;
  about_me: string;
  city: string;
  profile_image_url: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  profile_public: boolean;
}

export default function ApplicantDashboard() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("applicant_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({
          id: user.id,
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          profession: user.user_metadata?.profession || "",
          experience: "",
          education: "",
          about_me: "",
          city: user.user_metadata?.city || "",
          profile_image_url: null,
          resume_url: null,
          resume_filename: null,
          profile_public: false,
        });
      }

      setIsLoading(false);
    };

    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    setProfile((prev) => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!profile) return;
    setProfile((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setIsSaving(true);
    setMessage(null);

    const { error } = await supabase.from("applicant_profiles").upsert({
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      profession: profile.profession,
      experience: profile.experience,
      education: profile.education,
      about_me: profile.about_me,
      city: profile.city,
      profile_image_url: profile.profile_image_url,
      resume_url: profile.resume_url,
      resume_filename: profile.resume_filename,
      profile_public: profile.profile_public,
    });

    if (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern: " + error.message });
    } else {
      setMessage({ type: "success", text: "Profil erfolgreich gespeichert!" });
    }

    setIsSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("applicant-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage({ type: "error", text: "Fehler beim Hochladen des Bildes" });
      setUploadingImage(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("applicant-files")
      .getPublicUrl(filePath);

    setProfile((prev) => ({
      ...prev!,
      profile_image_url: urlData.publicUrl,
    }));

    setUploadingImage(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingResume(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/resume.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("applicant-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage({ type: "error", text: "Fehler beim Hochladen des Lebenslaufs" });
      setUploadingResume(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("applicant-files")
      .getPublicUrl(filePath);

    setProfile((prev) => ({
      ...prev!,
      resume_url: urlData.publicUrl,
      resume_filename: file.name,
    }));

    setUploadingResume(false);
  };

  const handleDeleteResume = async () => {
    if (!user || !profile?.resume_url) return;

    const filePath = profile.resume_url.split("/").slice(-2).join("/");

    await supabase.storage.from("applicant-files").remove([filePath]);

    setProfile((prev) => ({
      ...prev!,
      resume_url: null,
      resume_filename: null,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Bewerberbereich</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {message && (
            <div
              className={`p-4 rounded-md flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profilbild
              </CardTitle>
              <CardDescription>
                Laden Sie ein professionelles Foto hoch
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.profile_image_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.first_name?.[0]}
                  {profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="profile-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Bild hochladen
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG oder GIF (max. 5MB)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persönliche Daten</CardTitle>
              <CardDescription>
                Ihre grundlegenden Kontaktinformationen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Vorname *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile?.first_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nachname *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile?.last_name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile?.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile?.phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Stadt</Label>
                <Input
                  id="city"
                  name="city"
                  value={profile?.city || ""}
                  onChange={handleChange}
                  placeholder="z.B. Berlin"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Berufliche Informationen</CardTitle>
              <CardDescription>
                Ihre Qualifikationen und Erfahrungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Berufsbezeichnung *</Label>
                  <Select
                    value={profile?.profession || ""}
                    onValueChange={(value) =>
                      handleSelectChange("profession", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie Ihren Beruf" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONS.map((prof) => (
                        <SelectItem key={prof.value} value={prof.value}>
                          {prof.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Berufserfahrung</Label>
                  <Select
                    value={profile?.experience || ""}
                    onValueChange={(value) =>
                      handleSelectChange("experience", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie Ihre Erfahrung" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <SelectItem key={exp.value} value={exp.value}>
                          {exp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Ausbildung / Studium</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={profile?.education || ""}
                  onChange={handleChange}
                  placeholder="z.B. Medizinstudium an der Charité Berlin, Abschluss 2020"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_me">Über mich</Label>
                <Textarea
                  id="about_me"
                  name="about_me"
                  value={profile?.about_me || ""}
                  onChange={handleChange}
                  placeholder="Beschreiben Sie sich kurz und Ihre beruflichen Ziele..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lebenslauf
              </CardTitle>
              <CardDescription>
                Laden Sie Ihren aktuellen Lebenslauf hoch
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.resume_url ? (
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{profile.resume_filename}</p>
                      <a
                        href={profile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Anzeigen
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteResume}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Label
                    htmlFor="resume"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {uploadingResume ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Lebenslauf hochladen
                  </Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    PDF, DOC oder DOCX (max. 10MB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sichtbarkeit</CardTitle>
              <CardDescription>
                Entscheiden Sie, ob Ihr Profil öffentlich sichtbar sein soll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="profile_public"
                  checked={profile?.profile_public || false}
                  onCheckedChange={(checked) =>
                    setProfile((prev) => ({
                      ...prev!,
                      profile_public: checked as boolean,
                    }))
                  }
                />
                <div>
                  <Label htmlFor="profile_public" className="font-medium">
                    Profil für Arbeitgeber sichtbar machen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Wenn aktiviert, können Arbeitgeber Ihr Profil in der
                    Bewerbersuche finden und Sie direkt kontaktieren.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              Zur Startseite
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                "Profil speichern"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
