import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  itemId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETE", "NOT_APPLICABLE"]).optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { projectId } = await params;
  const project = await db.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const { itemId, status, notes, dueDate } = updateSchema.parse(body);
  const item = await db.checklistItem.update({
    where: { id: itemId },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      lastReviewedAt: new Date(),
    },
  });
  return NextResponse.json(item);
}