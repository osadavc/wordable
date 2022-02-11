import { Handler } from "@netlify/functions";
import { headers } from "../../src/utils/headers";

export const handler: Handler = (event) => {
  return {
    statusCode: 200,
    headers,
  };
};
