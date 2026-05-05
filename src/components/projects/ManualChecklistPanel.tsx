"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2, Clock, Circle, MinusCircle, Save, X, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ChecklistItem } from "@/app/app/projects/[projectId]/page";

interface Props {
  projectId: string;
  items: ChecklistItem[];
  onUpdate: () => void;
}

type Status = ChecklistItem["status"];

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; className: string }> = {
  NOT_STARTED: {
    label: "Not Started",
    icon: <Circle className="h-4 w-4 text-gray-400" />,
    className: "text-gray-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
    className: "text-blue-600",
  },
  COMPLETE: {
    label: "Complete",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    className: "text-green-600",
  },
  NOT_APPLICABLE: {
    label: "N/A",
    icon: <MinusCircle className="h-4 w-4 text-gray-300" />,
    className: "text-gray-400",
  },
};

const ALL_STATUSES: Status[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETE", "NOT_APPLICABLE"];

interface EditState {
  notes: string;
  dueDate: string;
}

export function ManualChecklistPanel({ projectId, items, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ notes: "", dueDate: "" });
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const total = items.length;
  const complete = items.filter((i) => i.status === "COMPLETE").length;
  const notApplicable = items.filter((i) => i.status === "NOT_APPLICABLE").length;
  const relevant = total - notApplicable;
  const progressPct = relevant > 0 ? Math.round((complete / relevant) * 100) : 0;

  function openEdit(item: ChecklistItem) {
    setEditingId(item.id);
    setEditState({
      notes: item.notes ?? "",
      dueDate: item.dueDate ? format(new Date(item.dueDate), "yyyy-MM-dd") : "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditState({ notes: "", dueDate: "" });
  }

  async function saveEdit(item: ChecklistItem) {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          notes: editState.notes,
          dueDate: editState.dueDate || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Checklist item updated.");
      setEditingId(null);
      onUpdate();
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(item: ChecklistItem, newStatus: Status) {
    setUpdatingStatus(item.id);
    try {
      const res = await fetch(`/api/projects/${projectId}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated.");
      onUpdate();
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No checklist items yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Run a scan to populate your compliance checklist.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-800">
                {complete} of {relevant} items complete
              </span>
              {notApplicable > 0 && (
                <span className="text-xs text-muted-foreground ml-2">({notApplicable} N/A)</span>
              )}
            </div>
            <span className="text-sm font-bold text-primary">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Manual Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const config = STATUS_CONFIG[item.status as Status] ?? STATUS_CONFIG.NOT_STARTED;
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 transition-colors ${item.status === "COMPLETE" ? "bg-green-50/30" : item.status === "NOT_APPLICABLE" ? "bg-gray-50/50" : "hover:bg-gray-50/50"}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {updatingStatus === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : (
                        config.icon
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${item.status === "NOT_APPLICABLE" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Status Dropdown */}
                          <Select
                            value={item.status}
                            onValueChange={(v) => updateStatus(item, v as Status)}
                            disabled={updatingStatus === item.id}
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

                          {/* Edit button */}
                          {!isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => openEdit(item)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Due date display */}
                      {!isEditing && item.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {format(new Date(item.dueDate), "MMM d, yyyy")}
                        </p>
                      )}

                      {/* Notes display */}
                      {!isEditing && item.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.notes}</p>
                      )}

                      {/* Inline edit form */}
                      {isEditing && (
                        <div className="mt-3 space-y-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                            <Textarea
                              value={editState.notes}
                              onChange={(e) => setEditState((p) => ({ ...p, notes: e.target.value }))}
                              rows={2}
                              className="text-sm"
                              placeholder="Add notes about this item..."
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Due Date</label>
                            <Input
                              type="date"
                              value={editState.dueDate}
                              onChange={(e) => setEditState((p) => ({ ...p, dueDate: e.target.value }))}
                              className="text-sm h-8 w-44"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => saveEdit(item)}
                              disabled={saving}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Last reviewed */}
                      {!isEditing && item.lastReviewedAt && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Last reviewed {format(new Date(item.lastReviewedAt), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
