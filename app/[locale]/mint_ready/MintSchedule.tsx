import { useSize } from "ahooks"
import clsx from "clsx"
import { MintPeriod } from "./page";
import Image from "next/image";

interface MintScheduleProps{
  currentPeriod: MintPeriod
}
export default function MintSchedule(props: MintScheduleProps) {
  const { currentPeriod } = props
  const screenSize = useSize(document.querySelector("body"))

  return <div className=" w-full mt-[20px] xl:w-[420px] h-[302px] sm:bg-white sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
    <h3 className=" text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">Mint Schedule</h3>
    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[30px] min-h-[248px]": (screenSize?.width || 0) <= 640 }
    )}>
      <div>
        <div className="flex justify-start mb-[15px]">
          <div className=" relative w-[16px] h-[52px] ">
             <Image src={currentPeriod === MintPeriod.Presale ? "/mint_stage_active.png" : "/mint_stage_no_active.png"} fill alt="stage label" />
          </div>
          <div className={clsx(
            " ml-5 text-[18px] font-semibold leading-[24px] text-black/100",
            {
              "opacity-30": currentPeriod != MintPeriod.Presale
            }
          )}>
            <p>Presale</p>
            <p>01/23 08:00~01/24 08:00</p>
          </div>
        </div>
        <div className="flex justify-start mb-[15px]">
          <div className=" relative w-[16px] h-[52px] ">
             <Image src={currentPeriod === MintPeriod.Public ? "/mint_stage_active.png" : "/mint_stage_no_active.png"} fill alt="stage label" />
          </div>
          <div className={clsx(
            " ml-5 text-[18px] font-semibold leading-[24px] text-black/100",
            {
              " opacity-30": currentPeriod != MintPeriod.Public
            }
          )}>
            <p>Public sale</p>
            <p>01/24 08:00~01/25 08:00</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className=" relative w-[16px] h-[52px] ">
             <Image src={currentPeriod === MintPeriod.Refund ? "/mint_stage_active.png" : "/mint_stage_no_active.png"} fill alt="stage label" />
          </div>
          <div className={clsx(
            " ml-5 text-[18px] font-semibold leading-[24px] text-black/100",
            {
              " opacity-30": currentPeriod != MintPeriod.Refund
            }
          )}>
            <p>Refund</p>
            <p>Start at 01-26 08:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
}