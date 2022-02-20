import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { FC, useEffect } from "react";
import Header from "../components/Common/Header";
import AllGameList from "../components/Game/AllGameList";
import GameBoard from "../components/Game/GameBoard";
import { Game } from "../interfaces/game.interface";
import { API } from "../services/APIClient";
import { GuessRow } from "../stores/gameState";
import withAuth from "../utils/withAuth";
import { useGameStateStore } from "../stores/gameState";

interface GameProps {
  user: Session;
  previousGameState: {
    guesses: GuessRow[];
  };
  allGames: Game[];
}

const Game: FC<GameProps> = ({ previousGameState, user, allGames }) => {
  useEffect(() => {
    useGameStateStore.setState({
      allGames,
    });
  }, [allGames]);

  return (
    <div className="min-h-screen bg-gray-100 font-josefin dark:bg-zinc-900">
      <Header loggedInUser={user} />
      <div className="mx-auto flex max-w-7xl flex-col items-center pt-24 text-zinc-800 dark:text-zinc-100 lg:flex-row lg:items-stretch lg:pt-36">
        <div className="mt-5 flex flex-grow flex-col justify-center lg:mt-0">
          <h1 className="ml-[10px] text-lg">Daily Puzzle 🧩</h1>
          <GameBoard previousGameState={previousGameState} />
        </div>

        <div className="mainBoard gameList my-9 lg:my-0 lg:!w-full">
          <h1 className="ml-[10px] text-lg">Previous Games 🎮</h1>

          <div className="h-full w-full p-[10px]">
            <div className="h-full w-full overflow-y-auto rounded-md bg-zinc-200 dark:bg-zinc-800">
              <AllGameList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { cookie } = ctx.req.headers;

  try {
    const [currentGameData, allGamesData] = await Promise.all([
      API.get("/get-previous-rows", {
        headers: { cookie: cookie! },
      }),
      API.get("/get-all-games", {
        headers: { cookie: cookie! },
      }),
    ]);

    const {
      data: { result: gameState },
    } = currentGameData;

    const {
      data: { result: allGames },
    } = allGamesData;

    return {
      props: { previousGameState: gameState ?? null, allGames: allGames ?? [] },
    };
  } catch (error) {
    return {
      props: { previousGameState: null },
    };
  }
};

export default withAuth(Game);
