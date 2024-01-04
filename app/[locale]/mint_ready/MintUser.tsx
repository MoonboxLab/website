import { useSize } from "ahooks"
import clsx from "clsx"

export default function MintUser() {
  const screenSize = useSize(document.querySelector("body"))

  return <div className="w-full xl:w-[420px] sm:h-[390px] sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
    <h3 className="text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">Mint User</h3>
    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[20px] max-h-[300px] min-h-[150px]": (screenSize?.width || 0) <= 640 }
    )}>
      <div></div>
    </div>
  </div>
}