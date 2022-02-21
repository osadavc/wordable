import axios from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";
import { twitterClient } from "../../../services/twitterClient";
import qs from "qs";

const { NEXT_PUBLIC_API_URL, TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } =
  process.env;

const refreshAccessToken = async (token: JWT) => {
  try {
    const { data } = await twitterClient.post(
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

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token,
    };
  } catch (error: any) {
    console.log(error.response.data);

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
            "offline.access",
            "tweet.read",
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
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at as number) * 1000,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          user,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
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
    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
});
