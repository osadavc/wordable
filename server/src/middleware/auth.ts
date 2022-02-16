import { Request, Response, NextFunction } from "express";
import { getToken } from "../utils/authUtils";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string;
        image: string;
      };
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authToken =
    req.cookies["next-auth.session-token"] || req.headers.authorization;

  if (!authToken) {
    return res.status(403).json({
      status: 403,
      message: "No Auth Token",
    });
  }

  try {
    const user = await getToken(authToken);

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    req.user = user.user as {
      id: number;
      name: string;
      image: string;
    };
    next();
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export default auth;
