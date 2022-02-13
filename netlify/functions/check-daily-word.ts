import { Handler } from "@netlify/functions";
import { GuessRow } from "../../src/stores/gameState";
import { getToken } from "../../src/utils/authentication";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";
import {
  getTodaysWord,
  computeGuess,
  isValidWord,
  LetterState,
} from "../../src/utils/wordUtils";

export const handler: Handler = async (event) => {
  const { guess } = event.queryStringParameters as { guess: string };
  const { word } = getTodaysWord();

  if (event.httpMethod == "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  const { rows } = JSON.parse(event.body!) as { rows: GuessRow[] };

  if (event.httpMethod != "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers,
    };
  }

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

  if (rows.length == 5 && !result.every((i) => i == LetterState.Match)) {
    await firestore
      .collection("users")
      .doc(user.id.toString()!)
      .set(
        {
          games: {
            [word]: {
              isNFTMinted: false,
              isSharedToTwitter: false,
              isWon: false,
              guesses: rows.concat({ guess, result }),
            },
          },
        },
        { merge: true }
      );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result,
      }),
    };
  }

  if (result.every((i) => i == LetterState.Match)) {
    await firestore
      .collection("users")
      .doc(user.id.toString()!)
      .set(
        {
          games: {
            [word]: {
              isNFTMinted: false,
              isSharedToTwitter: false,
              isWon: true,
              guesses: rows.concat({ guess, result }),
            },
          },
        },
        { merge: true }
      );

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
};
