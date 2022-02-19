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
const { WALLET_PRIVATE_KEY, MONGODB_URL, THIRDWEB_MODULE_ADDRESS } =
  process.env;

mongoose
  .connect(MONGODB_URL!)
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });

//TODO: Move the wallet creation to the function

const wallet = new ethers.Wallet(
  WALLET_PRIVATE_KEY!,
  ethers.getDefaultProvider("rinkeby")
);
const nft = new ThirdwebSDK(wallet).getNFTModule(THIRDWEB_MODULE_ADDRESS!);

app.use(auth);

app.post("/mintNFT", async (req, res) => {
  let browser: Browser | null = null;

  try {
    const { walletAddress } = req.body;
    const { user } = req;
    const { word, wordOfTheDayIndex } = getTodaysWord();

    if (!walletAddress || ethers.utils.isAddress(walletAddress) == false) {
      throw new Error("Wallet address is not valid");
    }

    const { isWon, guesses, isNFTMinted } = (
      await User.findOne({
        twitterId: user.id,
      })
    )?.games.find((game) => game.word == word)!;

    if (!isWon || isNFTMinted) {
      throw new Error(
        "You have not won the game yet or you have already minted the nft"
      );
    }
    const svg = generateSvgImage(wordOfTheDayIndex, guesses);

    browser = await getBrowserInstance();
    const page = await browser?.newPage();
    await page?.setViewport({ height: 1024, width: 1024 });
    await page?.setContent(htmlReset(svg), {
      waitUntil: "networkidle0",
    });
    await page.waitForNetworkIdle();

    const imageBuffer = await page?.screenshot({
      omitBackground: true,
    });

    const metadata = await nft.mintTo(walletAddress, {
      name: `Wordable Word ${wordOfTheDayIndex}`,
      description: `Wordable Word ${wordOfTheDayIndex} Won by ${user.id}`,
      image: imageBuffer,
      properties: {
        wonUser: user.id,
        numberOfTries: guesses.length,
      },
    });

    const foundUser = await User.findOne({ twitterId: user.id });
    const currentGame = foundUser?.games.find((game) => game.word == word)!;

    currentGame.isNFTMinted = true;
    currentGame.NFTDetails = {
      name: metadata.name,
      id: metadata.id,
      description: metadata.description,
      image: metadata.image,
      opensea_url: `https://testnets.opensea.io/assets/${THIRDWEB_MODULE_ADDRESS}/${metadata.id}`,
    };
    //FIXME: Send The response before the NFT is minted
    await foundUser?.save();

    res.status(200).json({
      result: { ...currentGame.NFTDetails },
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
    args: ["--no-sandbox"],
  });
};

const htmlReset = (content: string) => `
  <html>
    <head>
    <style>
      body, html{ margin:0; }
      <link rel="preconnect" href="fonts.googleapis.com">
      <link rel="preconnect" href="fonts.gstatic.com" crossorigin>
      <link href="fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&display=swap" rel="stylesheet">
    </style>
    </head>
    <body>${content}</body>
  </html>
`;
