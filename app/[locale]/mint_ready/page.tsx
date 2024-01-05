"use client"

import Header from "@/components/Header"
import Image from "next/image"
import MintUser from "./MintUser"
import MintRule from "./MintRule"
import MintSchedule from "./MintSchedule"
import TotalReserved from "./TotalReserved"
import { useAccount } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect, useMemo, useState } from "react"
import { useCountDown } from "ahooks"
import { PRESALE_END_TIME, PRESALE_START_TIME, REFUND_END_TIME, REFUND_START_TIME } from "@/constants/nobody_contract"
import moment from "moment"

export enum MintPeriod {
  Ready,
  Presale,
  Public,
  Refund,
  End,
}

export default function MintPage() {
  const { address } = useAccount()

  useEffect(() => {

    if (address) {
      // 检查地址状态
      // 1. 是否是白名单地址
      // 2. 是否提交过 Mint 转款

    }
  }, [address])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const { openConnectModal } = useConnectModal()
  const [endTimeCount] = useCountDown({ targetDate: PRESALE_END_TIME })

  const [presaleStartTime, presaleStartCountdown] = useCountDown({ targetDate: PRESALE_START_TIME })

  const [presaleEndTime, presaleEndCountdown] = useCountDown({ targetDate: PRESALE_END_TIME })

  const currentPeriod: MintPeriod = useMemo(() => {
    const now = moment()
    if (now.isBefore(moment(PRESALE_START_TIME))) {
      return MintPeriod.Ready;
    } else if (now.isBefore(moment(PRESALE_END_TIME)) && now.isSameOrAfter(moment(PRESALE_START_TIME))) {
      return MintPeriod.Presale;
    } else if (now.isBefore(moment(REFUND_END_TIME)) && now.isSameOrAfter(REFUND_START_TIME)) {
      return MintPeriod.Refund;
    } else if (now.isAfter(moment(REFUND_END_TIME))) {
      return MintPeriod.End;
    } else {
      return MintPeriod.Ready;
    }
  }, [endTimeCount])

  const [countDay, countHour, countMinute, countSecond] = useMemo(() => {
    let countdown
    if (presaleStartTime) {
      countdown = presaleStartCountdown
    } else if (presaleEndTime) {
      countdown = presaleEndCountdown
    }
    const { days, hours, minutes, seconds } = countdown || {}
    return [days, hours, minutes, seconds]
  }, [presaleStartTime, presaleEndTime])

  const handleMintNFT = async () => {

  }

  const whitelistMint = async () => {

  }

  const publicMint = async () => {

  }

  return <div className=" relative h-screen w-screen overflow-hidden">
    <Image src="/home_bg_mint.jpg" alt="background" fill className=" object-cover" />
    <Header />
    <div className=" relative h-screen w-screen pt-[120px] pb-[60px] overflow-y-auto">
      <div className="w-full px-[12px] sm:px-0 sm:w-[80%] lg:w-[65%] xl:w-[1200px] mx-auto ">
        <h3 className=" hidden sm:block text-[32px] font-bold leading-9 text-white mb-[30px]">Nobody Collection Mint</h3>
        <div className="">
          <div className="flex flex-col xl:flex-row">
            <div className="w-full xl:w-[760px] xl:h-[590px] py-[20px] px-[12px] xl:p-[30px] rounded-[24px] border-black border-[3px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className=" flex relative">
                <div className=" relative w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] xl:w-[320px] xl:h-[320px] rounded-[16px] overflow-hidden">
                  <Image src={"/alien_nft_cover.svg"} alt="nft-cover" fill />
                </div>
                <div className=" items-stretch h-full ml-[20px] py-[6px] xl:ml-[30px] xl:py-[10px] flex-col justify-between">
                  <div>
                    <h3 className=" text-[21px] leading-[21px] xl:text-[24px] font-bold xl:leading-[24px] mb-2">Mint Your NFT</h3>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">Supply: 10000</p>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">Price: 0.1 ETH</p>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">Max mint per address: 1</p>
                  </div>

                  <div className=" hidden lg:block absolute bottom-0">
                    {/* TODO: 不同阶段显示不同标题 */}
                    <h4 className=" text-[16px] xl:text-[18px] font-semibold leading-[18px]">Presale
                    </h4>
                    <div className=" text-[30px] xl:text-[36px] font-bold">
                      {/* @ts-ignore */}
                      <span className=" ">{countDay || '00'}</span>d:<span className=" ">{countHour || '00'}</span>h:<span className=" ">{countMinute || "00"}</span>m:<span className="countdown "><span style={{ "--value": countSecond }}></span></span>s
                    </div>
                  </div>
                </div>
              </div>

              {/* 未开始或已结束 */}
              {
                [MintPeriod.Ready, MintPeriod.End, MintPeriod.Refund].includes(currentPeriod) &&
                <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row items-center">
                  <div className=" relative w-[60px] h-[65px] shrink-0 hidden lg:block">
                    <Image src={"/icon_mint_wait.png"} alt="wait mint" fill />
                  </div>
                  <div className=" text-[18px] leading-[24px] font-medium text-center xl:text-left mb-[20px] lg:mb-0 mx-[20px]">
                    {currentPeriod == MintPeriod.Ready && "Wait Mint Event Start"}
                    {currentPeriod == MintPeriod.End && "Mint Ended"}
                    {currentPeriod == MintPeriod.Refund && "We are currently in the refund phase."}
                  </div>
                  <div className=" shrink-0">
                  </div>
                </div>
              }

              {
                [MintPeriod.Presale].includes(currentPeriod) && <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row items-center">
                  <div className=" relative w-[60px] h-[65px] shrink-0 hidden lg:block">
                    <Image src={"/icon_mint_wait.png"} alt="wait mint" fill />
                  </div>
                  <div className=" text-[18px] leading-[24px] font-medium text-center xl:text-left mb-[20px] lg:mb-0 mx-[20px]">Please connect the wallet and check Mint permissions.</div>
                  <div className=" shrink-0">
                    {
                      address ?
                        <div className=" h-[56px] w-full rounded-[28px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[280px]" onClick={handleMintNFT}>Mint</div>
                        :
                        <div className=" h-[56px] w-full rounded-[28px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[280px]" onClick={openConnectModal}>Connect Wallet</div>
                    }
                  </div>
                </div>
              }


              <div className=" hidden lg:block mt-[20px] xl:mt-0">
                <p>Smart Contract Info: <a href="https://google.com" target="__blank" className=" text-[rgba(59,132,255,1)] underline">0X1230239480239480239480239480</a></p>
              </div>
            </div>
            <div className="sm:mt-[20px] xl:mt-0 xl:ml-[20px] flex-col-reverse sm:flex-col">
              <TotalReserved />
              <MintSchedule currentPeriod={currentPeriod} />
            </div>
          </div>
          <div className="flex flex-col-reverse xl:flex-row justify-between sm:mt-[20px]">
            <MintRule />
            <MintUser />
          </div>
        </div>
      </div>
    </div>
  </div>
}