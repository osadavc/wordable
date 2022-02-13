import { NextPage } from "next";
import { useSession } from "next-auth/react";

const withAuth = (WrappedComponent: NextPage<any, any>) => {
  const Component = (props: any) => {
    const { data: user, status } = useSession();

    return status != "loading" ? (
      <WrappedComponent {...props} user={user} />
    ) : (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 font-josefin text-lg text-zinc-100">
        <h3>Loading ...</h3>
      </div>
    );
  };

  return Component;
};

export default withAuth;
