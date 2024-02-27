import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCountDown } from "ahooks";
import { MINT_START_TIME, RAFFLE_END_TIME, REFUND_END_TIME } from "@/constants/nobody_contract";
import clsx from "clsx";

type FooterProps = {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
};

const Footer = (props: FooterProps) => {
  const t = useTranslations("Home");

  const [mintStartCountdown] = useCountDown({ targetDate: MINT_START_TIME })
  const [raffleEndTime] = useCountDown({ targetDate: RAFFLE_END_TIME})
  const [refundEndTime] = useCountDown( {targetDate: REFUND_END_TIME})

  return (
    <div className="absolute bottom-0 left-0 z-50 flex h-[88px] w-full items-center bg-black/80 px-[20px] 4xl:h-[112px] 4xl:px-[30px]">
      <div className="flex">
        <Image
          className="object-contain"
          src="/mint_progress_next.png"
          height={48}
          width={20}
          alt="now"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold text-white 4xl:text-[24px]">
            {t("presale")}
          </span>
          <span className="text-[14px] font-semibold text-white 4xl:text-[18px]">
            {t("presale_time")}
          </span>
        </div>
      </div>

      <div className={clsx("ml-[30px] flex 4xl:ml-[50px] 5xl:ml-[100px]",raffleEndTime > 0 ? "text-[#FFD600]" : "text-white" )}>
        <Image
          className="object-contain"
          src={raffleEndTime > 0 ? "/mint_progress_now.png" :  "/mint_progress_next.png"}
          height={48}
          width={20}
          alt="next"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold 4xl:text-[24px]">
            {t("public_sale")}
          </span>
          <span className="text-[14px] font-semibold  4xl:text-[18px]">
            {t("public_sale_time")}
          </span>
        </div>
      </div>

      <div className={clsx("ml-[30px] flex 4xl:ml-[50px] 5xl:ml-[100px]", (raffleEndTime == 0 && refundEndTime > 0) ? "text-[#FFD600]" : "text-white")}>
        <Image
          className="object-contain"
          src={(raffleEndTime == 0 && refundEndTime > 0) ? "/mint_progress_now.png" :  "/mint_progress_next.png"}
          height={48}
          width={20}
          alt="next"
          priority
        />
        <div className="ml-[10px] flex flex-col justify-center 4xl:ml-[20px]">
          <span className="text-[18px] font-semibold  4xl:text-[24px]">
            {t("refund")}
          </span>
          <span className="text-[14px] font-semibold  4xl:text-[18px]">
            {t("refund_time")}
          </span>
        </div>
      </div>

      <div className="ml-auto flex">
        {
          mintStartCountdown > 0 &&
          <Link href={"/mint"} >
            <div className="hover-btn-shadow flex h-[64px] w-[200px] items-center justify-center rounded-[12px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:h-[72px] 4xl:w-[260px]">
              <span className="text-[21px] font-semibold leading-[21px] text-black 4xl:text-[24px] 4xl:leading-[24px]">
                {t("check_whitelist")}
              </span>
            </div>
          </Link>
        }

        {
          mintStartCountdown > 0 &&
          <div className="hover-btn-shadow ml-[20px] flex h-[64px] w-[200px] flex-col items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:ml-[30px] 4xl:h-[72px] 4xl:w-[260px]">
            <span className="text-[21px] font-semibold leading-[21px] text-black 4xl:text-[24px] 4xl:leading-[24px]">
              {t("mint")}
            </span>
            {(props.countdown.days !== 0 ||
              props.countdown.hours !== 0 ||
              props.countdown.minutes !== 0 ||
              props.countdown.seconds !== 0) && (
                <span className="mt-[5px] text-[16px] font-semibold leading-[16px] text-black 4xl:text-[18px] 4xl:leading-[18px]">
                  {t("count_down", {
                    day: props.countdown.days,
                    hour: props.countdown.hours,
                    minute: props.countdown.minutes,
                    second: props.countdown.seconds,
                  })}
                </span>
              )}
          </div>
        }

        {
          mintStartCountdown <= 0 &&
          <Link href={"/mint"}>
            <div className="hover-btn-shadow ml-[20px] flex h-[64px] w-[200px] flex-col items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:ml-[30px] 4xl:h-[72px] 4xl:w-[260px]">
              <span className="text-[21px] font-semibold leading-[21px] text-black 4xl:text-[24px] 4xl:leading-[24px]">
                {t("mint")}
              </span>
            </div>
          </Link>
        }
      </div>
    </div>
  );
};

export default Footer;
