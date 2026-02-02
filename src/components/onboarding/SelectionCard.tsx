import { ReactNode, CSSProperties } from "react";
import { Check } from "lucide-react";

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const SelectionCard = ({ selected, onClick, children, className = "", style }: SelectionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`selection-card relative ${selected ? "selected" : ""} ${className}`}
      style={style}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      {children}
    </button>
  );
};

export default SelectionCard;
