import { useAuth0 } from "@auth0/auth0-react";
import { ArrowRight } from "lucide-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-200/40 via-purple-200/40 to-blue-200/40 hover:from-pink-200/60 hover:via-purple-200/60 hover:to-blue-200/60 rounded-full text-gray-900 font-light text-lg transition-all duration-300 border border-purple-200/30 hover:border-purple-300/50"
    >
      Get Started
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
    </button>
  );
};

export default LoginButton;