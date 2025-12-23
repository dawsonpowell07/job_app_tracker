import { useClerk } from "@clerk/clerk-react";

const LogoutButton = () => {
  const { signOut } = useClerk();
  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="button logout"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
