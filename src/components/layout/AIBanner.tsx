import { Sparkles } from "lucide-react";

const AIBanner = () => {
  return (
    <div className="ai-banner">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 bg-success rounded-full flex items-center justify-center text-xs">✨</span>
          <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs">❤️</span>
        </div>
        <span className="font-medium text-foreground">Recipe Personalization Powered By AI</span>
        <span className="text-success font-medium">Active</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
        <span className="font-semibold text-success">ON</span>
        <div className="w-12 h-6 bg-success rounded-full relative">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default AIBanner;
