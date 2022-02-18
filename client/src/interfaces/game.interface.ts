import { GuessRow } from "../stores/gameState";

export interface Game {
  _id: string;
  word: string;
  wordIndex: number;
  isNFTMinted?: boolean;
  NFTDetails?: {
    id: string;
    name: string;
    description: string;
    image: string;
    opensea_url: string;
  };
  isSharedToTwitter?: boolean;
  isWon?: boolean;
  twitterId?: number;
  guesses: GuessRow[];
}
