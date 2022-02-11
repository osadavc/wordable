import axios from "axios";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const { NEXT_PUBLIC_API_URL } = process.env;

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
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
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
        };
      }
      return token;
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
