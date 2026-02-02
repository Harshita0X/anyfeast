import { ReactNode } from "react";

interface ChatAvatarProps {
  message: string;
  avatar: ReactNode;
}

const ChatAvatar = ({ message, avatar }: ChatAvatarProps) => {
  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <div className="w-16 h-16 flex-shrink-0">
        {avatar}
      </div>
      <div className="chat-bubble mt-4">
        <p className="text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export default ChatAvatar;
