import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find user with this email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours from now

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: verificationTokenExpiry,
      },
    });

    // TODO: Send verification email
    // For now, we'll just log it
    console.log(`Verification email would be sent to ${email} with token: ${verificationToken}`);
    console.log(`Verification link: http://localhost:3000/api/auth/verify-email?token=${verificationToken}`);

    return res.status(200).json({ message: "If an account exists, a verification email has been sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}