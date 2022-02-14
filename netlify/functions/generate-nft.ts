import { Handler } from "@netlify/functions";
import { getToken } from "../../src/utils/authentication";
import { firestore } from "../../src/utils/firebase";
import { headers } from "../../src/utils/headers";
import { generateSvgImage, getTodaysWord } from "../../src/utils/wordUtils";
import fs from "fs";
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export const handler: Handler = async (event) => {
  const chromeLocalPath = process.env.CHROME_EXECUTABLE_PATH;
  let browser: puppeteer.Browser | null = null;

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
    const { isWon, guesses } = await (
      await firestore.collection("users").doc(user.id.toString()!).get()
    ).data()?.games[word];

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
      path: `./public/images/nftImages/${wordOfTheDayIndex}-${user.id}.png`,
      omitBackground: true,
    });

    await browser.close();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result: `${wordOfTheDayIndex}-${user.id}.png`,
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
