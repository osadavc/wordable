import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { FC } from "react";
import Header from "../components/Common/Header";
import GameBoard from "../components/Game/GameBoard";
import { API } from "../services/APIClient";
import { GuessRow } from "../stores/gameState";

interface GameProps {
  user: Session;
  previousGameState: {
    guesses: GuessRow[];
  };
}

const Game: FC<GameProps> = ({ user, previousGameState }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loggedInUser={user} />
      <GameBoard previousGameState={previousGameState} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { cookie } = ctx.req.headers;

  try {
    const session = await getSession(ctx);
    const {
      data: { gameState },
    } = await API.get("/get-previous-rows", {
      headers: { cookie: cookie! },
    });

    return {
      props: { user: session, previousGameState: gameState },
    };
  } catch (error) {
    return {
      props: { user: null, previousGameState: null },
    };
  }
};

export default Game;
