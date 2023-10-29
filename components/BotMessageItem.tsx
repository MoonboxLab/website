import Image from "next/image"
import { useEffect, useRef } from "react"

type BotMessageItemProps = {
  message: String,
  id: String | number
}

export default function BotMessageItem(props: BotMessageItemProps) {
  const { message, id } = props

  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (id == 'InitInfo') {
      // @ts-ignore
      var typed = new Typed(messageRef.current, {
        strings: [message],
        typeSpeed: 40,
        cursorChar: ""
      })
      typed.start()
    }
  }, [])

  return <div className="flex mb-[24px] sm:mb-[30px]">
    <div className="mr-[6px] w-[32px] h-[32px] sm:mr-[10px] sm:w-[56px] sm:h-[56px] rounded-full relative shrink-0 ">
      <Image src="/chat_message_avatar.png" alt="chat avatar" fill priority />
    </div>
    <div ref={messageRef} className=" rounded-[12px] bg-white sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:leading-[24px] sm:font-normal max-w-[700px] 4xl:max-w-[800px]
    text-[16px] leading-[21px] font-medium p-[12px] whitespace-pre-wrap
    messageBox
    ">
      {id != "InitInfo" && message}
    </div>
  </div>
}