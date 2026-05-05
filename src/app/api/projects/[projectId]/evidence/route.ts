import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  type: z.enum(["NOTE", "URL"]),
  note: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  checklistItemId: z.string().optional(),
  taskId: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await db.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

  const { type, note, sourceUrl, checklistItemId, taskId } = parsed.data;

  if (type === "NOTE" && !note) {
    return NextResponse.json({ error: "Note text is required for NOTE type" }, { status: 400 });
  }
  if (type === "URL" && !sourceUrl) {
    return NextResponse.json({ error: "sourceUrl is required for URL type" }, { status: 400 });
  }

  const evidence = await db.evidence.create({
    data: {
      projectId,
      type,
      note: note ?? null,
      sourceUrl: sourceUrl ?? null,
      checklistItemId: checklistItemId ?? null,
      taskId: taskId ?? null,
    },
  });

  return NextResponse.json(evidence, { status: 201 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await db.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const evidence = await db.evidence.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(evidence);
}
