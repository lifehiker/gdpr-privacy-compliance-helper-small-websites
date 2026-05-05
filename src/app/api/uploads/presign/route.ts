import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = process.env;

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
    return NextResponse.json({ error: "File uploads not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = presignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

  const { fileName, contentType } = parsed.data;
  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.AWS_S3_ENDPOINT;

  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    ...(endpoint ? { endpoint } : {}),
  });

  // Scope uploads to a per-user prefix to avoid collisions
  const key = `uploads/${session.user.id}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  const baseUrl = endpoint
    ? `${endpoint}/${AWS_S3_BUCKET}`
    : `https://${AWS_S3_BUCKET}.s3.${region}.amazonaws.com`;

  const fileUrl = `${baseUrl}/${key}`;

  return NextResponse.json({ presignedUrl, fileUrl });
}
