import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface TipBoxProps {
  children: ReactNode;
}

const TipBox = ({ children }: TipBoxProps) => {
  return (
    <div className="tip-box animate-fade-up-delay-1">
      <Sparkles className="w-5 h-5 text-accent-foreground flex-shrink-0" />
      <p className="text-sm text-accent-foreground">{children}</p>
    </div>
  );
};

export default TipBox;
