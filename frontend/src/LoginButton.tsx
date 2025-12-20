import { useAuth0 } from "@auth0/auth0-react";
import { ArrowRight } from "lucide-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-200/50 via-purple-200/50 via-violet-200/50 to-blue-200/50 hover:from-rose-300/60 hover:via-purple-300/60 hover:via-violet-300/60 hover:to-blue-300/60 rounded-full text-foreground font-medium text-lg transition-all duration-500 border border-border/60 hover:border-primary/50 watercolor-shadow-sm hover:watercolor-shadow hover:-translate-y-0.5"
    >
      Get Started
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
    </button>
  );
};

export default LoginButton;