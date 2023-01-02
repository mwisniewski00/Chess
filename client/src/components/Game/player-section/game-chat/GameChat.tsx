import "./GameChat.scss";
import { useEffect, useRef } from "react";
import useSocketClient from "hooks/useSocketClient";
import IChatMessage from "components/models/websocket/IChatMessage";
import MessageInput from "./message-input/MessageInput";
import { useGameContext } from "components/game/GameProvider";

const GameChat: React.FC = () => {
  const socket = useSocketClient();
  const {
    chat,
    setChat,
    game: { id },
  } = useGameContext();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket.on(`new_message${id}`, (message: IChatMessage) => {
      setChat(prev => [...prev, message]);
    });

    return () => {
      socket.off(`new_message${id}`);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="chat-container">
      <div className="message-container">
        {chat &&
          chat.map((message, index) => (
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
      <MessageInput />
    </div>
  );
};

export default GameChat;
