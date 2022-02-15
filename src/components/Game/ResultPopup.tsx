import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalBackdrop from "../Common/ModalBackdrop";
import { useGameStateStore } from "../../stores/gameState";
import { API } from "../../services/APIClient";
import InfoChip from "../Common/InfoChip";
import { useWeb3 } from "@3rdweb/hooks";
import NProgress from "nprogress";

import axios from "axios";
axios.defaults.withCredentials = true;

interface ResultPopupProps {
  isOpened: boolean;
  closePopup: () => void;
  didWin: boolean;
  didLoose: boolean;
}

const ResultPopup: FC<ResultPopupProps> = ({
  isOpened,
  didWin,
  closePopup,
  didLoose,
}) => {
  const wonRow = useGameStateStore(
    (state) => state.rows[state.rows.length - 1]
  );
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [sharedStatus, setSharedStatus] = useState<{
    isSharedToTwitter?: boolean;
    twitterId?: string;
    isNFTMinted?: boolean;
  }>({});
  const [correctWord, setCorrectWord] = useState<string | null | undefined>("");
  const {
    connectWallet,
    address: walletAddress,
    error: walletErrors,
  } = useWeb3();

  const { NEXT_PUBLIC_NFT_MINTER_ENDPOINT } = process.env;

  useEffect(() => {
    API.get("/shared-status")
      .then(({ data }) => {
        setSharedStatus(data);
      })
      .catch(() => {
        setSharedStatus({
          isSharedToTwitter: false,
        });
      });
  }, [didLoose, didWin]);

  useEffect(() => {
    if (!didLoose) {
      setCorrectWord(null);
      return;
    }

    API.get("/get-correct-word-if-loose")
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
          setSharedStatus({
            isSharedToTwitter: true,
            twitterId: id,
          });
        }
      )
      .catch(() => {
        setIsErrorOpen(true);
        setTimeout(() => {
          setIsErrorOpen(false);
        }, 1500);
      });
  };

  const mintNft = async () => {
    if (sharedStatus.isNFTMinted) {
      return;
    } else {
      if (walletAddress) {
        mintNFTApi();
      } else {
        await connectWallet("injected");
        if (!walletErrors) {
          mintNFTApi();
        }
      }
    }
  };

  console.log(NEXT_PUBLIC_NFT_MINTER_ENDPOINT);

  const mintNFTApi = () => {
    NProgress.start();
    axios
      .post(`${NEXT_PUBLIC_NFT_MINTER_ENDPOINT}/mintNFT`, {
        walletAddress,
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch(() => {
        setIsErrorOpen(true);
        setTimeout(() => {
          setIsErrorOpen(false);
        }, 1500);
      })
      .finally(() => {
        NProgress.done();
      });
  };

  return (
    <div>
      <InfoChip text="Error Occurred" isOpened={isErrorOpen} isError />
      <AnimatePresence initial={false} exitBeforeEnter>
        {isOpened &&
          Object.keys(sharedStatus).length >= 1 &&
          correctWord !== undefined &&
          (didWin || correctWord) && (
            <ModalBackdrop onClick={closePopup}>
              <motion.div
                className="modal absolute z-50 rounded-md bg-zinc-800/90 pt-3 text-lg text-white shadow-md backdrop-blur-sm"
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
                  bounce: 0.3,
                  type: "spring",
                  duration: 0.5,
                }}
              >
                <div className="flex flex-col items-center p-5">
                  <h3 className="text-2xl">
                    You {didWin ? "Won !" : "Loosed"}
                  </h3>
                  <p className="mb-5 leading-none text-zinc-400">
                    {didWin
                      ? "Awesome! Keep It Up"
                      : "Don't Worry Try Again Next Time!"}
                  </p>

                  <div
                    className={`${didWin ? "mb-10" : "mb-7"} flex space-x-2`}
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

                  <div className="mb-3 flex w-[22rem] flex-col space-y-2">
                    <button
                      className={`rounded ${
                        sharedStatus.isSharedToTwitter
                          ? "bg-sky-600"
                          : "bg-sky-500"
                      } py-2 pt-3 focus:ring focus:ring-sky-500/20`}
                      onClick={tweetWin}
                    >
                      {sharedStatus.isSharedToTwitter
                        ? "Open Tweet"
                        : `Tweet Your ${didWin ? "Win" : "Progress"}`}
                    </button>
                    {didWin && (
                      <button
                        className="rounded bg-pink-600 py-2 pt-3 focus:ring focus:ring-pink-500/20"
                        onClick={mintNft}
                      >
                        Generate An Exclusive NFT
                      </button>
                    )}
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
}) => {
  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded border ${
        isWon ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500"
      } pt-1 text-center text-2xl font-bold uppercase text-gray-100`}
    >
      <span className="leading-none">{value}</span>
    </div>
  );
};

export default ResultPopup;
