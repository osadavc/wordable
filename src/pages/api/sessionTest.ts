import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  res.send({ token, headers: req.headers });
};

export default handler;
