import { VercelApiHandler } from "@vercel/node";
import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

const handler: VercelApiHandler = async (req, res) => {
  const {
    svg,
    imageName,
  }: {
    svg: string;
    imageName: string;
  } = req.body;

  if (!svg.trim()) {
    return res.status(400).json({
      error: "SVG is required",
    });
  }

  let browser: Browser | null = null;

  try {
    browser = await getBrowserInstance();

    const page = await browser?.newPage();
    await page?.setViewport({ height: 1024, width: 1024 });
    await page?.setContent(htmlReset(svg));

    const imageBuffer = await page?.screenshot({
      omitBackground: true,
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", imageBuffer?.length!);
    res.send(imageBuffer);
  } catch (error: any) {
    res.json({
      data: error.message || "Something went wrong",
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

const getBrowserInstance = async () => {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    const puppeteer = require("puppeteer");

    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      ignoreHTTPSErrors: true,
    });
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1280,
      height: 720,
    },
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
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

export default handler;
