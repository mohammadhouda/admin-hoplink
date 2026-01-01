// utils/cleanupTokens.js
import prisma from "../config/prisma.js";

export async function cleanupExpiredTokens() {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });
  console.log(`Cleaned up ${result.count} expired refresh tokens`);
}