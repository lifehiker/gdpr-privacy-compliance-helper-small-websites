"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link2, FileText, Plus, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Evidence } from "@/app/app/projects/[projectId]/page";

interface Props {
  projectId: string;
  evidence: Evidence[];
  onUpdate: () => void;
}

export function EvidencePanel({ projectId, evidence, onUpdate }: Props) {
  const [noteText, setNoteText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);

  async function addEvidence(type: "NOTE" | "URL", payload: { note?: string; sourceUrl?: string }) {
    if (type === "NOTE") setAddingNote(true);
    else setAddingUrl(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...payload }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to add evidence.");
      }
      toast.success(`${type === "NOTE" ? "Note" : "URL"} added successfully.`);
      if (type === "NOTE") setNoteText("");
      else setUrlText("");
      onUpdate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add evidence.");
    } finally {
      setAddingNote(false);
      setAddingUrl(false);
    }
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    addEvidence("NOTE", { note: noteText.trim() });
  }

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!urlText.trim()) return;
    addEvidence("URL", { sourceUrl: urlText.trim() });
  }

  return (
    <div className="space-y-6">
      {/* Add Evidence Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Note */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Add Note Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <Label htmlFor="note-input" className="text-xs text-muted-foreground mb-1 block">
                  Write a compliance note or observation
                </Label>
                <Textarea
                  id="note-input"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Privacy policy reviewed and updated on 2025-01-15, includes all required GDPR clauses..."
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!noteText.trim() || addingNote}
                className="w-full"
              >
                {addingNote ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                )}
                {addingNote ? "Adding..." : "Add Note"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add URL */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              Add URL Evidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUrl} className="space-y-3">
              <div>
                <Label htmlFor="url-input" className="text-xs text-muted-foreground mb-1 block">
                  Link to a document, policy page, or screenshot
                </Label>
                <Input
                  id="url-input"
                  type="url"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  placeholder="https://example.com/privacy-policy"
                  className="text-sm"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!urlText.trim() || addingUrl}
                className="w-full"
              >
                {addingUrl ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                )}
                {addingUrl ? "Adding..." : "Add URL"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Evidence List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Evidence ({evidence.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {evidence.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14">
              <FileText className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No evidence yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add notes or URLs above to document your compliance work.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {evidence.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-3 px-4 py-3 ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {item.type === "URL" ? (
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <Link2 className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {item.type === "URL" && item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate block max-w-full"
                      >
                        {item.sourceUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.note}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  {/* Type badge */}
                  <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
