import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalBackdrop from "../Common/ModalBackdrop";
import { useGameStateStore } from "../../stores/gameState";
import { API } from "../../services/APIClient";
import InfoChip from "../Common/InfoChip";
import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import NProgress from "nprogress";
import { UnsupportedChainIdError } from "@web3-react/core";
import produce from "immer";

import axios, { AxiosError } from "axios";
import { showToast } from "../../utils/timeoutUtils";
import { getWordEmojiGrid } from "../../utils/wordUtils";

interface ResultPopupProps {
  isOpened: boolean;
  closePopup: () => void;
  didWin: boolean;
  didLoose: boolean;
}

const { NEXT_PUBLIC_NFT_MINTER_ENDPOINT } = process.env;

const ResultPopup: FC<ResultPopupProps> = ({
  isOpened,
  didWin,
  closePopup,
  didLoose,
}) => {
  const wonRow = useGameStateStore(
    (state) => state.rows[state.rows.length - 1]
  );
  const { rows } = useGameStateStore((state) => state);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessfullyMintedOpen, setIsSuccessfullyMintedOpen] =
    useState(false);
  const [isCopiedOpen, setIsCopiedOpen] = useState(false);
  const [isTweetedOpen, setIsTweetedOpen] = useState(false);
  const [isClickAgainOpen, setIsClickAgainOpen] = useState(false);

  const [sharedStatus, setSharedStatus] = useState<{
    isSharedToTwitter?: boolean;
    twitterId?: string;
    isNFTMinted?: boolean;
    NFTDetails?: {
      opensea_url: string;
    };
  }>({
    isSharedToTwitter: false,
    isNFTMinted: false,
  });
  const [correctWord, setCorrectWord] = useState<string | null | undefined>("");

  const {
    connectWallet,
    address: walletAddress,
    error: walletErrors,
  } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (!isOpened) return;

    API.get("/shared-status")
      .then(({ data }) => {
        setSharedStatus(data);
      })
      .catch(() => {
        setSharedStatus({
          isSharedToTwitter: false,
        });
      });
  }, [didLoose, didWin, isOpened]);

  useEffect(() => {
    if (!didLoose) {
      setCorrectWord(null);
      return;
    }

    API.get("/get-correct-word")
      .then(({ data: { word } }) => {
        setCorrectWord(word);
      })
      .catch(() => {});
  }, [didLoose]);

  const tweetWin = () => {
    if (sharedStatus.isSharedToTwitter) {
      window.open(
        `https://twitter.com/user/status/${sharedStatus.twitterId}`,
        "_blank"
      );
    }

    API.get("/tweet-win")
      .then(
        ({
          data: {
            result: { id },
          },
        }) => {
          setSharedStatus((prev) => ({
            ...prev,
            isSharedToTwitter: true,
            twitterId: id,
          }));
          useGameStateStore.setState((prevState) => ({
            allGames: produce(prevState.allGames, (draft) => {
              draft[draft.length - 1].isSharedToTwitter = true;
            }),
          }));
          showToast(setIsTweetedOpen, 2500);
        }
      )
      .catch(() => {
        showToast(setIsErrorOpen, 2500);
      });
  };

  const mintNft = async () => {
    if (sharedStatus.isNFTMinted) {
      console.log(sharedStatus.NFTDetails?.opensea_url);
      window.open(
        sharedStatus.NFTDetails?.opensea_url ||
          `https://testnets.opensea.io/${walletAddress}`,
        "_blank"
      );
    } else {
      if (walletAddress) {
        mintNFTApi();
      } else {
        await connectWallet("injected");
        showToast(setIsClickAgainOpen, 2500);
      }
    }
  };

  const mintNFTApi = async () => {
    const {
      data: { cookie },
    } = await API.get("/get-auth-cookie");

    NProgress.start();
    axios
      .post(
        `${NEXT_PUBLIC_NFT_MINTER_ENDPOINT}/mintNFT`,
        {
          walletAddress,
        },
        {
          headers: {
            Authorization: cookie,
          },
        }
      )
      .then(({ data: { result } }) => {
        setSharedStatus((prev) => ({
          ...prev,
          isNFTMinted: true,
          NFTDetails: result,
        }));
        useGameStateStore.setState((prevState) => ({
          allGames: produce(prevState.allGames, (draft) => {
            draft[draft.length - 1].NFTDetails = {
              name: result.name,
              description: result.description,
            };
            draft[draft.length - 1].isNFTMinted = true;
          }),
        }));

        showToast(setIsSuccessfullyMintedOpen, 6000);
      })
      .catch((error: AxiosError) => {
        showToast(setIsErrorOpen, 2500);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(getWordEmojiGrid(rows));
    showToast(setIsCopiedOpen, 2500);
  };

  return (
    <div>
      <InfoChip text="Error Occurred" isOpened={isErrorOpen} isError />

      <InfoChip
        text="Your NFT Is Currently Minting, Please Check Your Wallet"
        isOpened={isSuccessfullyMintedOpen}
      />
      <InfoChip text="Copied To Clipboard" isOpened={isCopiedOpen} />
      <InfoChip text="Successfully Tweeted" isOpened={isTweetedOpen} />
      <InfoChip
        text="Click Again To Mint your NFT"
        isOpened={isClickAgainOpen}
      />

      <AnimatePresence initial={false} exitBeforeEnter>
        {isOpened &&
          Object.keys(sharedStatus).length >= 1 &&
          correctWord !== undefined &&
          (didWin || correctWord) && (
            <ModalBackdrop onClick={closePopup}>
              <motion.div
                className="modal bg:text-white absolute z-50 rounded-md bg-zinc-100 pt-3 text-lg text-zinc-800 shadow-md dark:bg-zinc-800"
                onClick={(e) => e.stopPropagation()}
                initial={{
                  y: "-100vh",
                }}
                animate={{
                  y: "0",
                }}
                exit={{
                  y: "-100vh",
                }}
                transition={{
                  type: "spring",
                  duration: 0.3,
                }}
              >
                <div className="flex flex-col items-center py-5 px-8">
                  <h3 className="text-2xl dark:text-white">
                    You {didWin ? "Won !" : "Lost"}
                  </h3>
                  <p className="mb-5 leading-none text-zinc-600 dark:text-zinc-400">
                    {didWin
                      ? "Awesome! Keep It Up"
                      : "Don't Worry Try Again Next Time!"}
                  </p>

                  <div
                    className={`${
                      didWin ? "mb-10" : "mb-7"
                    } flex w-full space-x-2`}
                  >
                    {didWin
                      ? wonRow.guess
                          .split("")
                          .map((letter, index) => (
                            <CharacterBoxForResult
                              value={letter}
                              key={index}
                              didWin={didWin}
                            />
                          ))
                      : correctWord
                          ?.split("")
                          .map((letter, index) => (
                            <CharacterBoxForResult
                              value={letter}
                              key={index}
                              didWin={didWin}
                            />
                          ))}
                  </div>

                  <div className="mb-3 flex w-full flex-col space-y-2 text-white">
                    <button
                      className={`rounded bg-gradient-to-br ${
                        sharedStatus.isSharedToTwitter
                          ? "from-sky-600 to-sky-500 dark:from-sky-700"
                          : "from-sky-600 to-sky-400"
                      } py-2 pt-3 focus:ring focus:ring-sky-500/50 dark:focus:ring-sky-500/20`}
                      onClick={tweetWin}
                    >
                      {sharedStatus.isSharedToTwitter
                        ? "Open Tweet"
                        : `Tweet Your ${didWin ? "Win" : "Progress"}`}
                    </button>

                    {didWin &&
                      !(walletErrors instanceof UnsupportedChainIdError) &&
                      !sharedStatus.isNFTMinted && (
                        <button
                          className="space-y-[0.45rem] rounded bg-gradient-to-br from-pink-600 to-pink-500 py-2 pt-3 text-base focus:ring focus:ring-pink-500/50 disabled:cursor-not-allowed dark:focus:ring-pink-500/20 sm:text-lg"
                          onClick={mintNft}
                        >
                          <h3 className={`text-[1.08rem]`}>
                            Generate An Exclusive NFT
                          </h3>
                        </button>
                      )}

                    {sharedStatus.isNFTMinted &&
                      !sharedStatus.NFTDetails?.opensea_url && (
                        <button
                          className="space-y-[0.45rem] rounded bg-gradient-to-br from-yellow-700 to-yellow-500 py-2 pt-3 text-base focus:ring disabled:cursor-not-allowed dark:focus:ring-pink-500/20 sm:text-lg"
                          disabled
                        >
                          <h3 className="text-[1.08rem] leading-none">
                            NFT is Still Minting
                          </h3>
                          <p className="text-[0.8rem] leading-none">
                            Please Check Back Again In Few Minutes
                          </p>
                        </button>
                      )}

                    {sharedStatus.isNFTMinted &&
                      sharedStatus.NFTDetails?.opensea_url && (
                        <button
                          className="space-y-[0.45rem] rounded bg-gradient-to-br from-pink-700 to-pink-500 py-2 pt-3 text-base focus:ring focus:ring-pink-500/50 sm:text-lg"
                          onClick={mintNft}
                        >
                          <h3 className="text-[1.08rem]">
                            See Your NFT On OpenSea
                          </h3>
                        </button>
                      )}

                    {walletErrors instanceof UnsupportedChainIdError && didWin && (
                      <button
                        className="space-y-[0.45rem] rounded bg-gradient-to-br from-neutral-500 to-neutral-700 py-2 pt-3 capitalize focus:ring focus:ring-neutral-300/90 dark:focus:ring-neutral-300/20"
                        onClick={() => switchNetwork(4)}
                      >
                        <h3 className="text-[1.08rem] leading-none">
                          Switch To Rinkeby To Mint NFT
                        </h3>
                        <p className="text-[0.8rem] leading-none">
                          At the moment we only support rinkeby
                        </p>
                      </button>
                    )}
                    <button
                      className="rounded bg-gradient-to-br from-gray-500 to-gray-700 py-2 pt-3 focus:ring focus:ring-gray-400/50 dark:focus:ring-gray-400/20"
                      onClick={copyResult}
                    >
                      Copy Result
                    </button>
                  </div>
                </div>
              </motion.div>
            </ModalBackdrop>
          )}
      </AnimatePresence>
    </div>
  );
};

const CharacterBoxForResult = ({
  value,
  didWin: isWon,
}: {
  value: string;
  didWin: boolean;
}) => (
  <div
    className={`flex h-16 flex-1 items-center justify-center rounded border bg-gradient-to-br ${
      isWon
        ? "border-green-500 from-green-500 to-green-700"
        : "border-red-500 from-red-500 to-red-700"
    } pt-1 text-center text-2xl font-bold uppercase text-gray-100`}
  >
    <span className="leading-none">{value}</span>
  </div>
);

export default ResultPopup;
