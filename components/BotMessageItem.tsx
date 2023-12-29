import Image from "next/image";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type BotMessageItemProps = {
  message: string;
  id: String | number;
};

export default function BotMessageItem(props: BotMessageItemProps) {
  const { message, id } = props;

  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id == "InitInfo") {
      var typed = new Typed(messageRef.current, {
        strings: [message],
        typeSpeed: 15,
        cursorChar: "",
      });
    }
  }, []);

  return (
    <div className="mb-[24px] flex sm:mb-[30px]">
      {id == "InitInfo" ? (
        <div className="flex flex-col items-start">
          <div
            ref={messageRef}
            className="messageBox max-w-[700px] whitespace-pre-wrap rounded-[12px] bg-black/80 px-[24px] py-[12px] text-[16px] font-medium leading-[21px] text-white
    sm:px-[26px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px] 4xl:max-w-[800px]"
          ></div>
          <Image
            className="ml-[8px] h-[15px]"
            src="/bot_message_bg.png"
            width={30}
            height={15}
            alt="message"
            priority
          />
        </div>
      ) : (
        <div className="flex flex-col items-start">
          <div
            className="messageBox max-w-[700px]  whitespace-pre-wrap rounded-[12px] bg-black/80 px-[24px] py-[12px] text-[16px] font-medium leading-[21px] text-white
    sm:px-[26px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px]
    4xl:max-w-[800px]"
          >
            <Markdown rehypePlugins={[rehypeRaw]}>{message}</Markdown>
          </div>
          <Image
            className="ml-[8px] h-[15px]"
            src="/bot_message_bg.png"
            width={30}
            height={15}
            alt="message"
            priority
          />
        </div>
      )}
    </div>
  );
}
