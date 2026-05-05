"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Trash2, AlertTriangle, Clock, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AuthRequiredCard } from "@/components/ui/auth-required-card";

// Shape returned by GET /api/projects
interface ScanRun {
  id: string;
  score: number | null;
  startedAt: string;
  status: string;
}

interface Task {
  id: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  domain: string;
  region: string;
  notes: string | null;
  createdAt: string;
  scanRuns: ScanRun[];
  tasks: Task[];
}

type Region = "EU" | "GLOBAL" | "US" | "UK";

const REGION_LABELS: Record<Region, string> = {
  EU: "European Union",
  GLOBAL: "Global",
  US: "United States",
  UK: "United Kingdom",
};

function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) {
    return <span className="text-xs text-gray-400">Not scanned</span>;
  }
  if (score < 40) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
        {score}% — At risk
      </span>
    );
  }
  if (score < 70) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700">
        {score}% — Needs work
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
      {score}% — Good
    </span>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Globe className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No projects yet</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        Add your first website to start tracking GDPR compliance, run automated scans, and manage remediation tasks.
      </p>
      <Button size="sm" className="gap-2" onClick={onNew}>
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [region, setRegion] = useState<Region>("GLOBAL");
  const [notes, setNotes] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setProjects([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setIsAuthenticated(true);
      setProjects(data);
    } catch {
      toast.error("Could not load projects. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function openNew() {
    setName("");
    setDomain("");
    setRegion("GLOBAL");
    setNotes("");
    setDialogOpen(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) {
      toast.error("Name and domain are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), domain: domain.trim(), region, notes: notes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to create project.");
        return;
      }
      toast.success("Project created successfully.");
      setDialogOpen(false);
      await fetchProjects();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error || "Failed to delete project.");
        return;
      }
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await fetchProjects();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor the privacy compliance of your websites.
          </p>
        </div>
        {isAuthenticated && (
          <Button size="sm" className="gap-2" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {!loading && !isAuthenticated ? (
        <AuthRequiredCard
          title="Sign in to manage projects"
          description="Projects are scoped to your account. Sign in to create websites, run scans, and track remediation work."
        />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState onNew={openNew} />
      ) : (
        <>
          {/* Table — desktop */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-4 py-3 font-medium text-gray-500 w-[200px]">Name</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Domain</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Region</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Last Scan</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Score</th>
                        <th className="px-4 py-3 font-medium text-gray-500">Open Tasks</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {projects.map((project) => {
                        const latestScan = project.scanRuns[0];
                        const openTaskCount = project.tasks.length;
                        return (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]">
                              {project.name}
                            </td>
                            <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">
                              {project.domain}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className="font-normal">
                                {project.region}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {latestScan ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  {format(new Date(latestScan.startedAt), "MMM d, yyyy")}
                                </span>
                              ) : (
                                <span className="text-gray-400">Never</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <ScoreBadge score={latestScan?.score} />
                            </td>
                            <td className="px-4 py-3">
                              {openTaskCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 font-medium">
                                  <AlertTriangle className="h-3 w-3" />
                                  {openTaskCount}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 rounded-full px-2 py-0.5 font-medium">
                                  <ShieldCheck className="h-3 w-3" />
                                  0
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteTarget(project)}
                                aria-label={`Delete ${project.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {projects.map((project) => {
              const latestScan = project.scanRuns[0];
              const openTaskCount = project.tasks.length;
              return (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">{project.name}</CardTitle>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{project.domain}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => setDeleteTarget(project)}
                        aria-label={`Delete ${project.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-normal text-xs">{project.region}</Badge>
                    <ScoreBadge score={latestScan?.score} />
                    {openTaskCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        {openTaskCount} task{openTaskCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {latestScan && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {format(new Date(latestScan.startedAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Create project dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">Project Name</Label>
              <Input
                id="proj-name"
                placeholder="My Company Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-domain">Domain</Label>
              <Input
                id="proj-domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-region">Region</Label>
              <select
                id="proj-region"
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                disabled={submitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(Object.entries(REGION_LABELS) as [Region, string][]).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label} ({val})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-notes">
                Notes{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="proj-notes"
                placeholder="Any relevant context about this project..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
              />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>? This will permanently
            remove all scans, tasks, and checklist data. This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
