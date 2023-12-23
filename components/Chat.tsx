import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { useChat } from "@/lib/useChat";
import { Input } from "@/components/ui/input";
import BotMessageItem from "@/components/BotMessageItem";
import UserMessageItem from "@/components/UserMessageItem";

const Chat = () => {
  const t = useTranslations("Home");

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [activeInput, setActiveInput] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "InitInfo",
        role: "assistant",
        content: t.raw("ai_sayhi"),
      },
    ],
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({
      top: chatListBottomRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [chatListBottomRef.current?.scrollHeight, messages]);

  return (
    <div className="flex h-full flex-col">
      <div
        className="hide-scrollbar relative h-full overflow-y-scroll bg-[url('../public/nobody_role_1_bg.png')] bg-contain bg-no-repeat"
        ref={chatListBottomRef}
      >
        <div className="absolute top-0">
          {messages.length === 1 ? (
            <BotMessageItem
              message={messages[0].content}
              id={messages[0].id}
              key={messages[0].id}
            />
          ) : (
            messages.map((item) => {
              if (item.role == "assistant") {
                return (
                  <BotMessageItem
                    message={item.content}
                    id=""
                    key={`${item.id}_${new Date().toString()}`}
                  />
                );
              }
              if (item.role == "user") {
                return <UserMessageItem message={item.content} key={item.id} />;
              }
            })
          )}
        </div>
      </div>
      <form
        className=""
        onSubmit={(...args) => {
          handleSubmit(...args);
        }}
      >
        <Input
          placeholder="等你与我聊聊天…"
          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            if (!activeInput && Boolean(input)) {
              setActiveInput(true);
            }
            if (activeInput && !Boolean(input)) {
              setActiveInput(false);
            }
          }}
        />
      </form>
    </div>
  );
};

export default Chat;
