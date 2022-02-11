import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { NextPage } from "next";
import { Session } from "next-auth";
import Header from "../components/Common/Header";
import Intro from "../components/Home/Intro";

interface HomeProps {
  user: Session;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loggedInUser={user} />
      <Intro loggedInUser={user} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return {
    props: { user: session },
  };
};

export default Home;
