import { FC } from "react";
import { useGameStateStore } from "../../stores/gameState";

const AllGameList: FC = () => {
  const games = useGameStateStore((state) => state.allGames);

  return (
    <div>
      {games.map(
        ({
          _id,
          isWon,
          word,
          guesses,
          isNFTMinted,
          isSharedToTwitter,
          NFTDetails,
          twitterId,
          wordIndex,
        }) => (
          <div
            key={_id}
            className="flex w-full justify-between border-b border-b-zinc-700 px-5 py-3 text-zinc-200 transition-colors hover:bg-zinc-600"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-4">
                <div
                  className={`h-5 w-5 rounded-sm bg-gradient-to-br ${
                    isWon
                      ? "from-green-500 to-green-700"
                      : "from-gray-500 to-gray-700"
                  }`}
                />
                <h2 className="pt-1 text-lg capitalize">
                  <span className="text-base text-zinc-400">
                    Word {wordIndex} :{" "}
                  </span>
                  {word}
                </h2>
              </div>
              <div>
                {isWon ? (
                  <h3>
                    Won In{" "}
                    <span className="font-bold text-zinc-50">
                      {guesses.length}
                    </span>{" "}
                    Tries
                  </h3>
                ) : (
                  <h3>Lost The Game</h3>
                )}
              </div>
            </div>

            <div className="flex cursor-pointer flex-col items-end space-y-2 text-xs md:flex-row md:items-start md:space-y-0 md:space-x-3 md:text-sm">
              {NFTDetails?.opensea_url && (
                <div
                  className="rounded-lg bg-gradient-to-br from-pink-500 to-pink-700 px-2 py-1 pt-[0.3rem]"
                  onClick={() => {
                    window.open(NFTDetails?.opensea_url);
                  }}
                >
                  NFT Minted
                </div>
              )}
              {isNFTMinted && !NFTDetails?.opensea_url && (
                <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 px-2 py-1 pt-[0.3rem]">
                  Minting NFT
                </div>
              )}
              {isSharedToTwitter && (
                <div
                  className="cursor-pointer rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 px-2 py-1 pt-[0.3rem]"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/user/status/${twitterId}`,
                      "_blank"
                    );
                  }}
                >
                  Tweeted
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AllGameList;
