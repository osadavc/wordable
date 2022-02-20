import SingleFeature from "./SingleFeature";
import { FaTwitter } from "react-icons/fa";
import { BsFillFilePersonFill } from "react-icons/bs";
import { ImFire } from "react-icons/im";
import { RiLockFill } from "react-icons/ri";

const features = [
  {
    title: "More Fun",
    description:
      "With the more modern and feature rich wordable, you can have more fun than playing the original wordle !",
    icon: <ImFire />,
  },
  {
    title: "Unique NFT",
    description:
      "At the end of everyday if you win, you can mint a unique NFT which is in the blockchain !",
    icon: <BsFillFilePersonFill />,
  },
  {
    title: "No Cheating",
    description:
      "It is not possible to cheat as the original wordle, you can only win if you can find the word !",
    icon: <RiLockFill />,
  },
  {
    title: "Tweet By A Click",
    description:
      "Tweet your wins everyday with a single click, no more coping and pasting !",
    icon: <FaTwitter />,
  },
];

const Features = () => {
  return (
    <div>
      <div className="mx-auto max-w-7xl p-3 font-josefin capitalize text-zinc-700 dark:text-zinc-100">
        <div className="mt-10 text-center lg:mt-12">
          <h1 className="text-[1.7rem] font-bold">what you will enjoy</h1>
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
            Dozens of features than the original wordle that you will enjoy
            every day
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <SingleFeature key={i} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
