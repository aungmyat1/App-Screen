import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get the session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // Update user
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        updatedAt: new Date(),
      },
    });

    // Return updated user without password
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}