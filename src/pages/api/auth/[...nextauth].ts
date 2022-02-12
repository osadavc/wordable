import axios from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";
import { twitterClient } from "../../../services/twitterClient";
import qs from "qs";

const { NEXT_PUBLIC_API_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } =
  process.env;

const refreshAccessToken = async (token: JWT) => {
  console.log("🚀 Refreshed");

  try {
    const { data, status } = await twitterClient.post(
      "/oauth2/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: TWITTER_CLIENT_ID,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (status != 200) throw data;

    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error: any) {
    console.log(error?.response?.data as any);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: TWITTER_CLIENT_ID!,
      clientSecret: TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        params: {
          scope: [
            "tweet.write",
            "users.read",
            "tweet.read",
            "offline.access",
          ].join(" "),
        },
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token: { iat, ...token }, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
        };
      }

      console.log(
        "Should NOT Refresh",
        Date.now() < ((iat as number) + 60 * 60) * 1000
      );
      if (Date.now() < ((iat as number) + 60 * 60) * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async signIn({ user }) {
      const { status } = await axios.post(
        `${NEXT_PUBLIC_API_URL}.netlify/functions/update-user-info`,
        {
          ...user,
        }
      );

      return status == 200;
    },
  },
});
