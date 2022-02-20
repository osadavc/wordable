import { FC } from "react";

interface SingleFeatureProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const SingleFeature: FC<SingleFeatureProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col rounded-md bg-zinc-200 p-5 text-center shadow-sm dark:bg-zinc-800 dark:shadow-none">
      <div className="my-3 mb-4 flex justify-center text-3xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold dark:font-normal">{title}</h3>
      <p className="dark:text-zinc-300">{description}</p>
    </div>
  );
};

export default SingleFeature;
