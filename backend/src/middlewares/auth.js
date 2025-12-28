import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { failure } from "../utils/response.js";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return failure(res, "Authorization header missing or malformed", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user existence & active status
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return failure(res, "Account disabled", 403);
    }

    // Attach trusted user info to request
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