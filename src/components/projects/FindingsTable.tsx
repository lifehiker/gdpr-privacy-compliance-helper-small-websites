"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ListTodo, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ScanRun, ScanFinding } from "@/app/app/projects/[projectId]/page";

interface Props {
  projectId: string;
  latestScan: ScanRun | null;
  onTasksCreated: () => void;
}

function StatusBadge({ status }: { status: ScanFinding["status"] }) {
  const map: Record<ScanFinding["status"], { label: string; className: string }> = {
    PASS: { label: "Pass", className: "bg-green-100 text-green-700 border-green-200" },
    WARNING: { label: "Warning", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    FAIL: { label: "Fail", className: "bg-red-100 text-red-700 border-red-200" },
    MANUAL_REVIEW: { label: "Manual Review", className: "bg-blue-100 text-blue-700 border-blue-200" },
  };
  const { label, className } = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${className}`}>
      {label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: ScanFinding["severity"] }) {
  const map: Record<ScanFinding["severity"], { label: string; className: string }> = {
    CRITICAL: { label: "Critical", className: "bg-red-100 text-red-700 border-red-200" },
    HIGH: { label: "High", className: "bg-orange-100 text-orange-700 border-orange-200" },
    MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    LOW: { label: "Low", className: "bg-gray-100 text-gray-500 border-gray-200" },
  };
  const { label, className } = map[severity] ?? { label: severity, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${className}`}>
      {label}
    </span>
  );
}

const STATUS_ORDER: Record<string, number> = { FAIL: 0, WARNING: 1, MANUAL_REVIEW: 2, PASS: 3 };
const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function FindingsTable({ projectId, latestScan, onTasksCreated }: Props) {
  const [creatingTasks, setCreatingTasks] = useState(false);

  async function handleCreateTasks() {
    setCreatingTasks(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/from-findings`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not create tasks.");
      } else if (data.created === 0) {
        toast.info(data.message ?? "All findings already have tasks.");
      } else {
        toast.success(`Created ${data.created} task${data.created !== 1 ? "s" : ""} from findings.`);
        onTasksCreated();
      }
    } catch {
      toast.error("Failed to create tasks from findings.");
    } finally {
      setCreatingTasks(false);
    }
  }

  const findings = latestScan?.findings
    ? [...latestScan.findings].sort((a, b) => {
        const statusDiff = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
        if (statusDiff !== 0) return statusDiff;
        return (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
      })
    : [];

  const hasActionable = findings.some((f) => f.status === "FAIL" || f.status === "WARNING");

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base font-semibold">Scan Findings</CardTitle>
          {latestScan?.status === "COMPLETE" && hasActionable && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateTasks}
              disabled={creatingTasks}
            >
              <ListTodo className="h-3.5 w-3.5 mr-1.5" />
              {creatingTasks ? "Creating Tasks..." : "Create Tasks from Findings"}
            </Button>
          )}
        </div>
        {latestScan?.status === "COMPLETE" && (
          <p className="text-xs text-muted-foreground mt-1">
            {findings.length} check{findings.length !== 1 ? "s" : ""} from latest scan
            {" · "}
            {findings.filter((f) => f.status === "FAIL").length} failed,{" "}
            {findings.filter((f) => f.status === "WARNING").length} warnings,{" "}
            {findings.filter((f) => f.status === "PASS").length} passed
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {!latestScan ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <ShieldCheck className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">No scan results yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Run a scan to check your website&apos;s GDPR compliance.
            </p>
          </div>
        ) : latestScan.status !== "COMPLETE" ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
            <p className="text-sm text-muted-foreground">
              {latestScan.status === "RUNNING" || latestScan.status === "PENDING"
                ? "Scan in progress..."
                : "Scan failed. Please try again."}
            </p>
          </div>
        ) : findings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <ShieldCheck className="h-12 w-12 text-green-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">No findings detected</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Check</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Severity</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Details</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f, i) => (
                  <tr
                    key={f.id}
                    className={`border-b border-gray-50 last:border-0 ${i % 2 === 1 ? "bg-gray-50/30" : ""} hover:bg-gray-50/60 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{f.label}</span>
                      {f.detectedValue && (
                        <span className="block text-xs text-muted-foreground mt-0.5 font-mono truncate max-w-xs">
                          {f.detectedValue}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SeverityBadge severity={f.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {f.details ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
