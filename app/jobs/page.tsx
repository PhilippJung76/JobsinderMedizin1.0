"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JOB_CATEGORIES, getCategoryLabel, type JobCategory } from "@/lib/jobs-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, Clock, Banknote, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DatabaseJob {
  id: string
  title: string
  company_id: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  description: string
  category: JobCategory
  created_at: string
  company_profiles?: { company_name: string }
}

export default function JobsPage() {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "all">("all")
  const [jobs, setJobs] = useState<DatabaseJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("jobs")
      .select("*, company_profiles(company_name)")
      .eq("approval_status", "approved")
      .order("created_at", { ascending: false })

    if (data && !error) {
      setJobs(data)
    }
    setIsLoading(false)
  }

  const filteredJobs = selectedCategory === "all" 
    ? jobs 
    : jobs.filter((job) => job.category === selectedCategory)

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null
    if (min && max) return `${min.toLocaleString("de-DE")} - ${max.toLocaleString("de-DE")} €`
    if (min) return `ab ${min.toLocaleString("de-DE")} €`
    if (max) return `bis ${max.toLocaleString("de-DE")} €`
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Stellenangebote</h1>
            <p className="text-muted-foreground">
              {filteredJobs.length} Stellenangebote im Gesundheitswesen verfügbar
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Alle Kategorien
            </Button>
            {JOB_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-medium text-primary border-primary/30">
                            {getCategoryLabel(job.category)}
                          </Badge>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{job.title}</h3>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.company_profiles?.company_name || "Unternehmen"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.job_type}
                          </span>
                          {formatSalary(job.salary_min, job.salary_max) && (
                            <span className="flex items-center gap-1">
                              <Banknote className="h-4 w-4" />
                              {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredJobs.length === 0 && (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">
                    Keine Stellenangebote in dieser Kategorie gefunden.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
