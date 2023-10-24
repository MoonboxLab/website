import Image from "next/image"

type BotMessageItemProps = {
  message: String
}

export default function BotMessageItem(props:BotMessageItemProps) {
  const { message } = props

  return <div className="flex mb-[24px] sm:mb-[30px]">
    <div className="mr-[10px] w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] rounded-full relative shrink-0 ">
      <Image src="/chat_message_avatar.png" alt="chat avatar" fill />
    </div>
    <div className=" rounded-[12px] bg-white sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:leading-[24px] sm:font-normal max-w-[700px]
    text-[16px] leading-[21px] font-medium p-[12px]
    ">
      {message}
    </div>
  </div>
}