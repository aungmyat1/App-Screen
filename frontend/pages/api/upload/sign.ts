import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import aws from "aws-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get the session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "File name is required" });
  }

  try {
    // Configure AWS SDK
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    // Generate signed URL for upload
    const key = `${session.user.id}/${Date.now()}-${url}`;
    
    const presignedPost = s3.createPresignedPost({
      Bucket: process.env.AWS_BUCKET_NAME,
      Fields: {
        key,
        "Content-Type": "image/*",
      },
      Expires: 60, // 1 minute
      Conditions: [
        ["content-length-range", 0, 10 * 1024 * 1024], // Max 10MB
        ["starts-with", "$Content-Type", "image/"],
      ],
    });

    res.status(200).json(presignedPost);
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
}