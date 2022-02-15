import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import { getTodaysWord } from "../../src/utils/wordUtils";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

export const handler: Handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
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
  await dbConnect();

  const { word } = getTodaysWord();

  const gameState = (
    await User.findOne({
      twitterId: user.id,
    })
  )?.games?.find((game) => game.word === word);
  if (!gameState) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "No game state found",
      }),
      headers,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      gameState,
    }),
    headers,
  };
};
