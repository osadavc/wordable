import { Handler } from "@netlify/functions";
import { GuessRow } from "../../src/stores/gameState";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import {
  getTodaysWord,
  computeGuess,
  isValidWord,
  LetterState,
} from "../../src/utils/wordUtils";
import dbConnect from "../../src/utils/dbConnect";
import User from "../../src/models/user";

export const handler: Handler = async (event) => {
  if (event.httpMethod == "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod != "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers,
    };
  }

  await dbConnect();

  try {
    const { guess } = event.queryStringParameters as { guess: string };
    const { word, wordOfTheDayIndex } = getTodaysWord();

    const { rows } = JSON.parse(event.body!) as { rows: GuessRow[] };
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

    if (!guess || !word) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing guess or word",
        }),
        headers,
      };
    }

    if (!isValidWord(guess)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Guess Is Not A Valid Word",
        }),
        headers,
      };
    }

    const result = computeGuess(guess, word);

    // Loose
    if (rows.length == 5 && !result.every((i) => i == LetterState.Match)) {
      const foundUser = await User.findOne({ twitterId: user.id });
      foundUser?.games.push({
        word,
        wordIndex: wordOfTheDayIndex,
        guesses: rows.concat({ guess, result }),
      });
      await foundUser?.save();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          result,
        }),
      };
    }

    // Won
    if (result.every((i) => i == LetterState.Match)) {
      const foundUser = await User.findOne({ twitterId: user.id });
      foundUser?.games.push({
        word,
        wordIndex: wordOfTheDayIndex,
        isWon: true,
        guesses: rows.concat({ guess, result }),
      });
      await foundUser?.save();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          result,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        result,
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
