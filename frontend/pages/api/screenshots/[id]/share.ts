import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes } from "crypto";

interface ShareToken {
  id: string;
  screenshotId: string;
  token: string;
  permission: "view" | "comment" | "edit";
  expiresAt: Date | null;
  createdAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id: screenshotId } = req.query;

  if (!screenshotId || typeof screenshotId !== "string") {
    return res.status(400).json({ message: "Screenshot ID is required" });
  }

  switch (req.method) {
    case "POST":
      // Create a new share link
      try {
        const { permission, expiresInSeconds } = req.body;
        
        // Validate permission
        if (!["view", "comment", "edit"].includes(permission)) {
          return res.status(400).json({ message: "Invalid permission" });
        }
        
        // Generate a unique token
        const token = randomBytes(32).toString("hex");
        
        // Calculate expiration date
        let expiresAt = null;
        if (expiresInSeconds) {
          expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);
        }
        
        // In a real implementation, save to database
        const shareToken: ShareToken = {
          id: randomBytes(16).toString("hex"),
          screenshotId,
          token,
          permission,
          expiresAt,
          createdAt: new Date()
        };
        
        // Return the shareable URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const shareUrl = `${baseUrl}/shared/screenshot/${screenshotId}?token=${token}`;
        
        res.status(200).json({
          shareUrl,
          token,
          permission,
          expiresAt
        });
      } catch (error) {
        console.error("Error creating share link:", error);
        res.status(500).json({ message: "Failed to create share link" });
      }
      break;

    case "GET":
      // Get existing share links for a screenshot
      try {
        // In a real implementation, fetch from database
        // For now, return an empty array
        res.status(200).json([]);
      } catch (error) {
        console.error("Error fetching share links:", error);
        res.status(500).json({ message: "Failed to fetch share links" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}