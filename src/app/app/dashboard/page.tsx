import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  ShieldCheck,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react";

function getScoreColor(score: number | null | undefined): string {
  if (score == null) return "bg-gray-100 text-gray-600";
  if (score < 40) return "bg-red-100 text-red-700";
  if (score < 70) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function getScoreLabel(score: number | null | undefined): string {
  if (score == null) return "Not scanned";
  if (score < 40) return "At risk";
  if (score < 70) return "Needs work";
  return "Good";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    include: {
      scanRuns: {
        orderBy: { startedAt: "desc" },
        take: 1,
      },
      tasks: {
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Compute summary stats
  const totalProjects = projects.length;
  const totalOpenTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);

  const scoresWithValues = projects
    .map((p) => p.scanRuns[0]?.score)
    .filter((s): s is number => s != null);
  const avgScore =
    scoresWithValues.length > 0
      ? Math.round(scoresWithValues.reduce((a, b) => a + b, 0) / scoresWithValues.length)
      : null;

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}. Here&apos;s your privacy compliance overview.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalProjects}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Compliance Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {avgScore != null ? `${avgScore}%` : "—"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Open Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalOpenTasks}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
          {totalProjects > 0 && (
            <Link href="/app/projects">
              <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:text-blue-700 gap-1">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {totalProjects === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FolderKanban className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Create your first project
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Add a website to start tracking its GDPR compliance status, run automated scans, and manage remediation tasks.
              </p>
              <Link href="/app/projects">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProjects.map((project) => {
                const latestScan = project.scanRuns[0];
                const score = latestScan?.score;
                const openTaskCount = project.tasks.length;

                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between py-3 gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {project.region}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {project.domain}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Score badge */}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScoreColor(score)}`}
                      >
                        {score != null ? `${score}%` : "—"} &bull; {getScoreLabel(score)}
                      </span>

                      {/* Open tasks */}
                      {openTaskCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2.5 py-0.5 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          {openTaskCount} task{openTaskCount !== 1 ? "s" : ""}
                        </span>
                      )}

                      {/* Last scan time */}
                      {latestScan && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {format(new Date(latestScan.startedAt), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {totalProjects > 5 && (
                <div className="pt-3 text-center">
                  <Link href="/app/projects">
                    <Button variant="ghost" size="sm" className="text-sm text-blue-600 gap-1">
                      View all {totalProjects} projects
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
