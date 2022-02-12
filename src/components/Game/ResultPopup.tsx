import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalBackdrop from "../Common/ModalBackdrop";
import { useGameStateStore } from "../../stores/gameState";
import { API } from "../../services/APIClient";
import InfoChip from "../Common/InfoChip";

interface ResultPopupProps {
  isOpened: boolean;
  closePopup: () => void;
  didWin: boolean;
}

const ResultPopup: FC<ResultPopupProps> = ({
  isOpened,
  didWin,
  closePopup,
}) => {
  const wonRow = useGameStateStore(
    (state) => state.rows[state.rows.length - 1]
  );
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [tweetStatus, setTweetStatus] = useState<{
    isSharedToTwitter?: boolean;
    twitterId?: string;
  }>({});
  const [correctWord, setCorrectWord] = useState<string | null | undefined>("");

  const tweetWin = () => {
    if (tweetStatus.isSharedToTwitter) {
      window.open(
        `https://twitter.com/user/status/${tweetStatus.twitterId}`,
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
          setTweetStatus({
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

  useEffect(() => {
    API.get("/tweet-status")
      .then(({ data }) => {
        setTweetStatus(data);
      })
      .catch(() => {
        setTweetStatus({
          isSharedToTwitter: false,
        });
      });
  }, []);

  useEffect(() => {
    if (didWin) {
      setCorrectWord(null);
      return;
    }

    API.get("/get-correct-word-if-loose")
      .then(({ data: { word } }) => {
        setCorrectWord(word);
      })
      .catch(() => {});
  }, [didWin]);

  return (
    <div>
      <InfoChip text="Error Occurred" isOpened={isErrorOpen} isError />
      <AnimatePresence initial={false} exitBeforeEnter>
        {isOpened &&
          Object.keys(tweetStatus).length >= 1 &&
          correctWord !== undefined && (
            <ModalBackdrop onClick={closePopup}>
              <motion.div
                className="modal absolute z-50 rounded-md bg-zinc-800 pt-3 text-lg text-white shadow-md"
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

                  <div className="mb-11 flex space-x-2">
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
                        tweetStatus.isSharedToTwitter
                          ? "bg-sky-600"
                          : "bg-sky-500"
                      } py-2 pt-3 focus:ring focus:ring-sky-500/20`}
                      onClick={tweetWin}
                    >
                      {tweetStatus.isSharedToTwitter
                        ? "Open Tweet"
                        : "Tweet Your Win"}
                    </button>
                    <button className="rounded bg-pink-600 py-2 pt-3 focus:ring focus:ring-pink-500/20">
                      Generate An Exclusive NFT
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
