import Image from "next/image";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Home");

  return (
    <div className="absolute bottom-0 left-0 z-50 flex h-[88px] w-full items-center bg-black/80 px-[20px] 4xl:h-[120px] 4xl:px-[30px]">
      <div className="flex">
        <Image
          className="object-contain"
          src="/mint_progress_now.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold text-[#FFD600] 4xl:text-[24px]">
            {t("presale")}
          </span>
          <span className="text-[14px] font-semibold text-[#FFD600] 4xl:text-[18px]">
            {t("presale_time")}
          </span>
        </div>
      </div>

      <div className="ml-[30px] flex 4xl:ml-[50px] 5xl:ml-[100px]">
        <Image
          className="object-contain"
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="next"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            {t("public_sale")}
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            {t("public_sale_time")}
          </span>
        </div>
      </div>

      <div className="ml-[30px] flex 4xl:ml-[50px] 5xl:ml-[100px]">
        <Image
          className="object-contain"
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="next"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            {t("refund")}
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            {t("refund_time")}
          </span>
        </div>
      </div>

      <div className="ml-auto flex">
        <div className="hover-btn-shadow flex h-[48px] w-[180px] items-center justify-center rounded-[12px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:h-[64px] 4xl:w-[260px]">
          <span className="text-[18px] font-semibold text-black 4xl:text-[21px]">
            {t("join_waitlist")}
          </span>
        </div>

        <div className="hover-btn-shadow ml-[20px] flex h-[48px] w-[160px] items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:ml-[30px] 4xl:h-[64px] 4xl:w-[260px]">
          <span className="text-[18px] font-semibold text-black 4xl:text-[21px]">
            {t("mint")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
