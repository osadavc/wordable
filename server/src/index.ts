import express from "express";
import cors from "cors";
import puppeteer, { Browser } from "puppeteer";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth";
import { generateSvgImage, getTodaysWord } from "./utils/wordUtils";
import User from "./models/user";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "30mb" }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://wordable.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
const { WALLET_PRIVATE_KEY, MONGODB_URL } = process.env;

mongoose
  .connect(MONGODB_URL!)
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(auth);

app.post("/mintNFT", async (req, res) => {
  let browser: Browser | null = null;

  try {
    const { walletAddress } = req.body;
    const { user } = req;
    const { word, wordOfTheDayIndex } = getTodaysWord();

    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    const { isWon, guesses } = (
      await User.findOne({
        twitterId: user.id,
      })
    )?.games.find((game) => game.word == word)!;

    if (!isWon) {
      throw new Error("You have not won the game yet");
    }
    const svg = generateSvgImage(wordOfTheDayIndex, guesses);

    browser = await getBrowserInstance();
    const page = await browser?.newPage();
    await page?.setViewport({ height: 1024, width: 1024 });
    await page?.setContent(htmlReset(svg));
    await page.waitForNetworkIdle();

    const imageBuffer = await page?.screenshot({
      omitBackground: true,
    });

    const wallet = new ethers.Wallet(
      WALLET_PRIVATE_KEY!,
      ethers.getDefaultProvider("rinkeby")
    );

    const nft = new ThirdwebSDK(wallet).getNFTModule(
      "0x34F9aeE44576E07f8baaAa2F86bD74a3CaD9b916"
    );

    const metadata = await nft.mintTo(walletAddress, {
      name: `Wordable Word ${wordOfTheDayIndex}`,
      description: `Wordable Word ${wordOfTheDayIndex} Won by ${user.id}`,
      image: imageBuffer,
    });

    res.status(200).json({
      result: metadata,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

const getBrowserInstance = async () => {
  return puppeteer.launch({
    headless: true,
  });
};

const htmlReset = (content: string) => `
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
