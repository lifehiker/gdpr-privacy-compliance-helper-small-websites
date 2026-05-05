"use client";

import { useState } from "react";
import { format } from "date-fns";
import { History, TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ScanRun, ScanFinding } from "@/app/app/projects/[projectId]/page";

interface Props {
  scanRuns: ScanRun[];
}

function StatusBadge({ status }: { status: ScanRun["status"] }) {
  const map: Record<ScanRun["status"], { label: string; className: string }> = {
    COMPLETE: { label: "Complete", className: "bg-green-100 text-green-700 border-green-200" },
    RUNNING: { label: "Running", className: "bg-blue-100 text-blue-700 border-blue-200" },
    PENDING: { label: "Pending", className: "bg-gray-100 text-gray-600 border-gray-200" },
    FAILED: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
  };
  const conf = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${conf.className}`}>
      {conf.label}
    </span>
  );
}

function ScoreChange({ current, previous }: { current?: number | null; previous?: number | null }) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (diff === 0) return <span className="flex items-center gap-0.5 text-xs text-gray-400"><Minus className="h-3 w-3" />0</span>;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-xs text-green-600 font-semibold"><TrendingUp className="h-3 w-3" />+{diff}</span>;
  return <span className="flex items-center gap-0.5 text-xs text-red-600 font-semibold"><TrendingDown className="h-3 w-3" />{diff}</span>;
}

function FindingIcon({ status }: { status: ScanFinding["status"] }) {
  if (status === "FAIL") return <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />;
  if (status === "WARNING") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />;
  if (status === "MANUAL_REVIEW") return <HelpCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />;
  return <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />;
}

function ScanDetailDialog({ scan, open, onClose }: { scan: ScanRun | null; open: boolean; onClose: () => void }) {
  if (!scan) return null;

  const sorted = [...(scan.findings ?? [])].sort((a, b) => {
    const statusOrder: Record<string, number> = { FAIL: 0, WARNING: 1, MANUAL_REVIEW: 2, PASS: 3 };
    return (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Scan Details
            <StatusBadge status={scan.status} />
            {scan.score != null && (
              <span className="text-sm font-normal text-muted-foreground">· Score: {scan.score}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 text-xs text-muted-foreground mb-4">
          <p>Started: {format(new Date(scan.startedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          {scan.completedAt && (
            <p>Completed: {format(new Date(scan.completedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          )}
          <p>{scan.findings.length} finding{scan.findings.length !== 1 ? "s" : ""}</p>
        </div>

        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No findings for this scan.</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((f) => (
              <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/40">
                <FindingIcon status={f.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">{f.label}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                        f.status === "FAIL" ? "bg-red-100 text-red-700" :
                        f.status === "WARNING" ? "bg-yellow-100 text-yellow-700" :
                        f.status === "MANUAL_REVIEW" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {f.status.replace("_", " ")}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                        f.severity === "CRITICAL" ? "bg-red-100 text-red-700" :
                        f.severity === "HIGH" ? "bg-orange-100 text-orange-700" :
                        f.severity === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {f.severity}
                      </span>
                    </div>
                  </div>
                  {f.details && (
                    <p className="text-xs text-muted-foreground mt-1">{f.details}</p>
                  )}
                  {f.detectedValue && (
                    <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">{f.detectedValue}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ScanHistoryList({ scanRuns }: Props) {
  const [selectedScan, setSelectedScan] = useState<ScanRun | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openDetail(scan: ScanRun) {
    setSelectedScan(scan);
    setDialogOpen(true);
  }

  if (scanRuns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <History className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No scan history yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Run your first scan from the Overview tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Scan History</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {scanRuns.length} scan{scanRuns.length !== 1 ? "s" : ""} · Click a row to see findings
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Score</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Change</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Findings</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {scanRuns.map((run, idx) => {
                  const prevRun = scanRuns[idx + 1];
                  const failCount = run.findings.filter((f) => f.status === "FAIL").length;
                  const warnCount = run.findings.filter((f) => f.status === "WARNING").length;

                  return (
                    <tr
                      key={run.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                      onClick={() => openDetail(run)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-800">
                          {format(new Date(run.startedAt), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(run.startedAt), "h:mm a")}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {run.score != null ? (
                          <span className={`text-sm font-bold ${
                            run.score >= 70 ? "text-green-600" :
                            run.score >= 40 ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {run.score}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ScoreChange current={run.score} previous={prevRun?.score} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {failCount > 0 && (
                            <span className="text-xs text-red-600 font-semibold">{failCount} fail{failCount !== 1 ? "s" : ""}</span>
                          )}
                          {warnCount > 0 && (
                            <span className="text-xs text-yellow-600 font-semibold">{warnCount} warn{warnCount !== 1 ? "s" : ""}</span>
                          )}
                          {run.findings.length > 0 && failCount === 0 && warnCount === 0 && (
                            <span className="text-xs text-green-600 font-semibold">All passed</span>
                          )}
                          {run.findings.length === 0 && (
                            <span className="text-xs text-muted-foreground">No findings</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ScanDetailDialog
        scan={selectedScan}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
