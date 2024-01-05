import { MAX_NFT_COUNT } from "@/constants/nobody_contract"
import { useSize } from "ahooks"
import clsx from "clsx"
import { useContractReads } from "wagmi"

export default function TotalReserved() {
  const screenSize = useSize(document.querySelector("body"))

  const mintedCount = 2234

  // TODO: 持续读取合约相关数据
  const { data: contractData } = useContractReads({
    contracts: [

    ],
    watch: true,
  })

  return <div className=" w-full xl:w-[420px] sm:h-[268px] sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
    <h3 className=" text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">Total Reserved</h3>

    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[30px]": (screenSize?.width || 0) <= 640 }
    )}>
      <div>
        <p className="text-[36px] sm:mt-[40px] sm:text-[36px] font-bold leading-[30px]">0 ETH</p>
        <p className=" mt-[20px] flex justify-between text-[18px] font-semibold leading-[18px]">
          <span>10% minted</span>
          <span>1000/{MAX_NFT_COUNT}</span>
        </p>
        <div className=" relative mt-[12px]">
          <p className=" absolute w-full h-[8px] rounded-[6px] bg-black/10"></p>
          <p className=" absolute h-[8px] rounded-[6px] bg-[rgba(255,214,0,1)] transition-all duration-500 after:absolute after:right-[0] after:top-[-3.5px] after:rounded-[50%] after:w-[14px] after:h-[14px] after:bg-[rgba(255,214,0,1)] after:shadow-progress-node" style={{
            width: `${(mintedCount <= MAX_NFT_COUNT) ? mintedCount / 100 : 100}%`
          }}></p>
          {
            mintedCount > MAX_NFT_COUNT &&
            <p className=" absolute left-0 h-[8px] rounded-[6px] bg-red-600 transition-all duration-500 after:absolute after:right-[0] after:top-[-3.5px] after:rounded-[50%] after:w-[14px] after:h-[14px] after:bg-[rgba(220,38,38,1)] after:shadow-progress-node-warn" style={{
              width: `${(mintedCount - MAX_NFT_COUNT) > 0 ? (mintedCount - MAX_NFT_COUNT) / 100 : 0}%`
            }}></p>
          }

        </div>
        <p className=" mt-[40px] text-[14px] font-semibold leading-[18px]">Nobody minting remains open over 100% cap. The actual airdrop order follows whitelist tiers.</p>
      </div>
    </div>
  </div>
}