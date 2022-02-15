import mongoose from "mongoose";
import { GuessRow } from "../interfaces/interfaces";

interface UserI extends mongoose.Document {
  twitterId: number;
  name: string;
  image: string;
  games: [
    {
      word: string;
      wordIndex: number;
      isNFTMinted?: boolean;
      isSharedToTwitter?: boolean;
      isWon?: boolean;
      twitterId?: number;
      guesses: GuessRow[];
    }
  ];
}

const userSchema = new mongoose.Schema<UserI>({
  twitterId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  games: [
    {
      word: {
        type: String,
        required: true,
      },
      wordIndex: {
        type: Number,
        required: true,
      },
      isNFTMinted: {
        type: Boolean,
        default: false,
      },
      isSharedToTwitter: {
        type: Boolean,
        default: false,
      },
      isWon: {
        type: Boolean,
        default: false,
      },
      twitterId: {
        type: Number,
      },
      guesses: [
        {
          guess: String,
          result: [
            {
              type: String,
              enum: ["Match", "Miss", "Present"],
            },
          ],
        },
      ],
    },
  ],
});

export default mongoose.model<UserI>("User", userSchema);
