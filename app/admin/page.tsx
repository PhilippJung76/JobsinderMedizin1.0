"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  Check,
  X,
  Loader2,
  Eye,
  Clock,
  LogOut,
  Bell,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profession: string;
  city: string;
  approval_status: ApprovalStatus;
  created_at: string;
}

interface Company {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  approval_status: ApprovalStatus;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  company_id: string;
  location: string;
  job_type: string;
  category: string;
  approval_status: ApprovalStatus;
  created_at: string;
  company_profiles?: { company_name: string };
}

interface Notification {
  id: string;
  notification_type: string;
  subject: string;
  content: string;
  sent_at: string;
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applicants");
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    type: "applicant" | "company" | "job";
    id: string;
  }>({ open: false, type: "applicant", id: "" });
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!adminData) {
      router.push("/admin/login");
      return;
    }

    setIsAdmin(true);
    await loadData();
  };

  const loadData = async () => {
    setIsLoading(true);

    const [applicantsRes, companiesRes, jobsRes, notificationsRes] = await Promise.all([
      supabase
        .from("applicant_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("company_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("jobs")
        .select("*, company_profiles(company_name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("notification_logs")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(50),
    ]);

    if (applicantsRes.data) setApplicants(applicantsRes.data);
    if (companiesRes.data) setCompanies(companiesRes.data);
    if (jobsRes.data) setJobs(jobsRes.data);
    if (notificationsRes.data) setNotifications(notificationsRes.data);

    setIsLoading(false);
  };

  const handleApprove = async (type: "applicant" | "company" | "job", id: string) => {
    setActionLoading(id);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const table =
      type === "applicant" ? "applicant_profiles" : type === "company" ? "company_profiles" : "jobs";

    await supabase
      .from(table)
      .update({
        approval_status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
      })
      .eq("id", id);

    await loadData();
    setActionLoading(null);
  };

  const handleReject = async () => {
    setActionLoading(rejectDialog.id);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const table =
      rejectDialog.type === "applicant"
        ? "applicant_profiles"
        : rejectDialog.type === "company"
          ? "company_profiles"
          : "jobs";

    await supabase
      .from(table)
      .update({
        approval_status: "rejected",
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
        rejection_reason: rejectionReason,
      })
      .eq("id", rejectDialog.id);

    setRejectDialog({ open: false, type: "applicant", id: "" });
    setRejectionReason("");
    await loadData();
    setActionLoading(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Freigegeben</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Abgelehnt</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
    }
  };

  const pendingApplicants = applicants.filter((a) => a.approval_status === "pending").length;
  const pendingCompanies = companies.filter((c) => c.approval_status === "pending").length;
  const pendingJobs = jobs.filter((j) => j.approval_status === "pending").length;

  if (isAdmin === null || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bewerber</p>
                <p className="text-2xl font-bold">{applicants.length}</p>
                {pendingApplicants > 0 && (
                  <p className="text-xs text-yellow-600">{pendingApplicants} ausstehend</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unternehmen</p>
                <p className="text-2xl font-bold">{companies.length}</p>
                {pendingCompanies > 0 && (
                  <p className="text-xs text-yellow-600">{pendingCompanies} ausstehend</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stellenangebote</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
                {pendingJobs > 0 && (
                  <p className="text-xs text-yellow-600">{pendingJobs} ausstehend</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Benachrichtigungen</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="applicants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Bewerber
              {pendingApplicants > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingApplicants}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unternehmen
              {pendingCompanies > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingCompanies}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Stellenangebote
              {pendingJobs > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {pendingJobs}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Benachrichtigungen
            </TabsTrigger>
          </TabsList>

          {/* Applicants Tab */}
          <TabsContent value="applicants">
            <Card>
              <CardHeader>
                <CardTitle>Bewerber-Profile</CardTitle>
                <CardDescription>
                  Verwalten und genehmigen Sie Bewerberprofile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicants.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Keine Bewerber vorhanden
                    </p>
                  ) : (
                    applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">
                              {applicant.first_name} {applicant.last_name}
                            </h3>
                            {getStatusBadge(applicant.approval_status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {applicant.email} | {applicant.profession} | {applicant.city}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(applicant.created_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {applicant.approval_status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove("applicant", applicant.id)}
                                disabled={actionLoading === applicant.id}
                              >
                                {actionLoading === applicant.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setRejectDialog({
                                    open: true,
                                    type: "applicant",
                                    id: applicant.id,
                                  })
                                }
                                disabled={actionLoading === applicant.id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Unternehmens-Profile</CardTitle>
                <CardDescription>
                  Verwalten und genehmigen Sie Unternehmensprofile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Keine Unternehmen vorhanden
                    </p>
                  ) : (
                    companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{company.company_name}</h3>
                            {getStatusBadge(company.approval_status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {company.contact_person} | {company.email} | {company.city}
                          </p>
                          {company.website && (
                            <p className="text-xs text-primary">{company.website}</p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(company.created_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {company.approval_status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove("company", company.id)}
                                disabled={actionLoading === company.id}
                              >
                                {actionLoading === company.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setRejectDialog({
                                    open: true,
                                    type: "company",
                                    id: company.id,
                                  })
                                }
                                disabled={actionLoading === company.id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Stellenangebote</CardTitle>
                <CardDescription>
                  Verwalten und genehmigen Sie Stellenangebote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Keine Stellenangebote vorhanden
                    </p>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{job.title}</h3>
                            {getStatusBadge(job.approval_status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.company_profiles?.company_name || "Unbekanntes Unternehmen"} |{" "}
                            {job.location} | {job.job_type}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(job.created_at).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.approval_status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove("job", job.id)}
                                disabled={actionLoading === job.id}
                              >
                                {actionLoading === job.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setRejectDialog({
                                    open: true,
                                    type: "job",
                                    id: job.id,
                                  })
                                }
                                disabled={actionLoading === job.id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
                <CardDescription>
                  Übersicht über alle System-Benachrichtigungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Keine Benachrichtigungen vorhanden
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-4 rounded-lg border p-4"
                      >
                        <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{notification.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.sent_at).toLocaleString("de-DE")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ablehnung begründen</DialogTitle>
            <DialogDescription>
              Bitte geben Sie einen Grund für die Ablehnung an.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Ablehnungsgrund</Label>
              <Textarea
                id="reason"
                placeholder="Bitte geben Sie den Grund für die Ablehnung ein..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ ...rejectDialog, open: false })}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Ablehnen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
