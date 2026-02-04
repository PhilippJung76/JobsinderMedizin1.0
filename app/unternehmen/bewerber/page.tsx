"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Search,
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  User,
  Lock,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const PROFESSIONS = [
  { value: "arzt", label: "Arzt/Ärztin" },
  { value: "pflege", label: "Pflegekraft" },
  { value: "mfa", label: "Medizinische/r Fachangestellte/r" },
  { value: "verwaltung", label: "Verwaltung" },
  { value: "technik", label: "Medizintechnik" },
  { value: "techniker", label: "Techniker/in" },
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

interface ApplicantProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  profession: string | null;
  experience: string | null;
  education: string | null;
  about_me: string | null;
  city: string | null;
  profile_image_url: string | null;
}

// Function to mask a name with asterisks
function maskName(name: string | null): string {
  if (!name) return "***";
  return "*".repeat(name.length);
}

// Function to get profession label
function getProfessionLabel(value: string | null): string {
  if (!value) return "Nicht angegeben";
  const profession = PROFESSIONS.find((p) => p.value === value);
  return profession?.label || value;
}

// Function to get experience label
function getExperienceLabel(value: string | null): string {
  if (!value) return "Nicht angegeben";
  const experience = EXPERIENCE_LEVELS.find((e) => e.value === value);
  return experience?.label || value;
}

export default function CandidateBrowserPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isCompany, setIsCompany] = useState(false);
  const [candidates, setCandidates] = useState<ApplicantProfile[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<ApplicantProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");

  const router = useRouter();
  const supabase = createClient();

  const fetchCandidates = useCallback(async () => {
    // Fetch only approved and public profiles
    // Only select fields that employers are allowed to see
    const { data, error } = await supabase
      .from("applicant_profiles")
      .select("id, first_name, last_name, email, profession, experience, education, about_me, city, profile_image_url")
      .eq("approval_status", "approved")
      .eq("is_profile_public", true);

    if (error) {
      console.error("Error fetching candidates:", error);
      return;
    }

    setCandidates(data || []);
    setFilteredCandidates(data || []);
  }, [supabase]);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/unternehmen/login");
        return;
      }

      setUser(user);

      // Check if user is a company
      const { data: companyProfile } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!companyProfile) {
        // Not a company, redirect
        router.push("/auth/unternehmen/login");
        return;
      }

      setIsCompany(true);
      await fetchCandidates();
      setIsLoading(false);
    };

    checkUserAndFetch();
  }, [supabase, router, fetchCandidates]);

  // Filter candidates based on search and filters
  useEffect(() => {
    let filtered = [...candidates];

    // Filter by profession
    if (professionFilter && professionFilter !== "all") {
      filtered = filtered.filter((c) => c.profession === professionFilter);
    }

    // Filter by experience
    if (experienceFilter && experienceFilter !== "all") {
      filtered = filtered.filter((c) => c.experience === experienceFilter);
    }

    // Filter by search term (searches in education and about_me)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.education?.toLowerCase().includes(term) ||
          c.about_me?.toLowerCase().includes(term) ||
          c.city?.toLowerCase().includes(term)
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, professionFilter, experienceFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isCompany) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/unternehmen">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück zum Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Bewerbersuche</h1>
          <p className="text-muted-foreground">
            Durchsuchen Sie anonymisierte Bewerberprofile und kontaktieren Sie interessante Kandidaten.
          </p>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 p-6">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="mb-1 font-semibold text-primary">Datenschutz-Hinweis</h3>
              <p className="text-sm text-muted-foreground">
                Zum Schutz der Privatsphäre unserer Bewerber werden Namen anonymisiert angezeigt. 
                Sichtbar sind das Profilbild, die berufliche Laufbahn und die E-Mail-Adresse zur 
                Kontaktaufnahme. Die Kommunikation erfolgt ausschließlich per E-Mail außerhalb der Plattform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter & Suche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stichwortsuche</label>
                <Input
                  placeholder="Suche in Ausbildung, Beschreibung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Berufsgruppe</label>
                <Select value={professionFilter} onValueChange={setProfessionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Berufsgruppen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Berufsgruppen</SelectItem>
                    {PROFESSIONS.map((prof) => (
                      <SelectItem key={prof.value} value={prof.value}>
                        {prof.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Berufserfahrung</label>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Erfahrungsstufen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Erfahrungsstufen</SelectItem>
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <SelectItem key={exp.value} value={exp.value}>
                        {exp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredCandidates.length} {filteredCandidates.length === 1 ? "Bewerber" : "Bewerber"} gefunden
        </div>

        {/* Candidate Cards */}
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">Keine Bewerber gefunden</h3>
              <p className="text-center text-sm text-muted-foreground">
                Passen Sie Ihre Filterkriterien an oder versuchen Sie es später erneut.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    {/* Profile Avatar */}
                    <Avatar className="h-16 w-16 border-2 border-muted">
                      {candidate.profile_image_url && (
                        <AvatarImage src={candidate.profile_image_url || "/placeholder.svg"} alt="Profilbild" />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {/* Masked Name */}
                      <CardTitle className="mb-1 text-lg font-mono">
                        {maskName(candidate.first_name)} {maskName(candidate.last_name)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {getProfessionLabel(candidate.profession)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Info - This IS visible */}
                  <div className="space-y-3">
                    {candidate.experience && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Erfahrung: {getExperienceLabel(candidate.experience)}</span>
                      </div>
                    )}
                    {candidate.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Region: {candidate.city}</span>
                      </div>
                    )}
                    {candidate.education && (
                      <div className="flex items-start gap-2 text-sm">
                        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-2">{candidate.education}</span>
                      </div>
                    )}
                  </div>

                  {/* About Me / Career */}
                  {candidate.about_me && (
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {candidate.about_me}
                      </p>
                    </div>
                  )}

                  {/* Contact - Email only */}
                  {candidate.email && (
                    <div className="pt-2">
                      <Button asChild className="w-full">
                        <a href={`mailto:${candidate.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Kontakt aufnehmen
                        </a>
                      </Button>
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        Kontakt erfolgt per E-Mail außerhalb der Plattform
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
