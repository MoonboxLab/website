import Image from "next/image";

type UserMessageItemProps = {
  message: String;
};

export default function UserMessageItem(props: UserMessageItemProps) {
  const { message } = props;

  return (
    <div className="mb-[30px] flex justify-end">
      <div className="max-w-[700px] rounded-[12px] bg-blue-500/80 p-[12px] text-[16px] font-medium leading-[21px] text-white sm:px-[18px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px] 4xl:max-w-[800px]">
        {message}
      </div>

      {/* <div className="w-[32px] h-[32px] ml-[6px] sm:ml-[10px] sm:w-[56px] sm:h-[56px] rounded-full relative shrink-0 ">
      <Image src="/user_message_avatar.png" alt="chat avatar" width={56} height={56} priority />
    </div> */}
    </div>
  );
}
