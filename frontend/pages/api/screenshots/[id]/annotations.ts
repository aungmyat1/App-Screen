import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Annotation {
  id: string;
  type: "arrow" | "rectangle" | "circle" | "text" | "blur";
  points: { x: number; y: number }[];
  text?: string;
  color: string;
  lineWidth: number;
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
    case "GET":
      // Get annotations for a screenshot
      try {
        // In a real implementation, fetch from database
        const annotations: Annotation[] = [
          {
            id: "1",
            type: "arrow",
            points: [{ x: 100, y: 100 }, { x: 200, y: 200 }],
            color: "#ff0000",
            lineWidth: 2
          },
          {
            id: "2",
            type: "text",
            points: [{ x: 300, y: 300 }],
            text: "Important button",
            color: "#0000ff",
            lineWidth: 2
          }
        ];
        
        res.status(200).json(annotations);
      } catch (error) {
        console.error("Error fetching annotations:", error);
        res.status(500).json({ message: "Failed to fetch annotations" });
      }
      break;

    case "POST":
      // Save new annotations
      try {
        const annotations: Annotation[] = req.body.annotations;
        
        // In a real implementation, save to database
        console.log("Saving annotations:", annotations);
        
        res.status(200).json({ message: "Annotations saved successfully" });
      } catch (error) {
        console.error("Error saving annotations:", error);
        res.status(500).json({ message: "Failed to save annotations" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}