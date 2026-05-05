"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ClipboardList, ChevronDown, ChevronUp, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Task } from "@/app/app/projects/[projectId]/page";

interface Props {
  projectId: string;
  tasks: Task[];
  onUpdate: () => void;
}

type TaskStatus = Task["status"];

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-red-100 text-red-700 border-red-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700 border-blue-200" },
  DONE: { label: "Done", className: "bg-green-100 text-green-700 border-green-200" },
  WONT_FIX: { label: "Won't Fix", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const ALL_STATUSES: TaskStatus[] = ["OPEN", "IN_PROGRESS", "DONE", "WONT_FIX"];

const SEVERITY_CONFIG: Record<string, { className: string }> = {
  CRITICAL: { className: "bg-red-100 text-red-700 border-red-200" },
  HIGH: { className: "bg-orange-100 text-orange-700 border-orange-200" },
  MEDIUM: { className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  LOW: { className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Tasks" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "WONT_FIX", label: "Won't Fix" },
];

export function TaskList({ projectId, tasks, onUpdate }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const filtered = tasks.filter((t) => filter === "all" || t.status === filter);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function startEditNotes(task: Task) {
    setEditingNotes((p) => ({ ...p, [task.id]: task.notes ?? "" }));
  }

  function cancelEditNotes(taskId: string) {
    setEditingNotes((p) => {
      const next = { ...p };
      delete next[taskId];
      return next;
    });
  }

  async function updateTask(taskId: string, update: { status?: TaskStatus; notes?: string }) {
    if (update.status) setUpdatingStatus(taskId);
    else setSaving(taskId);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, ...update }),
      });
      if (!res.ok) throw new Error();
      if (update.status) {
        toast.success(`Task marked as ${STATUS_CONFIG[update.status]?.label ?? update.status}.`);
      } else {
        toast.success("Task notes updated.");
        cancelEditNotes(taskId);
      }
      onUpdate();
    } catch {
      toast.error("Failed to update task.");
    } finally {
      setUpdatingStatus(null);
      setSaving(null);
    }
  }

  const counts = {
    open: tasks.filter((t) => t.status === "OPEN").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary + Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">{tasks.length} total task{tasks.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            {counts.open > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-semibold">
                {counts.open} open
              </span>
            )}
            {counts.inProgress > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold">
                {counts.inProgress} in progress
              </span>
            )}
            {counts.done > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
                {counts.done} done
              </span>
            )}
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 text-sm w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-sm">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Cards */}
      <Card>
        {tasks.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No tasks yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Run a scan then click &quot;Create Tasks from Findings&quot; in the Overview tab.
            </p>
          </CardContent>
        ) : filtered.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No tasks match this filter.</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filtered.map((task) => {
                const isExpanded = expandedId === task.id;
                const statusConf = STATUS_CONFIG[task.status as TaskStatus] ?? STATUS_CONFIG.OPEN;
                const severityConf = SEVERITY_CONFIG[task.severity] ?? SEVERITY_CONFIG.MEDIUM;
                const isEditingNotes = task.id in editingNotes;

                return (
                  <div key={task.id} className={`${task.status === "DONE" || task.status === "WONT_FIX" ? "opacity-60" : ""}`}>
                    {/* Task Row */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(task.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${task.status === "DONE" || task.status === "WONT_FIX" ? "line-through text-gray-400" : "text-gray-800"}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusConf.className}`}>
                            {statusConf.label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${severityConf.className}`}>
                            {task.severity}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-muted-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="bg-gray-50/40 border-t border-gray-100 px-4 py-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                        {/* Status update */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <label className="text-xs text-muted-foreground font-medium">Status:</label>
                          <Select
                            value={task.status}
                            onValueChange={(v) => updateTask(task.id, { status: v as TaskStatus })}
                            disabled={updatingStatus === task.id}
                          >
                            <SelectTrigger className="h-7 text-xs w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {STATUS_CONFIG[s].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {updatingStatus === task.id && (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          )}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground font-medium block">Notes:</label>
                          {isEditingNotes ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editingNotes[task.id]}
                                onChange={(e) =>
                                  setEditingNotes((p) => ({ ...p, [task.id]: e.target.value }))
                                }
                                rows={3}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs"
                                  disabled={saving === task.id}
                                  onClick={() =>
                                    updateTask(task.id, { notes: editingNotes[task.id] })
                                  }
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  {saving === task.id ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs"
                                  onClick={() => cancelEditNotes(task.id)}
                                  disabled={saving === task.id}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors min-h-[24px] rounded px-1 py-0.5 hover:bg-gray-100"
                              onClick={() => startEditNotes(task)}
                            >
                              {task.notes ? (
                                <p className="whitespace-pre-wrap">{task.notes}</p>
                              ) : (
                                <p className="text-muted-foreground italic text-xs">Click to add notes...</p>
                              )}
                            </div>
                          )}
                        </div>

                        {task.findingKey && (
                          <p className="text-xs text-muted-foreground">
                            From finding: <code className="bg-gray-100 px-1 rounded">{task.findingKey}</code>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
