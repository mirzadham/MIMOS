import { NextResponse } from "next/server";
import { getSessionAdmin } from "@/lib/adminAuth";
import { r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request: Request) {
  const admin = await getSessionAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("contentType");
  const prefix = searchParams.get("prefix") || "programs";

  if (!filename || !contentType) {
    return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
  }

  const uniqueKey = `${prefix}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // URL expires in 60 seconds
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueKey}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload endpoint" }, { status: 500 });
  }
}
