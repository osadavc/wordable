import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { FC } from "react";
import Header from "../components/Common/Header";
import AllGameList from "../components/Game/AllGameList";
import GameBoard from "../components/Game/GameBoard";
import { Game } from "../interfaces/game.interface";
import { API } from "../services/APIClient";
import { GuessRow } from "../stores/gameState";
import withAuth from "../utils/withAuth";

interface GameProps {
  user: Session;
  previousGameState: {
    guesses: GuessRow[];
  };
  allGames: Game[];
}

const Game: FC<GameProps> = ({ previousGameState, user, allGames }) => {
  return (
    <div className="min-h-screen bg-zinc-900 font-josefin">
      <Header loggedInUser={user} />
      <div className="mx-auto flex max-w-7xl flex-col items-center pt-24 lg:flex-row lg:items-stretch lg:pt-36">
        <div className="mt-5 flex flex-grow flex-col justify-center lg:mt-0">
          <h1 className="ml-[10px] text-lg text-zinc-100">Daily Puzzle 🧩</h1>
          <GameBoard previousGameState={previousGameState} />
        </div>

        <div className="mainBoard gameList my-9 lg:my-0 lg:!w-full">
          <h1 className="ml-[10px] text-lg text-zinc-100">Previous Games 🎮</h1>

          <div className="h-full w-full p-[10px]">
            <div className="h-full w-full overflow-y-scroll rounded-md bg-zinc-800">
              <AllGameList games={allGames} />
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
