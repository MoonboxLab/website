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
      {/* <div className="mr-[6px] w-[32px] h-[32px] sm:mr-[10px] sm:w-[56px] sm:h-[56px] rounded-full relative shrink-0 ">
      <Image src="/chat_message_avatar.png" alt="chat avatar" fill priority />
    </div> */}
      {id == "InitInfo" ? (
        <div
          ref={messageRef}
          className="messageBox max-w-[700px] whitespace-pre-wrap rounded-[12px] bg-black/80 p-[12px] text-[16px] font-medium leading-[21px] text-white
    sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px]
    4xl:max-w-[800px]
    "
        ></div>
      ) : (
        <div
          className="messageBox max-w-[700px]  whitespace-pre-wrap rounded-[12px] bg-black/80 p-[12px] text-[16px] font-medium leading-[21px] text-white
    sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px]
    4xl:max-w-[800px]
    "
        >
          <Markdown rehypePlugins={[rehypeRaw]}>{message}</Markdown>
        </div>
      )}
    </div>
  );
}
