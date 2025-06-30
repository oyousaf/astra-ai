import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export function verifyToken(req: NextApiRequest): { id: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return null;
  }
}
