import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/generateToken.js";

export async function registerService({ name, email, password, role}) {
  const userExist = await prisma.user.findUnique({
    where: { email }
  });

  if (userExist) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });

  const token = generateToken(user.id, user.role);

  return { user, token };
}

export async function loginService({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken(user.id , user.role);

  return { user, token };
}
