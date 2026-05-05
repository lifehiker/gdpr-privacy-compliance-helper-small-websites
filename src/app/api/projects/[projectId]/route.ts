import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  region: z.enum(["EU", "GLOBAL", "US", "UK"]).optional(),
  notes: z.string().optional(),
});

async function getProject(projectId: string, userId: string) {
  return db.project.findFirst({ where: { id: projectId, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;

  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      scanRuns: {
        orderBy: { startedAt: "desc" },
        take: 10,
        include: { findings: true },
      },
      checklistItems: { orderBy: { createdAt: "asc" } },
      tasks: { orderBy: { createdAt: "desc" } },
      evidence: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;

  const project = await getProject(projectId, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const data = updateSchema.parse(body);
  const updated = await db.project.update({ where: { id: projectId }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;

  const project = await getProject(projectId, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.project.delete({ where: { id: projectId } });
  return NextResponse.json({ success: true });
}