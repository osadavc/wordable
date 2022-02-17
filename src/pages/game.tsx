import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { FC } from "react";
import Header from "../components/Common/Header";
import GameBoard from "../components/Game/GameBoard";
import { API } from "../services/APIClient";
import { GuessRow } from "../stores/gameState";
import withAuth from "../utils/withAuth";

interface GameProps {
  user: Session;
  previousGameState: {
    guesses: GuessRow[];
  };
}

const Game: FC<GameProps> = ({ previousGameState, user }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loggedInUser={user} />
      <div className="flex">
        <GameBoard previousGameState={previousGameState} />
        <h1>Hello</h1>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { cookie } = ctx.req.headers;

  try {
    const {
      data: { gameState },
    } = await API.get("/get-previous-rows", {
      headers: { cookie: cookie! },
    });

    return {
      props: { previousGameState: gameState ?? null },
    };
  } catch (error) {
    return {
      props: { previousGameState: null },
    };
  }
};

export default withAuth(Game);
