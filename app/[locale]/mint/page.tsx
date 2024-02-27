"use client"

import Header from "@/components/Header"
import Image from "next/image"
import MintUser from "./MintUser"
import MintRule from "./MintRule"
import MintSchedule from "./MintSchedule"
import TotalReserved from "./TotalReserved"
import { useAccount, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useEffect, useMemo, useState } from "react"
import { useCountDown } from "ahooks"
import { ADDRESS, MAX_AMOUNT_PRE_ADDRESS, MAX_NFT_COUNT, MINT_END_TIME, MINT_FIRST_HOUR, MINT_START_TIME, MintPeriod, NFT_SALE_PRICE, NOBODY_CONTRACT_ADDRESS, NOBODY_CONTRACT_INFO, RAFFLE_END_TIME, RAFFLE_START_TIME, REFUND_END_TIME, REFUND_START_TIME } from "@/constants/nobody_contract"
import moment from "moment"
import { useLocale, useTranslations } from "next-intl"
import { formatEther } from "viem"
import clsx from "clsx"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

export default function MintPage() {
  const { address } = useAccount()
  const t = useTranslations('Mint');
  const locale = useLocale();

  const [isWhitelist, setWhitelist] = useState<boolean>(false)
  const [isDeposited, setDeposited] = useState<boolean>(false);

  const [isSelected, setSelected] = useState<boolean>(false);

  const [isClaimed, setClaimed] = useState<boolean>(false);

  const [isPublicReserveStop, setPublicReserveStop] = useState<boolean>(true);

  const [isWhitelistMintOpen, setWhitelistMintOpen] = useState<boolean>(false);

  const { data: addressContractInfo } = useContractReads({
    contracts: [
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "whitelist",
        args: [address as ADDRESS]
      },
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "reserved",
        args: [address as ADDRESS]
      },
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "raffleWon",
        args: [address as ADDRESS]
      },
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "refunded",
        args: [address as ADDRESS]
      },
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "isPublicReserveActive",
      },
      {
        ...NOBODY_CONTRACT_INFO,
        functionName: "isWhitelistReserveActive"
      }
    ],
    watch: true
  })

  useEffect(() => {
    console.log(addressContractInfo)
    if (address && addressContractInfo) {
      /// 检查地址状态
      // 1. 是否是白名单地址
      // 2. 是否提交过 Mint 转款

      /// 抽奖结果是否产生
      // 3. 判断是否参与
      // 4. 参与抽奖结果

      // 5. 可退款地址是否已执行退款操作
      const [
        whitelistResult,
        reservedResult,
        raffleWonResult,
        refundResult,
        publicReserveResult,
        whitelistReserveOpenResult
      ] = addressContractInfo as { error?: any, result?: any, status: any }[]

      if (whitelistResult.status == "success") {
        setWhitelist(whitelistResult.result || false)
      }

      if (reservedResult.status == "success") {
        setDeposited(reservedResult.result || false)
      }

      if (raffleWonResult.status == 'success') {
        setSelected(raffleWonResult.result || false)
      }

      if (refundResult.status == 'success') {
        setClaimed(refundResult.result || false)
      }

      if (publicReserveResult.status == 'success') {
        setPublicReserveStop(!publicReserveResult.result)
      }

      if (whitelistReserveOpenResult.status == 'success') {
        setWhitelistMintOpen(whitelistReserveOpenResult.result || false)
      }
    }
  }, [address, addressContractInfo])


  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { openConnectModal } = useConnectModal()
  const [endTimeCount] = useCountDown({ targetDate: REFUND_END_TIME })

  const [saleStartTime, saleStartCountdown] = useCountDown({ targetDate: MINT_START_TIME })

  const [saleEndTime, saleEndCountdown] = useCountDown({ targetDate: MINT_END_TIME })

  const [firstHour, firstHourCountdown] = useCountDown({ targetDate: MINT_FIRST_HOUR })

  const currentPeriod: MintPeriod = useMemo(() => {
    // const now = moment("2024-01-22 14:00:00")
    const now = moment()
    if (now.isBefore(moment(MINT_START_TIME))) {
      return MintPeriod.Ready;
    } else if (now.isBefore(moment(MINT_END_TIME)) && now.isSameOrAfter(moment(MINT_START_TIME))) {
      return MintPeriod.Mint;
    } else if (now.isBefore(moment(RAFFLE_END_TIME)) && now.isSameOrAfter(RAFFLE_START_TIME)) {
      return MintPeriod.Raffle;
    } else if (now.isBefore(moment(REFUND_END_TIME)) && now.isSameOrAfter(REFUND_START_TIME)) {
      return MintPeriod.Refund;
    } else if (now.isAfter(moment(REFUND_END_TIME))) {
      return MintPeriod.End
    } else {
      return MintPeriod.Ready;
    }
  }, [endTimeCount])

  const couldMint = useMemo(() => {
    if (address && currentPeriod == MintPeriod.Mint) {
      if (isWhitelist && !isDeposited) {
        return true
      }
      if (!isWhitelist && !isDeposited && !isPublicReserveStop) {
        return true
      }
      if (!isWhitelist && !isDeposited && !isWhitelistMintOpen) {
        return true
      }
    }
    return false
  }, [address, currentPeriod, isWhitelist, isDeposited, isPublicReserveStop])

  const [countDay, countHour, countMinute, countSecond] = useMemo(() => {
    let countdown
    if (saleStartTime) {
      countdown = saleStartCountdown
    } else if (saleEndTime) {
      countdown = saleEndCountdown
    }
    const { days, hours, minutes, seconds } = countdown || {}
    return [days, hours, minutes, seconds]
  }, [saleStartTime, saleEndTime])


  // Public mint 预校验
  const { config: publicSaleConfig, error: publicPrepareError } = usePrepareContractWrite({
    ...NOBODY_CONTRACT_INFO,
    functionName: 'publicReserve',
    value: NFT_SALE_PRICE,
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  // Public mint
  const { data: publicMintTxResult, writeAsync: publicSaleMintCall } = useContractWrite({
    ...publicSaleConfig,
    onError: (err) => {
      toast.error(err.message, {
        closeOnClick: false
      })
      setIsLoading(false)
    }
  })

  // Wait tx confirmed
  useWaitForTransaction({
    hash: publicMintTxResult?.hash,
    onSettled(data, err) {
      console.log(data, err)
      setIsLoading(false)
    },
    onSuccess() {
      toast.dismiss()
      toast.success(t("MainSection.mintSuccess"))
    },
    onError(err) {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  // whitelist mint 预校验
  const { config: presaleConfig, error: presalePrepareError } = usePrepareContractWrite({
    ...NOBODY_CONTRACT_INFO,
    functionName: "whitelistReserve",
    value: NFT_SALE_PRICE,
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const { data: whitelistMintTxResult, writeAsync: whitelistMintCall } = useContractWrite({
    ...presaleConfig,
    onError: (err) => {
      toast.error(err.message, {
        closeOnClick: false
      })
    }
  })

  useWaitForTransaction({
    hash: whitelistMintTxResult?.hash,
    onSettled(data, err) {
      console.log(data, err)
    },
    onSuccess() {
      toast.dismiss()
      toast.success(t("MainSection.mintSuccess"))
    },
    onError(err) {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const handleMintNFT = async () => {
    if (isLoading) return

    if (currentPeriod == MintPeriod.Mint) {

      if (!isWhitelistMintOpen) {
        toast.info(t("MainSection.mint&noopen"))
        return
      }

      setIsLoading(true)

      if (isWhitelist && !isDeposited) {
        await whitelistMint()
      }
      if (!isWhitelist && !isDeposited) {
        // public user could mint
        if (!isPublicReserveStop) {
          await publicMint()
        }
      }
    }
  }

  const whitelistMint = async () => {
    if (presalePrepareError) {
      console.log(presalePrepareError)
      toast.error(presalePrepareError.message);
      setIsLoading(false)
      return
    }

    if (whitelistMintCall) {
      try {
        await whitelistMintCall()
        toast.loading(t("MainSection.txPendding"))

      } catch (err) {
        console.log(err)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const publicMint = async () => {
    if (publicPrepareError) {
      console.log(publicPrepareError.cause, publicPrepareError.name, publicPrepareError.stack)
      toast.error(publicPrepareError.message);
      setIsLoading(false)
      return
    }
    if (publicSaleMintCall) {
      try {
        await publicSaleMintCall()
        toast.loading(t("MainSection.txPendding"))
      } catch (err) {
        console.log(err)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (isLoading) return

    // 需要获知抽奖结果已出
    if (!JSON.parse(process.env.NEXT_PUBLIC_RAFFLE_RESULT_DONE as string)) return

    if (currentPeriod == MintPeriod.Refund && !isWhitelist && isDeposited && !isClaimed && !isSelected) {

      if (refundPrepareError) {
        console.log(refundPrepareError.cause, refundPrepareError.name, refundPrepareError.stack)
        toast.error(refundPrepareError.message);
        return
      }
      setIsLoading(true)

      if (refundCall) {
        try {
          await refundCall()
          toast.loading(t("MainSection.txPendding"))
        } catch (err) {
          console.log(err)
          setIsLoading(false)
        }
      }
    }
  }

  // refund mint 预校验
  const { config: refundConfig, error: refundPrepareError } = usePrepareContractWrite({
    ...NOBODY_CONTRACT_INFO,
    functionName: "refund",
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const { data: refundTxResult, writeAsync: refundCall } = useContractWrite({
    ...refundConfig,
    onError: (err) => {
      toast.error(err.message, {
        closeOnClick: false
      })
      setIsLoading(false)
    }
  })

  useWaitForTransaction({
    hash: refundTxResult?.hash,
    onSettled(data, err) {
      console.log(data, err)
      setIsLoading(false)
    },
    onSuccess() {
      toast.dismiss()
      toast.success(t("MainSection.refundSuccess"))
    },
    onError(err) {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const handleMintStageInfo = () => {
    if (!address) {
      return t("MainSection.connect&minting")
    }

    // None whitelist stop deposit if they not deposit yet
    if (isPublicReserveStop && !isDeposited && !isWhitelist && isWhitelistMintOpen) {
      return t("MainSection.nowhitelist&mintstop")
    }

    if (isDeposited) {
      if (isWhitelist) {
        return t("MainSection.whitelist&mintdone")
      } else {
        return t("MainSection.nowhitelist&mintdone")
      }
    } else {
      if (isWhitelist) {
        return t("MainSection.whitelist&mint")
      } else {
        return t('MainSection.nowhitelist&mint')
      }
    }
  }

  const handleRaffleStageInfo = () => {
    if (!address) {
      return t("MainSection.connect&MintEnd")
    }

    if (isDeposited) {
      if (isWhitelist) {
        return t("MainSection.raflle&select")
      } else {

        // 获取抽奖结果信息
        if (JSON.parse(process.env.NEXT_PUBLIC_RAFFLE_RESULT_DONE as string)) {
          if (isSelected) {
            return t("MainSection.raflle&select")
          } else {
            return t("MainSection.raffle&noselect")
          }
        } else {
          return t("MainSection.nowhitelist&mintdone");
        }
      }
    } else {
      return t("MainSection.raffle&nojoin")
    }
  }

  const handleRefundStageInfo = () => {
    if (!address) {
      return t("MainSection.connect&MintEnd")
    }
    if (isDeposited) {
      if (isWhitelist || (!isWhitelist && isSelected)) {
        return t("MainSection.raflle&select")
      }
      if (!isWhitelist && !isSelected) {
        if (isClaimed) {
          return t("MainSection.refund&noselect&&refunded");
        } else {
          return t("MainSection.refund&noselect");
        }
      }
    } else {
      return t("MainSection.raffle&nojoin")
    }
  }

  const handleReadyInfo = () => {
    if (!address) {
      return t("MainSection.connect&check")
    }
    if (isWhitelist) {
      return t("MainSection.ready&whitelist")
    } else {
      return t("MainSection.ready&nowhitelist")
    }
  }

  return <div className=" relative h-screen w-screen overflow-hidden">
    <Image src="/home_bg_mint_1.png" alt="background" fill className=" object-cover" />
    <div className=" absolute h-screen w-screen backdrop-blur z-10"></div>
    <Header />
    <div className=" relative z-20 h-screen w-screen pt-[20px] pb-[180px] overflow-y-auto">
      <div className="w-full px-[12px] sm:px-0 sm:w-[80%] lg:w-[65%] xl:w-[1200px] mx-auto ">
        <div className="lg:mt-4">
          <div className="flex flex-col xl:flex-row">
            <div className="w-full xl:w-[760px] xl:h-[590px] py-[20px] px-[12px] xl:p-[30px] rounded-[24px] border-black border-[3px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className=" flex relative">
                <div className=" shrink-0 relative w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] lg:w-[250px] lg:h-[250px] xl:w-[320px] xl:h-[320px] rounded-[16px] overflow-hidden">
                  <Image src={"/nft_mint_cover_static.webp"} alt="nft-cover" fill />
                  <Image src={"/nft_mint_cover.webp"} alt="nft-cover" fill />
                </div>
                <div className=" flex-grow  h-full ml-[20px] py-[6px] xl:ml-[30px] xl:py-[10px] flex-col justify-between">
                  <div>
                    <h3 className=" text-[21px] leading-[21px] xl:text-[24px] font-bold xl:leading-[24px] mb-2">{t("MainSection.title")}</h3>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">{t("MainSection.supply")}: {MAX_NFT_COUNT}</p>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">{t("MainSection.price")}: {formatEther(NFT_SALE_PRICE)} ETH</p>
                    <p className=" text-[16px] xl:text-[18px] font-medium xl:font-semibold leading-[24px] xl:leading-[30px]">{t('MainSection.maxAddressCount')}: {MAX_AMOUNT_PRE_ADDRESS}</p>
                  </div>

                  {
                    currentPeriod == MintPeriod.Ready &&
                    <div className="absolute bottom-0 lg:min-w-[340px]">
                      <div className=" hidden lg:block  lg:mb-[10px] xl:mb-[17px]">
                        {/* Show Countdown in ready stage */}
                        <h4 className=" text-[16px] xl:text-[18px] font-semibold leading-[18px]">{t("MainSection.mintReady")}
                        </h4>
                        <div className=" text-[30px] xl:text-[36px] font-bold">
                          {/* @ts-ignore */}
                          <span className=" ">{(countHour + 24 * countDay) || '00'}</span>h:<span className=" ">{countMinute || "00"}</span>m:<span className="countdown "><span style={{ "--value": countSecond }}></span></span>s
                        </div>
                      </div>
                      <div className=" hidden lg:block">
                        <div className=" relative h-[12px] rounded-[24px] bg-[rgba(224,224,224,1)] border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                          <Image src={"/progress-star-grey.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                        </div>
                        <p className={clsx(locale == 'en' && "text-[12px] leading-[16px]", locale == 'zh' && 'text-[14px] leading-[18px]', "font-semibold text-black")}>
                          {t("MainSection.firsthourTipReady")}
                        </p>
                      </div>
                    </div>
                  }

                  {
                    currentPeriod == MintPeriod.Mint &&
                    <div className="absolute bottom-0 lg:min-w-[340px]">
                      <div className=" hidden lg:block  lg:mb-[10px] xl:mb-[17px]">
                        {/* Show Countdown only in mint stage */}
                        <h4 className=" text-[16px] xl:text-[18px] font-semibold leading-[18px]">{t("MainSection.mintFinish")}
                        </h4>
                        <div className=" text-[30px] xl:text-[36px] font-bold">
                          {/* @ts-ignore */}
                          <span className=" ">{(countHour + 24 * countDay) || '00'}</span>h:<span className=" ">{countMinute || "00"}</span>m:<span className="countdown "><span style={{ "--value": countSecond }}></span></span>s
                        </div>
                      </div>
                      <div className=" hidden lg:block">
                        {
                          firstHour > 0 ?
                            <div className=" relative h-[12px] rounded-[24px] bg-black border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                              <Image src={"/progress-star.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                              <span className={clsx(
                                " rounded-[9px] bg-gradient-to-r from-[rgba(255,0,0,1)] to-[rgba(255,247,32,1)] block h-[8px] mt-[2px]",
                              )} style={{ width: `${(firstHourCountdown.minutes) / 0.6}%` }}></span>
                            </div>
                            :
                            <div className=" relative h-[12px] rounded-[24px] bg-[rgba(224,224,224,1)] border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                              <Image src={"/progress-star-grey.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                            </div>
                        }

                        <p className=" text-[14px] font-semibold leading-[18px] text-black">
                          {t.rich("MainSection.firsthourTip", {
                            minutes: firstHourCountdown.minutes,
                            span: (val) => <span className=" text-[rgba(255,0,0,1)]">{firstHourCountdown.minutes > 0 ? val : t("MainSection.firstHourEnd")}</span>
                          })}
                        </p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              {/* Mobile layout */}
              {
                currentPeriod == MintPeriod.Ready &&
                <div className=" mt-[25px] block lg:hidden">
                  <div className="mb-[10px]">
                    {/* Show Countdown in ready stage */}
                    <h4 className=" text-[16px] xl:text-[18px] font-semibold leading-[18px]">{t("MainSection.mintReady")}
                    </h4>
                    <div className=" text-[30px] xl:text-[36px] font-bold">
                      {/* @ts-ignore */}
                      <span className=" ">{(countHour + 24 * countDay) || '00'}</span>h:<span className=" ">{countMinute || "00"}</span>m:<span className="countdown "><span style={{ "--value": countSecond }}></span></span>s
                    </div>
                  </div>
                  <div className="">
                    <div className=" relative h-[12px] rounded-[24px] bg-[rgba(224,224,224,1)] border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                      <Image src={"/progress-star-grey.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                    </div>
                    <p className={clsx(locale == 'en' && "text-[12px] leading-[16px]", locale == 'zh' && 'text-[14px] leading-[18px]', "font-semibold text-black")}>
                      {t("MainSection.firsthourTipReady")}
                    </p>
                  </div>
                </div>
              }
              {
                currentPeriod == MintPeriod.Mint &&
                <div className=" mt-[25px]">
                  <div className=" block lg:hidden  mb-[10px] ">
                    {/* Show Countdown only in mint stage */}
                    <h4 className=" text-[16px] xl:text-[18px] font-semibold leading-[18px]">{t("MainSection.mintFinish")}
                    </h4>
                    <div className=" text-[30px] xl:text-[36px] font-bold">
                      {/* @ts-ignore */}
                      <span className=" ">{(countHour + 24 * countDay) || '00'}</span>h:<span className=" ">{countMinute || "00"}</span>m:<span className="countdown "><span style={{ "--value": countSecond }}></span></span>s
                    </div>
                  </div>
                  <div className=" block lg:hidden">
                    {
                      firstHour > 0 ?
                        <div className=" relative h-[12px] rounded-[24px] bg-black border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                          <Image src={"/progress-star.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                          <span className={clsx(
                            " rounded-[9px] bg-gradient-to-r from-[rgba(255,0,0,1)] to-[rgba(255,247,32,1)] block h-[8px] mt-[2px]",
                          )} style={{ width: `${(firstHourCountdown.minutes) / 0.6}%` }}></span>
                        </div>
                        :
                        <div className=" relative h-[12px] rounded-[24px] bg-[rgba(224,224,224,1)] border-[1px] border-[rgba(185,185,185,1)] mb-[17px] box-content pl-[20px] pr-[2px]">
                          <Image src={"/progress-star-grey.png"} alt="star" width={38} height={36} className=" absolute left-[-11px] top-[-13px]" />
                        </div>
                    }
                    <p className=" text-[14px] font-semibold leading-[18px] text-black">
                      {t.rich("MainSection.firsthourTip", {
                        minutes: firstHourCountdown.minutes,
                        span: (val) => <span className=" text-[rgba(255,0,0,1)]">{firstHourCountdown.minutes > 0 ? val : t("MainSection.firstHourEnd")}</span>
                      })}
                    </p>
                  </div>
                </div>
              }

              {/* 未开始或已结束 */}
              {
                [MintPeriod.Ready, MintPeriod.End].includes(currentPeriod) &&
                <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row lg:justify-between items-center">
                  <div className=" text-[18px] leading-[24px] font-medium text-center xl:text-left mb-[20px] lg:mb-0 mx-[20px]">
                    {currentPeriod == MintPeriod.Ready && handleReadyInfo()}
                    {currentPeriod == MintPeriod.End && t("MainSection.raffle&nojoin")}
                  </div>
                  <div className=" shrink-0">
                    {
                      currentPeriod == MintPeriod.Ready && (
                        address ?
                          <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-white/30 border-[2px] border-black/30 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-black/30 flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" >
                            {t("MainSection.mint")}
                          </div> :
                          <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={openConnectModal}>{t("MainSection.connectwallet")}</div>
                      )
                    }
                  </div>
                </div>
              }

              {/* Mint Period */}
              {
                [MintPeriod.Mint].includes(currentPeriod) && <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row lg:justify-between items-center">
                  <div className=" text-[18px] leading-[24px] font-medium text-left xl:text-left mb-[20px] lg:mb-0 mx-[20px]">
                    {handleMintStageInfo()}
                  </div>
                  <div className=" shrink-0">
                    {
                      address ?
                        (couldMint ?
                          <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={handleMintNFT}>
                            {t("MainSection.mint")}
                            {isLoading && <Loader2 className="ml-2 h-8 w-8 animate-spin" />}
                          </div> :
                          <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-white/30 border-[2px] border-black/30 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-black/30 flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" >
                            {t("MainSection.mint")}
                          </div>)
                        :
                        <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={openConnectModal}>{t("MainSection.connectwallet")}</div>
                    }
                  </div>
                </div>
              }

              {/* Raffle and Airdrop */}
              {
                currentPeriod == MintPeriod.Raffle && <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row items-center">
                  <div className=" text-[18px] leading-[24px] font-medium text-left xl:text-left mb-[20px] lg:mb-0 mx-[20px]">
                    {handleRaffleStageInfo()}
                  </div>
                  <div className=" shrink-0">
                    {
                      address ?
                        <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-white/30 border-[2px] border-black/30 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-black/30 flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" >
                          {isDeposited && !isSelected && !isWhitelist && JSON.parse(process.env.NEXT_PUBLIC_RAFFLE_RESULT_DONE as string)
                            ? t("MainSection.refund") : t("MainSection.mint")}
                        </div>
                        :
                        <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={openConnectModal}>{t("MainSection.connectwallet")}</div>
                    }
                  </div>
                </div>
              }

              {/* Refund */}
              {
                currentPeriod == MintPeriod.Refund && <div className=" w-full mt-[20px] xl:my-[30px] py-[30px] px-[12px] xl:h-[124px] bg-[rgba(255,214,0,0.2)] rounded-[12px] xl:rounded-[16px] flex flex-col lg:flex-row lg:justify-between items-center">
                  <div className=" text-[18px] leading-[24px] font-medium text-left xl:text-left mb-[20px] lg:mb-0 mx-[20px]">
                    {handleRefundStageInfo()}
                  </div>
                  <div className=" shrink-0">
                    {
                      address ?
                        (isDeposited && !isSelected && !isWhitelist && (
                          !isClaimed ?
                            <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={handleRefund} >
                              {t("MainSection.refund")}
                              {isLoading && <Loader2 className="ml-2 h-8 w-8 animate-spin" />}
                            </div>
                            :
                            <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-white/30 border-[2px] border-black/30 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] text-black/30 flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" >
                              {t("MainSection.refunded")}
                            </div>)
                        )
                        :
                        <div className=" h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold min-w-[240px] xl:min-w-[260px]" onClick={openConnectModal}>{t("MainSection.connectwallet")}</div>
                    }
                  </div>
                </div>
              }

              <div className=" hidden lg:block mt-[20px] xl:mt-0">
                <p>{t("MainSection.contractInfo")}<a href={`https://etherscan.io/address/${NOBODY_CONTRACT_ADDRESS}`} target="__blank" className=" text-[rgba(59,132,255,1)] underline">{NOBODY_CONTRACT_ADDRESS}</a></p>
              </div>
            </div>
            <div className="sm:mt-[20px] xl:mt-0 xl:ml-[20px] flex-col-reverse sm:flex-col">
              <TotalReserved />
              <MintSchedule currentPeriod={currentPeriod} />
            </div>
          </div>
          <div className="flex flex-col-reverse xl:flex-row justify-between pt-[30px] sm:pt-[20px]">
            <MintRule />
            <MintUser currentPeriod={currentPeriod} />
          </div>
        </div>
      </div>
    </div>
  </div>
}