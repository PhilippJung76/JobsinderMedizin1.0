import { MapPin, Building2, Clock, Banknote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Job, getCategoryLabel } from "@/lib/jobs-data"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium text-primary border-primary/30">
                {getCategoryLabel(job.category)}
              </Badge>
              {job.featured && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  Empfohlen
                </Badge>
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{job.title}</h3>
            <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.type}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  {job.salary}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
