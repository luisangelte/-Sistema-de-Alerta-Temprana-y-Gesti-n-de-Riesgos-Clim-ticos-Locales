import { Request, Response, NextFunction } from "express";
import { AuthApplication } from "../../Application/AuthApplication";

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
  res.status(401).json({ error: "ERROR EN AUTENTIFICACIÓN" });
  return;
}

try {
  const payload = AuthApplication.verifyToken(token);
  (req as any).user = payload;
  next();
} catch (error) {
  res.status(403).json({ error: "Token inválido o expirado" });
  return;
}
}
