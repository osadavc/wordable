import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import { getTodaysWord } from "../../src/utils/wordUtils";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

export const handler: Handler = async (event) => {
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

    const { guesses } = (
      await User.findOne({
        twitterId: user.id,
      })
    )?.games.find((game) => game.word == word)!;

    if (!guesses) {
      throw new Error("No guesses found");
    }

    if (guesses.length === 6) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          word,
        }),
      };
    }

    return {
      statusCode: 400,
      headers,
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error,
      }),
      headers,
    };
  }
};
