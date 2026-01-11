import { NextFunction, Response } from "express";

export async function roleRequire(role: "user" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as any;
    const authUser = authReq.User;

    if (!authUser) {
      return res.status(401).json({
        message: "The user is not authenticated",
      });
    }

    if (role !== authUser.role) {
      return res.status(401).json({
        message: "The user is not authenticated",
      });
    }
    next();
  };
}
