import { useRouter } from "next/router";
import { FC } from "react";
import { FaGamepad } from "react-icons/fa";

interface PlayGameButtonProps {
  lightColour?: boolean;
}

const PlayGameButton: FC<PlayGameButtonProps> = ({ lightColour = false }) => {
  const router = useRouter();

  return (
    <button
      className={`flex items-center justify-center space-x-3 rounded-md ${
        lightColour ? "bg-zinc-800" : "bg-zinc-900"
      } px-3 py-2`}
      onClick={() => router.push("/game")}
    >
      <FaGamepad />
      <p className="mt-[0.125rem]">Play Wordable</p>
    </button>
  );
};

export default PlayGameButton;
