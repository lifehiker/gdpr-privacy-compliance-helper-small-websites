import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { fetchSite } from "@/lib/scanner/fetch-site";
import { detectPrivacyIssues, calculateScore } from "@/lib/scanner/detect-rules";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const project = await db.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const sub = await db.subscription.findUnique({ where: { userId: session.user.id } });
  const plan = sub?.plan || "FREE";
  if (plan === "FREE") {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const scanCount = await db.scanRun.count({ where: { projectId, startedAt: { gte: monthStart } } });
    if (scanCount >= 1) return NextResponse.json({ error: "Free plan allows 1 scan per month." }, { status: 403 });
  }
  const scanRun = await db.scanRun.create({ data: { projectId, status: "RUNNING" } });
  try {
    const html = await fetchSite(project.domain);
    const findings = detectPrivacyIssues(html);
    const score = calculateScore(findings);
    await db.scanFinding.createMany({ data: findings.map((f) => ({ scanRunId: scanRun.id, key: f.key, label: f.label, status: f.status, severity: f.severity, details: f.details, detectedValue: f.detectedValue })) });
    await db.scanRun.update({ where: { id: scanRun.id }, data: { status: "COMPLETE", score, completedAt: new Date(), rawHtmlSnippet: html.slice(0, 2000), summaryJson: JSON.stringify({ findingCount: findings.length, score }) } });
    return NextResponse.json({ scanRunId: scanRun.id, score, findings });
  } catch (err) {
    await db.scanRun.update({ where: { id: scanRun.id }, data: { status: "FAILED", completedAt: new Date() } });
    console.error("[scan]", err);
    return NextResponse.json({ error: "Scan failed." }, { status: 500 });
  }
}