import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";
import { getTodaysWord } from "../../src/utils/wordUtils";

export const handler: Handler = async (event) => {
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

  const { word } = getTodaysWord();
  const gameState = (
    await firestore.collection("users").doc(user?.sub!).get()
  ).data()?.games?.[word];

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
