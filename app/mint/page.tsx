"use client"

import ConnectWallet from "@/components/ConnectWallet";
import WhitelistWay from "./WhitelistWay";
import Image from "next/image";
import WhitelistSection from "./WhitelistSection";
import MintSection from "./MintSection";
import StageProgress from "./StageProgress";
import { StageType } from "@/constants/stage";

export default function Mint() {

  return <div className=" min-h-[calc(100vh-88px)]">
    <div className="h-[6px] lg:h-[10px] 3xl:h-[20px] bg-[#f3f3f3]"></div>
    <div className=" 2xl:max-w-[1200px] 3xl:max-w-[1200px] bg-white m-auto pb-[140px] flex flex-col items-center">


      <MintSection />

      <StageProgress currentStage={StageType.PublicSale} />

      <WhitelistSection />

      {/* <h2>Mint Page</h2>*/}
      {/* <ConnectWallet />  */}
    </div>
  </div>


}