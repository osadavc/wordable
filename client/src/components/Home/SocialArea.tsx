import { FaTwitter } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const SocialArea = () => {
  return (
    <div className="min-h-[10rem] w-full bg-zinc-200 text-center font-josefin text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      <div className="flex h-[10rem] flex-col items-center justify-center space-y-3 text-2xl">
        <h2>Wordable</h2>
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex space-x-2">
            <a href="https://twitter.com/WordableW" target="_blank">
              <FaTwitter className="cursor-pointer" />
            </a>
            <a href="mailto:wordable.game@gmail.com" target="_blank">
              <MdMail className="cursor-pointer" />
            </a>
          </div>
          <a
            href="https://testnets.opensea.io/collection/wordable-wins"
            target="_blank"
          >
            <h3 className="text-base">See Wins NFT Collection On OpenSea</h3>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialArea;
