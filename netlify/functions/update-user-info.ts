import { Handler } from "@netlify/functions";
import { headers } from "../../src/utils/headers";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

export const handler: Handler = async (event) => {
  if (event.httpMethod != "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers,
    };
  }
  await dbConnect();

  try {
    const {
      id: twitterId,
      name,
      image,
    }: {
      id: number;
      name: string;
      image: string;
    } = JSON.parse(event.body!);

    const user = await User.findOneAndUpdate(
      { twitterId },
      {
        name,
        image,
      },
      { upsert: true, new: true }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "User updated",
        result: user,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error.toString(),
      }),
    };
  }
};
