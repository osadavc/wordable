import mongoose from "mongoose";
import { GuessRow } from "../stores/gameState";

interface UserI extends mongoose.Document {
  twitterId: number;
  name: string;
  image: string;
  games: [
    {
      word: string;
      wordIndex: number;
      isNFTMinted?: boolean;
      NFTDetails?: {
        id: string;
        name: string;
        description: string;
        image: string;
        external_url: string;
      };
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
      NFTDetails: {
        id: String,
        uri: String,
        name: String,
        description: String,
        image: String,
        external_url: String,
      },
      isSharedToTwitter: {
        type: Boolean,
        default: false,
      },
      twitterId: {
        type: Number,
      },
      isWon: {
        type: Boolean,
        default: false,
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

export default (mongoose.models.User as mongoose.Model<UserI>) ||
  mongoose.model<UserI>("User", userSchema);
