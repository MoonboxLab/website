import Image from "next/image";

const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 z-50 flex h-[88px] w-full items-center bg-black/80 px-[20px] 4xl:h-[120px]">
      <Image
        className="hidden 4xl:block"
        src="/nobody_logo.png"
        height={64}
        width={64}
        alt="nobody logo"
        priority
      />
      <span className="ml-[10px] hidden text-[18px] font-bold text-white 4xl:block 4xl:text-[24px]">
        Nobody
      </span>
      <div className="flex 4xl:ml-[50px]">
        <Image
          src="/mint_progress_now.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[10px] flex flex-col 4xl:ml-[20px] ">
          <span className="text-[18px] font-semibold text-yellow-300 4xl:text-[24px]">
            Presale
          </span>
          <span className="text-[14px] font-semibold text-yellow-300 4xl:text-[18px]">
            01/23 08:00~01/24 08:00(UTC8)
          </span>
        </div>
      </div>
      <div className="ml-[40px] flex 4xl:ml-[50px]">
        <Image
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[10px] flex flex-col 4xl:ml-[20px] ">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            Public sale
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            01/24 08:00~01/25 08:00(UTC8)
          </span>
        </div>
      </div>

      <div className="ml-[40px] flex 4xl:ml-[50px]">
        <Image
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[10px] flex flex-col 4xl:ml-[20px] ">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            Refund
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            Start at 01-26 08:00(UTC8)
          </span>
        </div>
      </div>

      <div className="ml-auto flex">
        <div className="hover-btn-shadow flex h-[48px] w-[190px] items-center justify-center rounded-[10px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:h-[64px] 4xl:w-[260px]">
          <span className="text-[18px] font-semibold text-black 4xl:text-[21px]">
            Receive Waitlist
          </span>
        </div>

        <div className="hover-btn-shadow ml-[20px] flex h-[48px] w-[190px] items-center justify-center rounded-[10px] border-2 border-black bg-yellow-300 pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:ml-[30px] 4xl:h-[64px] 4xl:w-[260px]">
          <span className="text-[18px] font-semibold text-black 4xl:text-[21px]">
            Mint
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
