import Image from "next/image";

type UserMessageItemProps = {
  message: String;
};

export default function UserMessageItem(props: UserMessageItemProps) {
  const { message } = props;

  return (
    <div className="mb-[30px] flex flex-col items-end">
      <div className="max-w-[700px] rounded-[12px] bg-blue-500/80 p-[22px] text-[16px] font-medium leading-[21px] text-white sm:px-[26px] sm:py-[18px] sm:text-[18px] sm:font-normal sm:leading-[24px] 4xl:max-w-[800px]">
        {message}
      </div>
      <Image
        className="mr-[8px] h-[15px]"
        src="/user_message_bg.png"
        width={30}
        height={15}
        alt="message"
        priority
      />
    </div>
  );
}
