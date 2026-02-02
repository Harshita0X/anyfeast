import { ReactNode } from "react";
import Navbar from "./Navbar";
import AIBanner from "./AIBanner";
import AnimatedCharacter from "../onboarding/AnimatedCharacter";

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Navbar />
      <AIBanner />
      <main className="flex-1 overflow-hidden relative">
        {children}
        <AnimatedCharacter />
      </main>
    </div>
  );
};

export default OnboardingLayout;
