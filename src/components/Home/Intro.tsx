import { Session } from "next-auth";
import { FC } from "react";
import { APP_NAME } from "../../utils/constants";
import PlayGameButton from "../Common/PlayGameButton";
import TwitterButton from "../Common/TwitterButton";

interface IntroProps {
  loggedInUser: Session;
}

const Intro: FC<IntroProps> = ({ loggedInUser }) => {
  return (
    <div>
      <div className="mx-auto max-w-7xl p-3 pt-[6.5rem] font-josefin">
        <div className="my-5 flex select-none justify-center space-x-2 text-center text-2xl font-bold uppercase text-white md:space-x-2">
          {APP_NAME.split("").map((letter, index) => {
            return (
              <div
                className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded bg-gradient-to-bl from-emerald-500 to-emerald-700 pt-1 text-center shadow-sm md:h-[3rem] md:w-[3rem]"
                key={index}
              >
                {letter}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center capitalize lg:mt-12">
          <h1 className="text-3xl font-bold text-zinc-100">
            a game that you will love
          </h1>
          <p className="mt-1 text-lg text-zinc-400">
            The fully featured web3 friendly modern wordle that you can&apos;t
            cheat 😉
          </p>
        </div>

        <div className="mt-2 flex justify-center text-white">
          {loggedInUser ? <PlayGameButton lightColour /> : <TwitterButton />}
        </div>

        <div className="relative mt-10 w-full overflow-hidden rounded-lg border border-zinc-800 lg:mt-12">
          <img
            src="/images/web_page_screenshot.png"
            className="h-[500px] rounded-lg object-cover shadow-sm shadow-zinc-600/20 md:h-auto"
            alt="Wordable Screenshot"
          />
        </div>
      </div>
    </div>
  );
};

export default Intro;
