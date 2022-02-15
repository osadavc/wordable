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
  try {
    // const user = await getToken({
    //   req: {
    //     cookies: req.cookies["next-auth.session-token"],
    //     headers: {
    //       authorization: "Bearer " + req.cookies?.["next-auth.session-token"],
    //     },
    //   },
    //   secret: process.env.JWT_SECRET!,
    // });

    const user = await getToken(req.cookies["next-auth.session-token"]);
    return res.json(user);

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
