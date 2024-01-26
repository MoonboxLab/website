import { MAX_MINTABLE_COUNT, NFT_SALE_PRICE, NOBODY_CONTRACT_INFO } from "@/constants/nobody_contract"
import { useSize } from "ahooks"
import clsx from "clsx"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { formatEther } from "viem"
import { useContractReads } from "wagmi"

const extendMax1 = 80000

export default function TotalReserved() {
  const screenSize = useSize(document.querySelector("body"))
  const t = useTranslations("Mint")
  const locale = useLocale();
  console.log(locale)

  const [mintedCount, setMintedCount] = useState<number>(0)

  // 持续读取合约相关数据
  const { data: contractData } = useContractReads({
    contracts: [
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "totalReserved",
      }
    ],
    watch: true,
  })

  useEffect(() => {
    if (contractData) {
      const [totalReservedResult] = contractData

      if (totalReservedResult.status == "success") {
        setMintedCount(Number(totalReservedResult.result) || 0)
      }
    }
  }, [contractData])

  const handleProgress = () => {
    if (mintedCount <= MAX_MINTABLE_COUNT) {
      return 0
    } else if (mintedCount > MAX_MINTABLE_COUNT && mintedCount <= extendMax1) {
      return (mintedCount * 100 / extendMax1)
    } else if (mintedCount > extendMax1) {
      return 100
    }
  }

  return <div className=" w-full xl:w-[420px] sm:h-[268px] sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
    <h3 className=" text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">{t('TotalReserve.title')}</h3>

    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[30px]": (screenSize?.width || 0) <= 640 }
    )}>
      <div>
        <p className="text-[36px] sm:mt-[40px] sm:text-[36px] font-bold leading-[30px]">{(mintedCount * Number(formatEther(NFT_SALE_PRICE))).toFixed(4)} ETH</p>
        <p className=" mt-[20px] flex justify-between text-[18px] font-semibold leading-[18px]">
          <span>{((mintedCount * 100) / MAX_MINTABLE_COUNT).toFixed(2)}%
            {/* {t("TotalReserve.minted")} */}
          </span>
          <span>{mintedCount}/{MAX_MINTABLE_COUNT}</span>
        </p>
        <div className=" relative mt-[12px]">
          <p className=" absolute w-[calc(100%-14px)] left-[7px] h-[8px] rounded-[6px] bg-black/10"></p>
          <p className=" absolute h-[8px] max-w-[calc(100%-14px)] rounded-[6px] bg-[rgba(255,214,0,1)] transition-all duration-500 after:absolute after:right-[-14px] after:top-[-3.5px] after:rounded-[50%] after:w-[14px] after:h-[14px] after:bg-[rgba(255,214,0,1)] after:shadow-progress-node" style={{
            width: `${(mintedCount <= MAX_MINTABLE_COUNT) ? mintedCount / 100 : 100}%`
          }}></p>
          {
            mintedCount > MAX_MINTABLE_COUNT &&
            <p className=" absolute left-0 h-[8px] rounded-[6px] bg-red-600 transition-all duration-500 after:absolute after:right-[0] after:top-[-3.5px] after:rounded-[50%] after:w-[14px] after:h-[14px] after:bg-[rgba(220,38,38,1)] after:shadow-progress-node-warn" style={{
              width: `${handleProgress()}%`
            }}></p>
          }
        </div>
        <p className={clsx(
          locale == 'en' && "leading-[14px]", locale == 'zh' && "leading-[18px]",
          "mt-[35px] text-[12px] font-semibold ",
        )}>{t('TotalReserve.desc')}</p>
      </div>
    </div>
  </div>
}