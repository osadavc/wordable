import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";
import { getTodaysWord, getWordEmojiGrid } from "../../src/utils/wordUtils";
import { twitterClient } from "../../src/services/twitterClient";

const { NEXTAUTH_URL } = process.env;

export const handler: Handler = async (event) => {
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

    const { isWon, guesses, isSharedToTwitter } = (
      await firestore.collection("users").doc(user.user.id.toString()!).get()
    ).data()?.games?.[word];

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

    await firestore
      .collection("users")
      .doc(user.user.id.toString()!)
      .set(
        {
          games: {
            [word]: {
              isSharedToTwitter: true,
              twitterId: data.id,
            },
          },
        },
        { merge: true }
      );

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
