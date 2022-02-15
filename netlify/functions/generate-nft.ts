import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { headers } from "../../src/utils/headers";
import { generateSvgImage, getTodaysWord } from "../../src/utils/wordUtils";
import fs from "fs";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";
import User from "../../src/models/user";
import dbConnect from "../../src/utils/dbConnect";

export const handler: Handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const chromeLocalPath = process.env.CHROME_EXECUTABLE_PATH;
  let browser: puppeteer.Browser | null = null;

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

    const { word, wordOfTheDayIndex } = getTodaysWord();
    const { walletAddress } = JSON.parse(event.body!) as {
      walletAddress: string;
    };

    if (walletAddress == null) {
      throw new Error("Wallet Address Is Not Valid");
    }

    const { isWon, guesses } = (
      await User.findOne({
        twitterId: user.id,
      })
    )?.games.find((game) => game.word == word)!;

    if (!isWon) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "You have not won yet",
        }),
        headers,
      };
    }

    const svgImage = generateSvgImage(wordOfTheDayIndex, guesses);
    const imageName = `${wordOfTheDayIndex}-${user.id}.png`;

    browser = await puppeteer.launch({
      args: !!chromeLocalPath
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args,
      executablePath: chromeLocalPath || (await chromium.executablePath),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ height: 1024, width: 1024 });
    await page.setContent(htmlReset(svgImage));
    !fs.existsSync(`./public/images/nftImages/`) &&
      fs.mkdirSync(`./public/images/nftImages/`, { recursive: true });
    await page.screenshot({
      path: `./public/images/nftImages/${imageName}`,
      omitBackground: true,
    });
    await browser.close();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result: `${imageName}`,
      }),
    };
  } catch (error: any) {
    if (browser) {
      await browser.close();
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error?.toString(),
      }),
      headers,
    };
  }
};

const htmlReset = (content: string) => /*html*/ `
  <html>
    <head>
    <style>
    body, html{ margin:0; }
  </style>
    </head>
    <body>${content}</body>
  </html>
`;
