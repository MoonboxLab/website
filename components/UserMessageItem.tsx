import Image from "next/image";

type UserMessageItemProps = {
  message: String;
};

export default function UserMessageItem(props: UserMessageItemProps) {
  const { message } = props;

  return (
    <div className="mb-[30px] flex flex-col items-end">
      <div className="max-w-[700px] rounded-[12px] bg-white/80 px-[14px] py-[8px] text-[16px] font-medium leading-[21px] text-black sm:px-[14px] sm:py-[10px] sm:font-normal sm:leading-[24px] 4xl:max-w-[800px] 4xl:text-[18px]">
        {message}
      </div>
      <Image
        className="mr-[8px] h-[8px]"
        src="/user_message_bg.png"
        width={15}
        height={8}
        alt="message"
        priority
      />
    </div>
  );
}
