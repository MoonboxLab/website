import Image from "next/image";

const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 flex h-[120px] w-full items-center bg-black/80 px-[30px]">
      <Image
        src="/nobody_logo.png"
        height={64}
        width={64}
        alt="nobody logo"
        priority
      />
      <span className="ml-[10px] text-[18px] 4xl:text-[24px] font-bold text-white">Nobody</span>
      <div className="ml-[50px] flex">
        <Image
          src="/mint_progress_now.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[20px] flex flex-col ">
          <span className="text-[18px] font-semibold text-yellow-300 4xl:text-[24px]">
            Presale
          </span>
          <span className="text-[14px] font-semibold text-yellow-300 4xl:text-[18px]">
            01/23 08:00~01/24 08:00(UTC8)
          </span>
        </div>
      </div>
      <div className="ml-[60px] flex">
        <Image
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[20px] flex flex-col ">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            Public sale
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            01/24 08:00~01/25 08:00(UTC8)
          </span>
        </div>
      </div>

      <div className="ml-[60px] flex">
        <Image
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[20px] flex flex-col ">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            Refund
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            Start at 01-26 08:00(UTC8)
          </span>
        </div>
      </div>

      <div className="hover-btn-shadow ml-auto flex h-[64px] w-[320px] items-center justify-center rounded-[10px] border-2 border-black bg-yellow-300 pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <span className="text-[18px] 4xl:text-[21px] font-semibold text-black">
          Mint
        </span>
      </div>
    </div>
  );
};

export default Footer;
