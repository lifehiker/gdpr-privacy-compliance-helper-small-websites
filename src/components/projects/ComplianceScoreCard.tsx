"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { RefreshCw, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ScanRun, ScanFinding } from "@/app/app/projects/[projectId]/page";

interface Props {
  projectId: string;
  latestScan: ScanRun | null;
  onScanComplete: () => void;
}

function ScoreCircle({ score }: { score: number | null | undefined }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score != null ? Math.max(0, Math.min(100, score)) : null;
  const offset = pct != null ? circumference - (pct / 100) * circumference : circumference;

  let color = "#9ca3af"; // gray - no score
  let textColor = "text-gray-400";
  if (pct != null) {
    if (pct >= 70) { color = "#16a34a"; textColor = "text-green-600"; }
    else if (pct >= 40) { color = "#ca8a04"; textColor = "text-yellow-600"; }
    else { color = "#dc2626"; textColor = "text-red-600"; }
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${textColor}`}>
          {pct != null ? pct : "—"}
        </span>
        {pct != null && <span className="text-xs text-muted-foreground">/100</span>}
      </div>
    </div>
  );
}

function findingIcon(status: ScanFinding["status"]) {
  if (status === "FAIL") return <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />;
  if (status === "WARNING") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />;
  return <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />;
}

const SEVERITY_ORDER: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function ComplianceScoreCard({ projectId, latestScan, onScanComplete }: Props) {
  const [scanning, setScanning] = useState(false);

  async function runScan() {
    setScanning(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/scan`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Scan failed.");
      } else {
        toast.success(`Scan complete! Score: ${data.score}`);
        onScanComplete();
      }
    } catch {
      toast.error("Could not start scan. Please try again.");
    } finally {
      setScanning(false);
    }
  }

  const isRunning = latestScan?.status === "RUNNING" || latestScan?.status === "PENDING";
  const score = latestScan?.status === "COMPLETE" ? latestScan.score : null;

  // Top priority findings: FAIL first, then WARNING, sorted by severity
  const priorityFindings = latestScan?.findings
    .filter((f) => f.status === "FAIL" || f.status === "WARNING")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "FAIL" ? -1 : 1;
      return (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99);
    })
    .slice(0, 3) ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Compliance Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Circle */}
        <div className="flex flex-col items-center gap-2">
          <ScoreCircle score={score} />
          {latestScan?.status === "COMPLETE" && latestScan.completedAt && (
            <p className="text-xs text-muted-foreground text-center">
              Last scanned {format(new Date(latestScan.completedAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          )}
          {latestScan?.status === "FAILED" && (
            <Badge variant="destructive" className="text-xs">Scan Failed</Badge>
          )}
          {isRunning && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              <span className="text-xs text-blue-600">Scanning in progress...</span>
            </div>
          )}
          {!latestScan && (
            <p className="text-xs text-muted-foreground text-center">No scan has been run yet.</p>
          )}
        </div>

        {/* Run Scan Button */}
        <Button
          className="w-full"
          size="sm"
          onClick={runScan}
          disabled={scanning || isRunning}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Running Scan..." : isRunning ? "Scan in Progress..." : "Run New Scan"}
        </Button>

        {/* Priority Findings */}
        {priorityFindings.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Top Issues to Fix
            </p>
            <div className="space-y-2">
              {priorityFindings.map((f) => (
                <div key={f.id} className="flex items-start gap-2 p-2 rounded-md bg-gray-50 border border-gray-100">
                  {findingIcon(f.status)}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{f.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <SeverityBadge severity={f.severity} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${map[severity] ?? "bg-gray-100 text-gray-600"}`}>
      {severity}
    </span>
  );
}
