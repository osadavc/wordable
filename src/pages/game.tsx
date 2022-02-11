import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { FC } from "react";
import Header from "../components/Common/Header";
import GameBoard from "../components/Game/GameBoard";

interface GameProps {
  user: Session;
}

const Game: FC<GameProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loggedInUser={user} />
      <GameBoard />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return {
    props: { user: session },
  };
};

export default Game;
