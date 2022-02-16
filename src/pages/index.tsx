import { NextPage } from "next";
import { Session } from "next-auth";
import Header from "../components/Common/Header";
import Features from "../components/Home/Features";
import Intro from "../components/Home/Intro";
import withAuth from "../utils/withAuth";

interface HomeProps {
  user: Session;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loggedInUser={user} />
      <Intro loggedInUser={user} />
      <Features />
    </div>
  );
};

export default withAuth(Home);
