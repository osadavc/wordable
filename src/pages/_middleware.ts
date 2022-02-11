import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req: req as any,
    secret: process.env.JWT_SECRET,
  });

  if (
    pathname == "/" ||
    pathname.includes("/images") ||
    pathname.includes("/api/auth") ||
    token
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect("/");
};
