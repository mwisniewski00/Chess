import IGame from "components/models/game/IGame";
import "./GameChat.scss";
import { useEffect, useRef } from "react";
import useSocketClient from "hooks/useSocketClient";
import IChatMessage from "components/models/websocket/IChatMessage";
import MessageInput from "./message-input/MessageInput";

interface GameChatProps {
  game: IGame;
  setGame: React.Dispatch<React.SetStateAction<IGame>>;
}

const GameChat: React.FC<GameChatProps> = ({ game, setGame }) => {
  const socket = useSocketClient();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket.on(`new_message${game.id}`, (message: IChatMessage) => {
      setGame(prev => ({ ...prev, chat: [...prev.chat, message] }));
    });

    return () => {
      socket.off(`new_message${game.id}`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [game.chat]);

  return (
    <div className="chat-container">
      <div className="message-container">
        {game.chat &&
          game.chat.map((message, index) => (
            <div
              key={index}
              className={message.author ? "message" : "message system-message"}
            >
              {message.author && (
                <div className="message__author">{message.author}:</div>
              )}
              <div className="message__content">{message.message}</div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput game={game} />
    </div>
  );
};

export default GameChat;
