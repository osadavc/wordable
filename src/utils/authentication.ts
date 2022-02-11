import { getToken as getNextAuthToken } from "next-auth/jwt";
import invariant from "invariant";

export const getToken = async (cookie?: string) => {
  invariant(cookie, "Cookies are required");

  const cookies: {
    ["next-auth.session-token"]?: string;
  } = cookie.split(";").reduce((res, c) => {
    const [key, val] = c.trim().split("=").map(decodeURIComponent);
    try {
      return Object.assign(res, { [key]: JSON.parse(val) });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {});
  const user = await getNextAuthToken({
    req: {
      cookies,
      headers: {
        authorization: "Bearer " + cookies["next-auth.session-token"],
      },
    },
    secret: process.env.JWT_SECRET,
  });

  return user;
};
