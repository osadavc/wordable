import { FaTwitter } from "react-icons/fa";
import { MdMail } from "react-icons/md";

const SocialArea = () => {
  return (
    <div className="min-h-[10rem] w-full bg-zinc-800 text-center font-josefin text-zinc-300">
      <div className="flex h-[10rem] flex-col items-center justify-center space-y-3 text-2xl">
        <h2>Wordable</h2>
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex space-x-2">
            <a href="https://twitter.com/WordableW">
              <FaTwitter className="cursor-pointer" />
            </a>
            <a href="mailto:wordable.game@gmail.com">
              <MdMail className="cursor-pointer" />
            </a>
          </div>
          {/* TODO: Add Link Here */}
          <a href="#">
            <h3 className="text-base">See Wins NFT Collection On OpenSea</h3>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialArea;
