import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import { Button } from "./components/ui/button";

const LoginButton = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-3">
      <SignInButton mode="modal" redirectUrl="/">
        <button className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#8da9c4]/50 via-[#134074]/50 to-[#8da9c4]/50 hover:from-[#8da9c4]/60 hover:via-[#134074]/60 hover:to-[#8da9c4]/60 rounded-full text-foreground font-medium text-lg transition-all duration-500 border border-border/60 hover:border-primary/50 watercolor-shadow-sm hover:watercolor-shadow hover:-translate-y-0.5">
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </SignInButton>
    </div>
  );
};

export default LoginButton;
