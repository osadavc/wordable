import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import { getTodaysWord } from "../../src/utils/wordUtils";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

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

    const { word } = getTodaysWord();

    const sharedStatus = (
      await User.findOne({
        twitterId: user.id,
      })
    )?.games?.find((game) => game.word === word);

    return {
      statusCode: 200,
      body: JSON.stringify({
        isSharedToTwitter: sharedStatus?.isSharedToTwitter,
        twitterId: sharedStatus?.twitterId,
        isNFTMinted: sharedStatus?.isNFTMinted,
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.toString(),
      }),
      headers,
    };
  }
};
