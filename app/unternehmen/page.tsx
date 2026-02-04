"use client";

import React from "react"

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Upload,
  Loader2,
  LogOut,
  Save,
  User,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Briefcase,
  Plus,
  Clock,
  Eye,
  Trash2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { JOB_CATEGORIES, getCategoryLabel, type JobCategory } from "@/lib/jobs-data";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface CompanyProfile {
  id: string;
  company_name: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  street: string | null;
  zip_code: string | null;
  city: string | null;
  description: string | null;
  logo_url: string | null;
  is_profile_public: boolean;
}

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string | null;
  category: JobCategory;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function CompanyDashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    job_type: "Vollzeit",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    category: "aerzte" as JobCategory,
  });
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  }, [supabase]);

  const fetchJobs = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return;
    }

    setJobs(data || []);
  }, [supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/unternehmen/login");
        return;
      }

      // Check if this is a company user
      if (user.user_metadata?.user_type !== "company") {
        router.push("/bewerber");
        return;
      }

      setUser(user);
      await Promise.all([fetchProfile(user.id), fetchJobs(user.id)]);
      setIsLoading(false);
    };

    checkUser();
  }, [supabase, router, fetchProfile, fetchJobs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    setSaveSuccess(false);

    const { error } = await supabase
      .from("company_profiles")
      .update({
        company_name: profile.company_name,
        contact_person: profile.contact_person,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        street: profile.street,
        zip_code: profile.zip_code,
        city: profile.city,
        description: profile.description,
        is_profile_public: profile.is_profile_public,
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (error) {
      console.error("Error saving profile:", error);
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/logo.${fileExt}`;

    setIsUploadingLogo(true);

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      setIsUploadingLogo(false);
      return;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("company-logos").getPublicUrl(fileName);

    // Update profile with logo URL
    const { error: updateError } = await supabase
      .from("company_profiles")
      .update({ logo_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating logo URL:", updateError);
      setIsUploadingLogo(false);
      return;
    }

    setProfile({ ...profile!, logo_url: publicUrl });
    setIsUploadingLogo(false);
  };

  const updateProfile = (field: keyof CompanyProfile, value: string | boolean) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleCreateJob = async () => {
    if (!user) return;

    setIsCreatingJob(true);

    const { error } = await supabase.from("jobs").insert({
      company_id: user.id,
      title: newJob.title,
      location: newJob.location,
      job_type: newJob.job_type,
      salary_min: newJob.salary_min ? Number.parseInt(newJob.salary_min) : null,
      salary_max: newJob.salary_max ? Number.parseInt(newJob.salary_max) : null,
      description: newJob.description,
      requirements: newJob.requirements || null,
      category: newJob.category,
      approval_status: "pending",
    });

    setIsCreatingJob(false);

    if (error) {
      console.error("Error creating job:", error);
      return;
    }

    setShowJobDialog(false);
    setNewJob({
      title: "",
      location: "",
      job_type: "Vollzeit",
      salary_min: "",
      salary_max: "",
      description: "",
      requirements: "",
      category: "aerzte",
    });
    await fetchJobs(user.id);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!user) return;

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      console.error("Error deleting job:", error);
      return;
    }

    await fetchJobs(user.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Freigegeben</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Abgelehnt</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Prüfung ausstehend</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">MedJobs</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile.company_name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Unternehmensbereich
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verwalten Sie Ihr Unternehmensprofil und präsentieren Sie sich potenziellen Bewerbern
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Unternehmensprofil</TabsTrigger>
            <TabsTrigger value="jobs">Stellenangebote</TabsTrigger>
            <TabsTrigger value="candidates">Bewerbersuche</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Logo Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Firmenlogo</CardTitle>
                  <CardDescription>
                    Laden Sie Ihr Firmenlogo hoch
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted">
                    {profile.logo_url ? (
                      <Image
                        src={profile.logo_url || "/placeholder.svg"}
                        alt="Firmenlogo"
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Building2 className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      {isUploadingLogo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Logo hochladen
                    </div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                    />
                  </Label>
                </CardContent>
              </Card>

              {/* Company Info Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Unternehmensdaten</CardTitle>
                  <CardDescription>
                    Grundlegende Informationen über Ihr Unternehmen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        <Building2 className="mr-2 inline h-4 w-4" />
                        Firmenname
                      </Label>
                      <Input
                        id="companyName"
                        value={profile.company_name || ""}
                        onChange={(e) =>
                          updateProfile("company_name", e.target.value)
                        }
                        placeholder="Muster GmbH"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">
                        <User className="mr-2 inline h-4 w-4" />
                        Ansprechpartner
                      </Label>
                      <Input
                        id="contactPerson"
                        value={profile.contact_person || ""}
                        onChange={(e) =>
                          updateProfile("contact_person", e.target.value)
                        }
                        placeholder="Max Mustermann"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="mr-2 inline h-4 w-4" />
                        E-Mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email || ""}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        placeholder="kontakt@unternehmen.de"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="mr-2 inline h-4 w-4" />
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone || ""}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        placeholder="+49 123 456789"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">
                      <Globe className="mr-2 inline h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website || ""}
                      onChange={(e) => updateProfile("website", e.target.value)}
                      placeholder="https://www.beispiel.de"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <MapPin className="mr-2 inline h-5 w-5" />
                  Adresse
                </CardTitle>
                <CardDescription>
                  Standort Ihres Unternehmens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="street">Straße und Hausnummer</Label>
                    <Input
                      id="street"
                      value={profile.street || ""}
                      onChange={(e) => updateProfile("street", e.target.value)}
                      placeholder="Musterstraße 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">PLZ</Label>
                    <Input
                      id="zipCode"
                      value={profile.zip_code || ""}
                      onChange={(e) => updateProfile("zip_code", e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-3">
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      value={profile.city || ""}
                      onChange={(e) => updateProfile("city", e.target.value)}
                      placeholder="Berlin"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <FileText className="mr-2 inline h-5 w-5" />
                  Über Ihr Unternehmen
                </CardTitle>
                <CardDescription>
                  Beschreiben Sie Ihr Unternehmen, um Bewerber zu informieren
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={profile.description || ""}
                  onChange={(e) => updateProfile("description", e.target.value)}
                  placeholder="Erzählen Sie potenziellen Bewerbern etwas über Ihr Unternehmen, Ihre Werte, Ihre Arbeitskultur und was Sie als Arbeitgeber auszeichnet..."
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </Button>
              {saveSuccess && (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Erfolgreich gespeichert
                </span>
              )}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Ihre Stellenangebote</h2>
                <p className="text-sm text-muted-foreground">
                  Verwalten Sie Ihre ausgeschriebenen Stellen
                </p>
              </div>
              <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Stelle erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Neue Stelle erstellen</DialogTitle>
                    <DialogDescription>
                      Erstellen Sie eine neue Stellenanzeige. Nach der Erstellung wird diese von uns geprüft und freigegeben.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Stellenbezeichnung *</Label>
                      <Input
                        id="jobTitle"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="z.B. Facharzt für Innere Medizin"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="jobCategory">Kategorie *</Label>
                        <Select
                          value={newJob.category}
                          onValueChange={(value) => setNewJob({ ...newJob, category: value as JobCategory })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Kategorie wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobType">Beschäftigungsart *</Label>
                        <Select
                          value={newJob.job_type}
                          onValueChange={(value) => setNewJob({ ...newJob, job_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Art wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Vollzeit">Vollzeit</SelectItem>
                            <SelectItem value="Teilzeit">Teilzeit</SelectItem>
                            <SelectItem value="Minijob">Minijob</SelectItem>
                            <SelectItem value="Befristet">Befristet</SelectItem>
                            <SelectItem value="Praktikum">Praktikum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobLocation">Standort *</Label>
                      <Input
                        id="jobLocation"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="z.B. Berlin"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="salaryMin">Gehalt von (€/Jahr)</Label>
                        <Input
                          id="salaryMin"
                          type="number"
                          value={newJob.salary_min}
                          onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })}
                          placeholder="z.B. 50000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryMax">Gehalt bis (€/Jahr)</Label>
                        <Input
                          id="salaryMax"
                          type="number"
                          value={newJob.salary_max}
                          onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })}
                          placeholder="z.B. 70000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobDescription">Stellenbeschreibung *</Label>
                      <Textarea
                        id="jobDescription"
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Beschreiben Sie die Stelle, Aufgaben und was Sie bieten..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobRequirements">Anforderungen</Label>
                      <Textarea
                        id="jobRequirements"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        placeholder="Welche Qualifikationen und Erfahrungen erwarten Sie?"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowJobDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button
                      onClick={handleCreateJob}
                      disabled={isCreatingJob || !newJob.title || !newJob.location || !newJob.description}
                    >
                      {isCreatingJob ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Erstellen...
                        </>
                      ) : (
                        "Stelle erstellen"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium">Keine Stellenangebote</h3>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Sie haben noch keine Stellenangebote erstellt. Erstellen Sie jetzt Ihre erste Stelle.
                  </p>
                  <Button onClick={() => setShowJobDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Erste Stelle erstellen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(job.category)}
                            </Badge>
                            {getStatusBadge(job.approval_status)}
                          </div>
                          <h3 className="mb-1 text-lg font-semibold">{job.title}</h3>
                          <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.job_type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(job.created_at).toLocaleDateString("de-DE")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Bewerber finden
                </CardTitle>
                <CardDescription>
                  Durchsuchen Sie anonymisierte Bewerberprofile und kontaktieren Sie interessante Kandidaten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h4 className="mb-2 font-medium text-primary">Datenschutz-Hinweis</h4>
                  <p className="text-sm text-muted-foreground">
                    Zum Schutz der Privatsphäre unserer Bewerber werden Namen anonymisiert angezeigt. 
                    Sichtbar sind das Profilbild, die berufliche Laufbahn und die E-Mail-Adresse zur 
                    Kontaktaufnahme.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/unternehmen/bewerber">
                    <Users className="mr-2 h-4 w-4" />
                    Zur Bewerbersuche
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sichtbarkeit</CardTitle>
                <CardDescription>
                  Steuern Sie, ob Ihr Unternehmensprofil für Bewerber sichtbar ist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Profil öffentlich anzeigen</p>
                    <p className="text-sm text-muted-foreground">
                      Wenn aktiviert, können Bewerber Ihr Unternehmensprofil sehen
                    </p>
                  </div>
                  <Switch
                    checked={profile.is_profile_public}
                    onCheckedChange={(checked) =>
                      updateProfile("is_profile_public", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Konto</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre Kontoeinstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">E-Mail-Adresse</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
