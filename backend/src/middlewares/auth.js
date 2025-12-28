import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { failure } from "../utils/response.js";

async function authMiddleware(req, res, next) {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return failure(res, "Not authenticated", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return failure(res, "Account disabled", 403);
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return failure(res, "Invalid or expired token", 401);
  }
}

export default authMiddleware;