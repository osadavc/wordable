import { Handler } from "@netlify/functions";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";

export const handler: Handler = async (event) => {
  if (event.httpMethod != "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers,
    };
  }

  const { id, name, image } = JSON.parse(event.body!);

  await firestore.collection("users").doc(id).set(
    {
      name,
      image,
    },
    { merge: true }
  );

  return {
    statusCode: 200,
    headers,
  };
};
