import { db } from "@/lib/db";
import { sendWeeklyDigest } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find all users with overdue tasks (dueDate < now, status != DONE)
  const usersWithOverdueTasks = await db.task.groupBy({
    by: ["projectId"],
    where: {
      dueDate: { lt: now },
      status: { not: "DONE" },
    },
    _count: { id: true },
  });

  // Map projectId -> overdue task count
  const overdueByProject = new Map(
    usersWithOverdueTasks.map((r) => [r.projectId, r._count.id])
  );

  // Find projects not scanned in 7+ days
  const staleProjects = await db.project.findMany({
    where: {
      OR: [
        { scanRuns: { none: {} } },
        {
          scanRuns: {
            every: {
              startedAt: { lt: sevenDaysAgo },
            },
          },
        },
      ],
    },
    select: { id: true, userId: true },
  });

  const staleProjectsByUser = new Map<string, number>();
  for (const p of staleProjects) {
    staleProjectsByUser.set(p.userId, (staleProjectsByUser.get(p.userId) ?? 0) + 1);
  }

  // Find all projects for overdue task users
  const projectIds = Array.from(overdueByProject.keys());
  const projects = await db.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, userId: true },
  });

  const overdueByUser = new Map<string, number>();
  for (const p of projects) {
    const count = overdueByProject.get(p.id) ?? 0;
    overdueByUser.set(p.userId, (overdueByUser.get(p.userId) ?? 0) + count);
  }

  // Collect all userIds that need a digest
  const allUserIds = new Set([
    ...Array.from(overdueByUser.keys()),
    ...Array.from(staleProjectsByUser.keys()),
  ]);

  if (allUserIds.size === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const users = await db.user.findMany({
    where: { id: { in: Array.from(allUserIds) } },
    select: { id: true, email: true, name: true },
  });

  let sent = 0;
  for (const user of users) {
    const overdueTasks = overdueByUser.get(user.id) ?? 0;
    const projectsNeedingScan = staleProjectsByUser.get(user.id) ?? 0;
    await sendWeeklyDigest(user.email, user.name, overdueTasks, projectsNeedingScan);
    sent++;
  }

  return NextResponse.json({ sent });
}
