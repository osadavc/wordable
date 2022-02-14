import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";
import { getTodaysWord } from "../../src/utils/wordUtils";

export const handler: Handler = async (event) => {
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

    const sharedStatus = await (
      await firestore.collection("users").doc(user.id.toString()!).get()
    ).data()?.games[word];

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
