import { FC } from "react";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { HiOutlineLogout } from "react-icons/hi";
import { signOut } from "next-auth/react";
import TwitterButton from "./TwitterButton";
import PlayGameButton from "./PlayGameButton";
import { GameState, useGameStateStore } from "../../stores/gameState";

interface HeaderProps {
  loggedInUser: Session;
}

const Header: FC<HeaderProps> = ({ loggedInUser }) => {
  const router = useRouter();
  const isDashboardPage = router.pathname != "/";

  const { setIsResultOpen, gameState } = useGameStateStore();

  return (
    <header className="fixed z-50 flex min-h-[90px] w-full flex-col justify-center bg-zinc-800/60 font-josefin text-slate-100 shadow-md shadow-zinc-900 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl justify-between px-3">
        <div
          className="mt-2 flex cursor-pointer space-x-2 md:space-x-3 lg:space-x-4"
          onClick={() => router.push("/")}
        >
          <div className="shadow-sl flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded bg-gradient-to-bl from-emerald-500 to-emerald-700 pt-1 text-center text-xl font-bold">
            W
          </div>
          <div>
            <h1 className="select-none text-2xl font-bold uppercase leading-none">
              Wordable
            </h1>
            <span className="text-sm">The Modern Wordle</span>
          </div>
        </div>

        {!isDashboardPage ? (
          <div className="flex items-center justify-center">
            {loggedInUser ? <PlayGameButton /> : <TwitterButton />}
          </div>
        ) : (
          <div className="flex space-x-4">
            <div className="flex items-center justify-center">
              {gameState == GameState.LOST ||
                (gameState == GameState.WON && (
                  <button
                    className="flex items-center justify-center space-x-3 rounded-md bg-zinc-900 px-3 py-2"
                    onClick={() => setIsResultOpen(true)}
                  >
                    <p className="mt-[0.125rem]">Open Results</p>
                  </button>
                ))}
            </div>
            <div className="flex items-center justify-center">
              <button
                className="flex items-center justify-center space-x-3 rounded-md bg-zinc-900 px-3 py-2"
                onClick={() => signOut()}
              >
                <HiOutlineLogout />
                <p className="mt-[0.125rem]">Logout</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
