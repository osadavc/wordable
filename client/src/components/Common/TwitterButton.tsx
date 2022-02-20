import { signIn } from "next-auth/react";
import { FaTwitter } from "react-icons/fa";

const TwitterButton = () => {
  return (
    <button
      className="transition-color flex items-center justify-center space-x-3 rounded-md bg-gradient-to-br from-sky-500 to-sky-600 px-3 py-2 text-zinc-200 dark:to-sky-700"
      onClick={() => {
        signIn("twitter", {
          callbackUrl: `${window.location.origin}/game`,
        });
      }}
    >
      <FaTwitter />
      <p className="mt-[0.125rem]">Login With Twitter</p>
    </button>
  );
};

export default TwitterButton;
