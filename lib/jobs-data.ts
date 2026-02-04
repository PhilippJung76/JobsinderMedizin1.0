export const JOB_CATEGORIES = [
  { value: "aerzte", label: "Ärzte & Fachärzte" },
  { value: "pflege", label: "Pflegekräfte" },
  { value: "mfa", label: "MFA & Assistenz" },
  { value: "techniker", label: "Techniker & Verwaltung" },
] as const

export type JobCategory = (typeof JOB_CATEGORIES)[number]["value"]

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  category: JobCategory
  featured?: boolean
  postedDate: string
}

export function getCategoryLabel(value: JobCategory): string {
  const category = JOB_CATEGORIES.find((c) => c.value === value)
  return category?.label ?? value
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Facharzt für Innere Medizin",
    company: "Universitätsklinikum Berlin",
    location: "Berlin",
    type: "Vollzeit",
    salary: "90.000 - 120.000 €",
    description: "Wir suchen einen erfahrenen Facharzt für Innere Medizin zur Verstärkung unseres Teams.",
    category: "aerzte",
    featured: true,
    postedDate: "2026-01-25",
  },
  {
    id: "2",
    title: "Pflegefachkraft Intensivstation",
    company: "Klinikum München",
    location: "München",
    type: "Vollzeit",
    salary: "45.000 - 55.000 €",
    description: "Für unsere Intensivstation suchen wir eine engagierte Pflegefachkraft mit Erfahrung.",
    category: "pflege",
    featured: true,
    postedDate: "2026-01-24",
  },
  {
    id: "3",
    title: "Medizinische Fachangestellte (MFA)",
    company: "Hausarztpraxis Dr. Schmidt",
    location: "Hamburg",
    type: "Teilzeit",
    salary: "28.000 - 35.000 €",
    description: "Sympathische Hausarztpraxis sucht MFA für 30 Stunden pro Woche.",
    category: "mfa",
    postedDate: "2026-01-23",
  },
  {
    id: "4",
    title: "Assistenzarzt Chirurgie",
    company: "St. Elisabeth Krankenhaus",
    location: "Köln",
    type: "Vollzeit",
    salary: "65.000 - 80.000 €",
    description: "Weiterbildungsstelle zum Facharzt für Chirurgie in modernem Krankenhaus.",
    category: "aerzte",
    featured: true,
    postedDate: "2026-01-22",
  },
  {
    id: "5",
    title: "Pflegedienstleitung",
    company: "Seniorenresidenz am Park",
    location: "Frankfurt",
    type: "Vollzeit",
    salary: "55.000 - 70.000 €",
    description: "Erfahrene Pflegedienstleitung für moderne Senioreneinrichtung gesucht.",
    category: "pflege",
    postedDate: "2026-01-21",
  },
  {
    id: "6",
    title: "Medizintechniker",
    company: "Kreiskrankenhaus Düsseldorf",
    location: "Düsseldorf",
    type: "Vollzeit",
    salary: "42.000 - 52.000 €",
    description: "Zur Wartung und Betreuung unserer medizinischen Geräte suchen wir einen erfahrenen Techniker.",
    category: "techniker",
    postedDate: "2026-01-20",
  },
]

export function getFeaturedJobs(): Job[] {
  return jobs.filter((job) => job.featured)
}

export function getRecentJobs(count: number): Job[] {
  return [...jobs].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()).slice(0, count)
}
