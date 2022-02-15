import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import { getTodaysWord, getWordEmojiGrid } from "../../src/utils/wordUtils";
import { twitterClient } from "../../src/services/twitterClient";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

const { NEXTAUTH_URL } = process.env;

export const handler: Handler = async (event) => {
  await dbConnect();

  try {
    const user = await getToken(event.headers.cookie);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Unauthorized",
        }),
        headers,
      };
    }

    const { word, wordOfTheDayIndex } = getTodaysWord();

    const foundUser = await User.findOne({
      twitterId: user.user.id,
    });
    const currentGame = foundUser?.games?.find((game) => game.word === word)!;
    const { isWon, guesses, isSharedToTwitter } = currentGame;

    if (!isWon || isSharedToTwitter) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            "You have already shared your word to Twitter or you have not won your game",
        }),
      };
    }

    const emojiGrid = getWordEmojiGrid(guesses);

    const {
      data: { data },
    } = await twitterClient.post(
      "/tweets",
      {
        text: `Wordable ${wordOfTheDayIndex}  ${guesses.length}/6 \n\n${emojiGrid}\n\nPlay The Better Version Of Wordle 👉🏻 ${NEXTAUTH_URL}\n#Wordable`,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    currentGame.isSharedToTwitter = true;
    currentGame.twitterId = data.id;
    await foundUser?.save();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result: data,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error,
      }),
      headers,
    };
  }
};
