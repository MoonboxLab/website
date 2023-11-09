"use client"

import ConnectWallet from "@/components/ConnectWallet";
import WhitelistWay from "./WhitelistWay";
import Image from "next/image";
import WhitelistSection from "./WhitelistSection";
import MintSection from "./MintSection";
import StageProgress from "./StageProgress";
import { PresaleMintEndTime, PresaleMintStartTime, PublicMintEndTime, StageType } from "@/constants/stage";
import { useContractReads } from "wagmi";
import { CONTRACT_ABI, NFT_CONTRACT_ADDRESS, ContractInfo } from "@/constants/contract";
import { useMemo } from "react";
import moment from "moment";
import { useCountDown } from "ahooks";

export default function Mint() {

  // 读取合约相关数据
  const { data: contractData } = useContractReads({
    contracts: [
      {
        ...ContractInfo,
        functionName: "isAllowListActive"
      },
      {
        ...ContractInfo,
        functionName: "isPublicSaleActive"
      },
    ],
    watch: true,
  })

  const [endTimeCount] = useCountDown({ targetDate: PublicMintEndTime })

  const currentStage: StageType = useMemo(() => {

    const [{ result: isAllowListActive = false }, { result: isPublicSaleActive = false }] = contractData || [{}, {}]

    // 判断切换 Mint 阶段的逻辑
    if (moment().isBefore(moment(PresaleMintStartTime).subtract(1, 'd'))) {
      return StageType.WhitelistPhase
    } else if (moment().isBefore(PresaleMintEndTime)) {
      return StageType.Presale
    } else if (moment().isBefore(PublicMintEndTime)) {
      return StageType.PublicSale
    } else {
      return StageType.EndSale
    }

  }, [contractData, endTimeCount])


  return <div className=" min-h-[calc(100vh-88px)]">
    <div className="h-[6px] lg:h-[10px] 4xl:h-[12px] bg-[#f3f3f3]"></div>
    <div className=" 2xl:max-w-[1200px] 4xl:max-w-[1200px] bg-white m-auto lg:pb-[140px] flex flex-col items-center">

      <MintSection currentStage={currentStage} />

      <StageProgress currentStage={currentStage} />

      <WhitelistSection />

    </div>
  </div>
}