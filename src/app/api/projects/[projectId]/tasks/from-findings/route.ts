import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const project = await db.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const latestScan = await db.scanRun.findFirst({ where: { projectId, status: "COMPLETE" }, orderBy: { completedAt: "desc" }, include: { findings: true } });
  if (!latestScan) return NextResponse.json({ error: "No completed scan found" }, { status: 404 });
  const actionableFindings = latestScan.findings.filter((f) => f.status === "FAIL" || f.status === "WARNING");
  const existingTasks = await db.task.findMany({ where: { projectId, findingKey: { in: actionableFindings.map((f) => f.key) } }, select: { findingKey: true } });
  const existingKeys = new Set(existingTasks.map((t) => t.findingKey));
  const newFindings = actionableFindings.filter((f) => !existingKeys.has(f.key));
  if (newFindings.length === 0) return NextResponse.json({ created: 0, message: "All findings already have tasks." });
  await db.task.createMany({ data: newFindings.map((f) => ({ projectId, findingKey: f.key, title: "Fix: " + f.label, severity: f.severity, status: "OPEN", notes: f.details })) });
  return NextResponse.json({ created: newFindings.length });
}