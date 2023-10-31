import Image from "next/image"

type UserMessageItemProps = {
  message: String
}

export default function UserMessageItem(props:UserMessageItemProps) {
  const { message } = props

  return <div className="flex mb-[30px] justify-end">
    <div className=" rounded-[12px] bg-[#FFE65AFF] sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:leading-[24px] sm:font-normal max-w-[700px] 4xl:max-w-[800px] text-[16px] leading-[21px] font-medium p-[12px]">
      {message}
    </div>

    <div className="w-[32px] h-[32px] ml-[6px] sm:ml-[10px] sm:w-[56px] sm:h-[56px] rounded-full relative shrink-0 ">
      <Image src="/user_message_avatar.png" alt="chat avatar" width={56} height={56} priority />
    </div>
  </div>
}