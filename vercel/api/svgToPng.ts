import { VercelApiHandler } from "@vercel/node";
import chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

const handler: VercelApiHandler = async (req, res) => {
  const {
    svg,
  }: {
    svg: string;
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
    await page.waitForNetworkIdle();

    const imageBuffer = await page?.screenshot({
      omitBackground: true,
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "image/png");
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

  return chromium.puppeteer.launch({
    args: chromium.args,
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
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap" rel="stylesheet">
    </style>
    </head>
    <body>${content}</body>
  </html>
`;

export default handler;
