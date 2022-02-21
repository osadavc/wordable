import { NextPage } from "next";
import { Session } from "next-auth";
import Header from "../components/Common/Header";
import Features from "../components/Home/Features";
import GameIntro from "../components/Home/GameIntro";
import Intro from "../components/Home/Intro";
import SocialArea from "../components/Home/SocialArea";
import withAuth from "../utils/withAuth";

interface HomeProps {
  user: Session;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Header loggedInUser={user} />
      <Intro loggedInUser={user} />
      <Features />
      <GameIntro />
      <SocialArea />
    </div>
  );
};

export default withAuth(Home);
