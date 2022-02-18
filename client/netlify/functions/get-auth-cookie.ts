import { Handler } from "@netlify/functions";
import { headers } from "../../src/utils/headers";

export const handler: Handler = async (event) => {
  const { cookie } = event.headers;
  const nextAuthSessionToken =
    getCookie("next-auth.session-token", cookie!) ||
    getCookie("__Secure-next-auth.session-token", cookie!);

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      cookie: nextAuthSessionToken,
    }),
  };
};

const getCookie = (cookieName: string, cookies: string) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(cookies);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
