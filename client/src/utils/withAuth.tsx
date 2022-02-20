import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const withAuth = (WrappedComponent: NextPage<any, any>) => {
  const Component = (props: any) => {
    const { data: user, status } = useSession();

    useEffect(() => {
      if (user?.error == "RefreshAccessTokenError") {
        signIn("twitter");
      }
    }, []);

    return status != "loading" ? (
      <WrappedComponent {...props} user={user} />
    ) : (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-100 font-josefin text-lg text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <h3>Loading ...</h3>
      </div>
    );
  };

  return Component;
};

export default withAuth;
