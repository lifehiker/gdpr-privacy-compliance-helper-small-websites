import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import type { AuditReportData } from "@/lib/pdf/audit-report";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      scanRuns: {
        where: { status: "COMPLETE" },
        orderBy: { startedAt: "desc" },
        take: 1,
        include: { findings: { orderBy: { severity: "asc" } } },
      },
      checklistItems: { orderBy: { createdAt: "asc" } },
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const latestScan = project.scanRuns[0] ?? null;

  const reportData: AuditReportData = {
    project: {
      name: project.name,
      domain: project.domain,
      region: project.region,
      notes: project.notes,
      createdAt: project.createdAt,
    },
    latestScan: latestScan
      ? {
          score: latestScan.score,
          completedAt: latestScan.completedAt,
          findings: latestScan.findings.map((f) => ({
            key: f.key,
            label: f.label,
            status: f.status,
            severity: f.severity,
            details: f.details,
          })),
        }
      : null,
    checklistItems: project.checklistItems.map((c) => ({
      key: c.key,
      label: c.label,
      status: c.status,
      notes: c.notes,
    })),
    tasks: project.tasks.map((t) => ({
      title: t.title,
      severity: t.severity,
      status: t.status,
      owner: t.owner,
      dueDate: t.dueDate,
    })),
    generatedAt: new Date(),
  };

  try {
    // Dynamically import to avoid SSR conflicts
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { AuditReportDocument } = await import("@/lib/pdf/audit-report");
    const React = await import("react");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(AuditReportDocument, { data: reportData }) as any;
    const pdfBuffer = await renderToBuffer(element);

    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const filename = `${slug}-audit-report.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
