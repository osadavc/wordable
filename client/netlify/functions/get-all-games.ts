import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import dbConnect from "../../src/utils/dbConnect";
import User from "../../src/models/user";

export const handler: Handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await dbConnect();

  try {
    const { user } = await getToken(event.headers.cookie);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
        headers,
      };
    }

    const allGamesPlayed = (await User.findOne({ twitterId: user.id }))?.games;

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: allGamesPlayed,
      }),
      headers,
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
