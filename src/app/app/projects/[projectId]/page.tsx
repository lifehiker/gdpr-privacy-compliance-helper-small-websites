"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Globe,
  MapPin,
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  X,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ComplianceScoreCard } from "@/components/projects/ComplianceScoreCard";
import { FindingsTable } from "@/components/projects/FindingsTable";
import { ManualChecklistPanel } from "@/components/projects/ManualChecklistPanel";
import { TaskList } from "@/components/projects/TaskList";
import { EvidencePanel } from "@/components/projects/EvidencePanel";
import { ScanHistoryList } from "@/components/projects/ScanHistoryList";

// --- Type definitions ---

export interface ScanFinding {
  id: string;
  scanRunId: string;
  key: string;
  label: string;
  status: "PASS" | "WARNING" | "FAIL" | "MANUAL_REVIEW";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  details?: string;
  detectedValue?: string;
}

export interface ScanRun {
  id: string;
  projectId: string;
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  score?: number;
  startedAt: string;
  completedAt?: string;
  rawHtmlSnippet?: string;
  summaryJson?: string;
  findings: ScanFinding[];
}

export interface ChecklistItem {
  id: string;
  projectId: string;
  key: string;
  label: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE" | "NOT_APPLICABLE";
  notes?: string;
  dueDate?: string;
  isManual: boolean;
  lastReviewedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  findingKey?: string;
  title: string;
  severity: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "WONT_FIX";
  owner?: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  projectId: string;
  checklistItemId?: string;
  taskId?: string;
  type: string;
  fileName?: string;
  fileUrl?: string;
  sourceUrl?: string;
  note?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  region: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  scanRuns: ScanRun[];
  checklistItems: ChecklistItem[];
  tasks: Task[];
  evidence: Evidence[];
}

const REGIONS = ["EU", "GLOBAL", "US", "UK"];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDomain, setEditDomain] = useState("");
  const [editRegion, setEditRegion] = useState("GLOBAL");
  const [editNotes, setEditNotes] = useState("");

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project");
      const data: Project = await res.json();
      setProject(data);
    } catch {
      toast.error("Could not load project data.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  async function handleExportPdf() {
    setExporting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/export-pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Failed to generate PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? "audit"}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Audit report downloaded.");
    } catch {
      toast.error("Could not export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  function openEdit() {
    if (!project) return;
    setEditName(project.name);
    setEditDomain(project.domain);
    setEditRegion(project.region);
    setEditNotes(project.notes ?? "");
    setEditOpen(true);
  }

  async function handleSaveEdit() {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          domain: editDomain,
          region: editRegion,
          notes: editNotes,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Project updated successfully.");
      setEditOpen(false);
      fetchProject();
    } catch {
      toast.error("Failed to update project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Project deleted.");
      router.push("/app/dashboard");
    } catch {
      toast.error("Failed to delete project.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">This project may have been deleted or you don&apos;t have access.</p>
          <Button className="mt-4" onClick={() => router.push("/app/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const latestScan = project.scanRuns[0] ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <div className="bg-white border-b border-gray-200 sticky top-14 lg:top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.push("/app/dashboard")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={exporting}
              >
                <FileDown className="h-3.5 w-3.5 mr-1.5" />
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
              <Button variant="outline" size="sm" onClick={openEdit}>
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{project.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {project.domain}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.region}
                </Badge>
              </div>
              {project.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.notes}</p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                {" · "}
                Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="tasks">
              Tasks
              {project.tasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {project.tasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ComplianceScoreCard
                  projectId={projectId}
                  latestScan={latestScan}
                  onScanComplete={fetchProject}
                />
              </div>
              <div className="lg:col-span-2">
                <FindingsTable
                  projectId={projectId}
                  latestScan={latestScan}
                  onTasksCreated={fetchProject}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist">
            <ManualChecklistPanel
              projectId={projectId}
              items={project.checklistItems}
              onUpdate={fetchProject}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskList
              projectId={projectId}
              tasks={project.tasks}
              onUpdate={fetchProject}
            />
          </TabsContent>

          <TabsContent value="evidence">
            <EvidencePanel
              projectId={projectId}
              evidence={project.evidence}
              onUpdate={fetchProject}
            />
          </TabsContent>

          <TabsContent value="history">
            <ScanHistoryList scanRuns={project.scanRuns} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-domain">Domain</Label>
              <Input
                id="edit-domain"
                value={editDomain}
                onChange={(e) => setEditDomain(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Region</Label>
              <Select value={editRegion} onValueChange={setEditRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes about this project..."
              />
            </div>
          </div>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                <X className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{project.name}</strong>? This will permanently
              remove all scan history, checklist items, tasks, and evidence. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm" disabled={deleting}>Cancel</Button>
            </DialogClose>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
