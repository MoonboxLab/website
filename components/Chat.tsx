import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { useChat } from "@/lib/useChat";
import { Input } from "@/components/ui/input";
import BotMessageItem from "@/components/BotMessageItem";
import UserMessageItem from "@/components/UserMessageItem";
import clsx from "clsx";

type ChatProps = {
  role: number;
  character: string;
  fullpageApi?: any
};

const Chat = (props: ChatProps) => {
  const t = useTranslations("Home");

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [activeInput, setActiveInput] = useState<boolean>(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      character: props.character,
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
    <div className="relative flex h-full flex-col px-[16px] sm:px-0 sm:pt-[40px] 4xl:pt-[60px]" onWheel={(event) => {
      event.stopPropagation();
    }}>
      <div
        className={clsx(
          "hide-scrollbar relative h-full overflow-y-scroll bg-contain bg-center bg-no-repeat",
          props.role === 1 && 'bg-[url("../public/nobody_role_1_bg.png")]',
          props.role === 2 && 'bg-[url("../public/nobody_role_2_bg.png")]',
          props.role === 3 && 'bg-[url("../public/nobody_role_3_bg.png")]',
          props.role === 4 && 'bg-[url("../public/nobody_role_4_bg.png")]',
          props.role === 5 && 'bg-[url("../public/nobody_role_5_bg.png")]',
        )}
        ref={chatListBottomRef}
        onScroll={(event) => {
          event.stopPropagation();
          props.fullpageApi?.setAllowScrolling(false, "up, down")
        }}
      >
        <div className="absolute top-0 w-full">
          {messages.map((item) => {
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
          })}
        </div>
      </div>
      <form
        onSubmit={(...args) => {
          handleSubmit(...args);
        }}
      >
        <Input
          enterKeyHint="send"
          placeholder={t("chat_with_me")}
          className="h-[48px] w-full flex-none  rounded-[28px] border-[2px] border-black bg-[#FFD600] px-[20px] text-[16px] font-normal leading-[16px] outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-black focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-[28px] 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
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
          onKeyDown={(event) => {
            // Bot尚未回复上条对话，禁止发送下一条对话
            if (event.keyCode === 13 && isLoading) {
              event.preventDefault();
            }
          }}
        />
      </form>
    </div>
  );
};

export default Chat;
