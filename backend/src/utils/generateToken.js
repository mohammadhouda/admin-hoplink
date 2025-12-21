import jwt from "jsonwebtoken";

export function generateToken(user_id, role="user") {
  return jwt.sign(
    { id: user_id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "20m" }
  );
}
