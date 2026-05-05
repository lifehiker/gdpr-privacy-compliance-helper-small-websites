import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  region: z.enum(["EU", "GLOBAL", "US", "UK"]).default("GLOBAL"),
  notes: z.string().optional(),
});

const DEFAULT_CHECKLIST_ITEMS = [
  { key: "data_retention_documented", label: "Data retention periods documented" },
  { key: "processors_documented", label: "Data processors list documented" },
  { key: "legal_basis_documented", label: "Legal basis for processing documented" },
  { key: "dsar_process_documented", label: "DSAR / contact process documented" },
  { key: "consent_logging_defined", label: "Consent logging process defined" },
  { key: "cookie_categories_documented", label: "Cookie categories documented" },
];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    include: {
      scanRuns: { orderBy: { startedAt: "desc" }, take: 1 },
      tasks: { where: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await db.subscription.findUnique({ where: { userId: session.user.id } });
  const projectCount = await db.project.count({ where: { userId: session.user.id } });

  const limits: Record<string, number> = { FREE: 1, PRO: 10, AGENCY: 50 };
  const plan = sub?.plan || "FREE";
  if (projectCount >= (limits[plan] ?? 1)) {
    return NextResponse.json({ error: "Plan limit reached. Upgrade to create more projects." }, { status: 403 });
  }

  const body = await req.json();
  const data = createSchema.parse(body);

  const project = await db.project.create({
    data: { ...data, userId: session.user.id },
  });

  await db.checklistItem.createMany({
    data: DEFAULT_CHECKLIST_ITEMS.map((item) => ({
      projectId: project.id,
      key: item.key,
      label: item.label,
      isManual: true,
      status: "NOT_STARTED",
    })),
  });

  return NextResponse.json(project, { status: 201 });
}