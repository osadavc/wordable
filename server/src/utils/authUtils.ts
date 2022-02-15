import * as jose from "jose";
import { hkdf } from "@panva/hkdf";

export const getToken = async (token: string) => {
  const encryptionSecret = await hkdf(
    "sha256",
    process.env.JWT_SECRET,
    "",
    "NextAuth.js Generated Encryption Key",
    32
  );

  const { payload } = await jose.jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  });

  return payload;
};
