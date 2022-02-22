import { LetterState } from "../../utils/wordUtils";
import CharacterBox from "../Game/CharacterBox";

const GameIntro = () => {
  return (
    <div className="mx-auto max-w-7xl p-3 font-josefin capitalize text-zinc-700 dark:text-zinc-300">
      <div className="mt-10 text-center lg:mt-12">
        <h1 className="text-[1.7rem] font-bold">How To Play Wordable</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Wordable is a word game that is heavily inspired by{" "}
          <a
            href="https://www.nytimes.com/games/wordle"
            className="text-zinc-700 dark:text-zinc-300"
            target="_blank"
            rel="noreferrer"
          >
            Wordle
          </a>
        </p>
      </div>

      <div className="my-10 flex w-full flex-col-reverse space-x-3 md:flex-row">
        <div className="flex w-full flex-col items-center space-y-8 text-lg font-semibold">
          <div>
            <div className="mb-2 w-96">
              <h3>
                Letter O Exists In The Word And it is in the correct position
              </h3>
            </div>

            <div className="grid h-[4.5rem] w-[23rem] grid-cols-5 gap-[5px]">
              <CharacterBox value="R" state={LetterState.Empty} />
              <CharacterBox value="O" state={LetterState.Match} />
              <CharacterBox value="P" state={LetterState.Empty} />
              <CharacterBox value="E" state={LetterState.Empty} />
              <CharacterBox value="R" state={LetterState.Empty} />
            </div>
          </div>

          <div>
            <div className="mb-2 w-96">
              <h3>
                Letter T Exists In The Word And it is not in the correct
                position
              </h3>
            </div>

            <div className="grid h-[4.5rem] w-[23rem] grid-cols-5 gap-[5px]">
              <CharacterBox value="P" state={LetterState.Empty} />
              <CharacterBox value="I" state={LetterState.Empty} />
              <CharacterBox value="V" state={LetterState.Empty} />
              <CharacterBox value="O" state={LetterState.Empty} />
              <CharacterBox value="T" state={LetterState.Present} />
            </div>
          </div>

          <div>
            <div className="mb-2 w-96">
              <h3>Letter W Doesn&apos;t exist in the word</h3>
            </div>

            <div className="grid h-[4.5rem] w-[23rem] grid-cols-5 gap-[5px]">
              <CharacterBox value="S" state={LetterState.Empty} />
              <CharacterBox value="H" state={LetterState.Empty} />
              <CharacterBox value="A" state={LetterState.Empty} />
              <CharacterBox value="W" state={LetterState.Miss} />
              <CharacterBox value="M" state={LetterState.Empty} />
            </div>
          </div>
        </div>

    

        <div className="flex w-full flex-col items-center text-[1.15rem]">
          <div className="mb-10 w-[25rem] space-y-4 md:mt-0 md:w-full">
            <p className="rounded-md bg-zinc-200 px-3 py-2 dark:bg-zinc-800">
              Guess the word in 6 tries, Each guess must be a valid 5 letter
              word. Press the enter button to submit the word.
            </p>
            <p className="rounded-md bg-zinc-200 px-3 py-2 dark:bg-zinc-800">
              After your guess has been validated, the colour of the tiles will
              change according to if that character exists on the real word or
              not.
            </p>
            <p className="rounded-md bg-zinc-200 px-3 py-2 dark:bg-zinc-800">
              You can plan your subsequent guesses according to the tile colour
              of the previous characters
            </p>
            <p className="rounded-md bg-zinc-200 px-3 py-2 dark:bg-zinc-800">
              Finally You can share your win via twitter and optionally generate
              a unique NFT based on your word grid 🟩🟨⬛
            </p>
            <p className="rounded-md bg-zinc-200 px-3 py-2 dark:bg-zinc-800">
              More features are coming soon ! <br /> WAGMI !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
