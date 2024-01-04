import { useSize } from "ahooks"
import clsx from "clsx"

export default function MintRule() {
  const screenSize = useSize(document.querySelector("body"))

  return <div className={
    clsx(
      "w-full h-auto overflow-visible xl:w-[760px] sm:h-[390px] sm:overflow-y-scroll sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:mt-[20px] xl:mt-0",
    )
  }>
    <h3 className=" text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">Mint Rules</h3>
    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[20px]": (screenSize?.width || 0) <= 640 }
    )}>
      <p className=" text-[18px] font-medium leading-[30px]">1. Moonbox blends the world of web3 with AI-powered interactive storytelling.</p>
      <p className=" text-[18px] font-medium leading-[30px]">2. they’re your personal AI character, designed to converse and immerse you in a unique narrative journey. </p>
      <p className=" text-[18px] font-medium leading-[30px]">3. Keep an eye out for the debut of our next NFT collection.</p>
      <p className=" text-[18px] font-medium leading-[30px]">4. Moonbox blends the world of web3 with AI-powered interactive storytelling.</p>
      <p className=" text-[18px] font-medium leading-[30px]">5. they’re your personal AI character, designed to converse and immerse you in a unique narrative journey.</p>
      <p className=" text-[18px] font-medium leading-[30px]">6. Keep an eye out for the debut of our next NFT collection.</p>
      <p className=" text-[18px] font-medium leading-[30px]">6. Keep an eye out for the debut of our next NFT collection.</p>
      <p className=" text-[18px] font-medium leading-[30px]">6. Keep an eye out for the debut of our next NFT collection.</p>
      <p className=" text-[18px] font-medium leading-[30px]">6. Keep an eye out for the debut of our next NFT collection.</p>
      <p className=" text-[18px] font-medium leading-[30px]">6. Keep an eye out for the debut of our next NFT collection.</p>
    </div>

  </div>
}