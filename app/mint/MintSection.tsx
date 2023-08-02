import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CONTRACT_ABI, ContractInfo, NFT_CONTRACT_ADDRESS, PRESALE_PRICE, PUBLICSALE_PRICE, TOTAL_NFT_COUNT } from "@/constants/contract"
import { useCountDown } from "ahooks"
import { useMemo, useState } from "react"
import Image from "next/image"
import { erc20ABI, useAccount, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import clsx from "clsx"
import { formatAddress } from "@/lib/utils"
import { toast } from "react-toastify"
import { PresaleMintEndTime, PresaleMintStartTime, PublicMintEndTime, PublicMintStartTime, StageType, StagesInfo } from "@/constants/stage"
import { formatEther } from "viem"


interface MintSectionProps {
  currentStage: StageType
}
const MintSection: React.FC<MintSectionProps> = (props) => {
  const { currentStage } = props

  const [selectCount, setSelectCount] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { address } = useAccount()

  const { openConnectModal } = useConnectModal()


  // 读取合约相关数据
  const { data: contractData } = useContractReads({
    contracts: [
      {
        ...ContractInfo,
        functionName: "totalSupply",
      },
      {
        ...ContractInfo,
        functionName: "isAllowListActive"
      },
      {
        ...ContractInfo,
        functionName: "isPublicSaleActive"
      },
      {
        ...ContractInfo,
        functionName: 'balanceOf',
        args: [address as `0x${string}`]
      },
      {
        ...ContractInfo,
        functionName: 'numberAllowedToMint',
        args: [address as `0x${string}`]
      }
    ],
    watch: true,
  })

  const [totalSupply, isPresaleStage, isPublicStage, userBalance, isInWhitelist] = useMemo(() => {
    // console.log(contractData)
    const [mintSupply, isPresale, isPublic, userBalance, presaleAllowNumber] = contractData || []

    return [
      Number(mintSupply?.result || 0),
      isPresale?.result || false,
      isPublic?.result || false,
      Number(userBalance?.result || 0),
      (Number(presaleAllowNumber?.result || 0)) > 0
    ]
  }, [contractData])

  const isExtendLimit = useMemo(() => {
    if (!userBalance) return false

    return userBalance >= 2
  }, [userBalance])


  // Public mint 预校验
  const { config: publicSaleConfig, error: publicPrepareError } = usePrepareContractWrite({
    ...ContractInfo,
    functionName: 'mintPublicSale',
    args: [selectCount],
    value: PUBLICSALE_PRICE * BigInt(selectCount),
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  // Public mint
  const { data: publicMintTxResult, isLoading: publicMintLoading, writeAsync: publicSaleMint } = useContractWrite({
    ...publicSaleConfig,
    onError: (err) => {
      toast.error(err.message, {
        closeOnClick: false
      })
    }
  })

  // Wait tx confirmed
  useWaitForTransaction({
    hash: publicMintTxResult?.hash,
    onSettled(data, err) {
      console.log(data, err)
    },
    onSuccess() {
      toast.dismiss()
      toast.success("Mint Successfully")
    },
    onError(err) {
      toast.dismiss()
      toast.error(err.message)
    }
  })


  // Presale mint 预校验
  const { config: presaleConfig, error: presalePrepareError } = usePrepareContractWrite({
    ...ContractInfo,
    functionName: "mintAllowList",
    value: PRESALE_PRICE * BigInt(selectCount),
    args: [selectCount],
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const { data: presaleMintTxResult, writeAsync: presaleMint } = useContractWrite({
    ...presaleConfig,
    onError: (err) => {
      toast.error(err.message, {
        closeOnClick: false
      })
    }
  })

  useWaitForTransaction({
    hash: presaleMintTxResult?.hash,
    onSettled(data, err) {
      console.log(data, err)
    },
    onSuccess() {
      toast.dismiss()
      toast.success("Mint Successfully")
    },
    onError(err) {
      toast.dismiss()
      toast.error(err.message)
    }
  })

  const [presaleStartTime, presaleStartCountdown] = useCountDown({ targetDate: PresaleMintStartTime })

  const [presaleEndTime, presaleEndCountdown] = useCountDown({ targetDate: PresaleMintEndTime })

  const [publicSaleStartTime, publicSaleStartCountdown] = useCountDown({ targetDate: PublicMintStartTime })

  const [publicSaleEndTime, publicSaleEndCountdown] = useCountDown({ targetDate: PublicMintEndTime })

  const [countDay, countHour, countMinute, countSecond] = useMemo(() => {
    let countdown
    if (presaleStartTime) {
      countdown = presaleStartCountdown
    } else if (presaleEndTime) {
      countdown = presaleEndCountdown
    } else if (publicSaleStartTime) {
      countdown = publicSaleStartCountdown
    } else if (publicSaleEndTime) {
      countdown = publicSaleEndCountdown
    }
    const { days, hours, minutes, seconds } = countdown || {}
    return [days, hours, minutes, seconds]

  }, [presaleStartTime, presaleEndTime, publicSaleStartTime, publicSaleEndTime])


  const handleMintNFT = async () => {
    if (
      isLoading ||
      isExtendLimit ||
      (currentStage === StageType.Presale && !isPresaleStage) || // 已进入 Presale 阶段，但合约 Presale Mint 接口尚未开放
      (currentStage === StageType.Presale && !isInWhitelist) || // 已经进入 Presale 阶段，但当前地址不在预售白名单中
      (currentStage === StageType.PublicSale && !isPublicStage) || // 已进入 Public 阶段，但合约 Public Mint 接口尚未开放 或 合约 Public Mint 接口已关闭
      (currentStage === StageType.EndSale)
    ) return

    setIsLoading(true)

    if (isPresaleStage) {
      await preSaleMint()
    } else if (isPublicStage) {
      // console.log("public sale")
      await publicMint()
    }
  }

  const preSaleMint = async () => {
    if (presalePrepareError) {
      console.log(presalePrepareError)
      return
    }

    if (presaleMint) {
      try {
        await presaleMint()
        toast.loading("The transaction is pending to be confirmed by the blockchain.")

      } catch (err) {
        console.log(err)
      }
    }
    setIsLoading(false)
  }

  const publicMint = async () => {
    if (publicPrepareError) {
      console.log(publicPrepareError.cause, publicPrepareError.name, publicPrepareError.stack)
      return
    }
    if (publicSaleMint) {
      try {
        await publicSaleMint()

        toast.loading("The transaction is pending to be confirmed by the blockchain.")

      } catch (err) {
        console.log(err)
      }
    }
    setIsLoading(false)
  }


  return <section className="w-full flex flex-col p-5 items-center space-y-[20px] sm:max-w-[680px] lg:max-w-[864px] lg:space-y-0 lg:flex-row lg:items-start lg:space-x-[40px] lg:p-0 lg:py-10 2xl:max-w-[1200px] 3xl:py-[70px] 3xl:space-x-[70px]">

    <div className=" relative overflow-hidden w-full max-w-[400px] max-h-[400px] lg:max-w-[420px] lg:max-h-[420px] 3xl:max-h-[530px] 3xl:max-w-[530px] aspect-square bg-gray-600 rounded-[10px]">
      <Image src="/alien_nft_cover.svg" alt="nft_cover" fill />
      <div className=" absolute pb-5 pl-5 bottom-0 w-full bg-gradient-to-b from-white/5 to-[#f3e5d1]/70 sm:hidden">
        <p className=" text-white text-base leading-4 font-medium">End in:</p>
        <p className=" mt-[10px] text-white text-[30px] leading-[30px] font-medium">{countDay}d:{countHour}h:{countMinute}m:{countSecond}s</p>
      </div>
    </div>

    <div className=" w-full flex flex-col justify-start items-start lg:max-w-[350px] 3xl:max-w-[400px]">
      <h3 className=" text-2xl leading-6 font-bold lg:text-[30px] lg:leading-[30px] 2xl:text-4xl 2xl:leading-9 3xl:text-5xl 3xl:leading-[48px]">
        {StagesInfo[currentStage]?.name}
      </h3>
      <p className=" hidden lg:block text-base leading-4 font-medium mt-[10px] lg:mt-3 3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">Supply: {TOTAL_NFT_COUNT}</p>
      <p className=" text-base leading-4 font-medium mt-[10px] lg:mt-3  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">
        Price: {currentStage === StageType.Presale ?
          formatEther(PRESALE_PRICE) :
          formatEther(PUBLICSALE_PRICE)}
        ETH
      </p>
      <p className=" text-base leading-4 font-medium mt-[10px] lg:mt-3  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">Max mint per wallet: 2</p>

      <p className=" hidden lg:block text-base leading-4 font-medium mt-10  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-[60px]">
        {
          (presaleStartTime || (!presaleEndTime && publicSaleStartTime)) ? 'Start in:' : 'End in:'
        }
      </p>
      <div className="hidden lg:block text-[30px] leading-[30px] font-medium my-[10px] 3xl:text-4xl 3xl:leading-[36px]">
        {/* @ts-ignore */}
        <span className=" text-active">{countDay || '00'}</span>d:<span className=" text-active">{countHour || '00'}</span>h:<span className=" text-active">{countMinute || "00"}</span>m:<span className="countdown text-active"><span style={{ "--value": countSecond }}></span></span>s
      </div>

      <div className="w-full max-w-[400px] inline-flex items-center text-base leading-4 font-medium mt-[10px] justify-between  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-5">
        <span>Progress: </span>
        <Progress className=" lg:hidden mx-[10px] h-2 bg-[#E9E9E9FF]" value={totalSupply / 100} />
        <span>{totalSupply}/{TOTAL_NFT_COUNT}</span>
      </div>
      <Progress className=" hidden lg:block max-w-[400px] h-2 mt-3 bg-[#E9E9E9FF] 3xl:mt-4" value={totalSupply / 100} />


      <div className="w-full max-w-[400px] inline-flex items-center text-base leading-4 font-medium mt-5 lg:mt-[50px]  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-[52px]">
        <span className=" grow">Amount: </span>
        <div className=" inline-flex items-center">
          <Button
            className={clsx(" text-black text-lg ", { " hover:bg-slate-50 cursor-not-allowed": selectCount <= 1 })}
            variant={"ghost"}
            onClick={() => {
              if (selectCount > 1) {
                setSelectCount(selectCount - 1)
              }
            }}>-</Button>
          <span className=" mx-2">{selectCount}</span>
          <Button
            className={clsx(" text-black text-lg", { " hover:bg-slate-50 cursor-not-allowed": selectCount >= 2 })}
            variant={"ghost"}
            onClick={() => {
              if (selectCount < 2) {
                setSelectCount(selectCount + 1)
              }
            }}
          >+</Button>
        </div>
      </div>

      {
        address ?
          <Button className={
            clsx("w-full h-12 rounded-3xl mt-3 bg-active hover:bg-active active:bg-active text-lg leading-[18px] font-bold lg:h-10 lg:mt-5 lg:max-w-[400px] 3xl:h-14 3xl:mt-5",
              { " opacity-70": isLoading },
              {
                "bg-black/20 hover:bg-black/20 active:bg-black/20 cursor-not-allowed":
                  isExtendLimit ||
                  (currentStage === StageType.Presale && !isPresaleStage) || // 已进入 Presale 阶段，但合约 Presale Mint 接口尚未开放
                  (currentStage === StageType.Presale && !isInWhitelist) || // 已经进入 Presale 阶段，但当前地址不在预售白名单中
                  (currentStage === StageType.PublicSale && !isPublicStage) || // 已进入 Public 阶段，但合约 Public Mint 接口尚未开放 或 合约 Public Mint 接口已关闭
                  (currentStage === StageType.EndSale) // Public Mint stage end
              })
          }
            onClick={handleMintNFT}
          >
            {isLoading && <span className="loading loading-spinner loading-sm mr-2"></span>}
            Mint
          </Button>
          :
          <Button className="w-full h-12 rounded-3xl mt-3 bg-active hover:bg-active active:bg-active text-lg leading-[18px] font-bold lg:h-10 lg:mt-5 lg:max-w-[400px] 3xl:h-14 3xl:mt-5"
            onClick={openConnectModal}
          >
            Connect Wallet
          </Button>
      }

      {
        isExtendLimit && <span className=" text-active text-base font-medium leading-[22px] mt-2 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Address {formatAddress(address, 4)} has minted 2 NFTs yet!
        </span>
      }

      
      {/* {
        isPresaleStage && !isInWhitelist &&
        <span className="text-active text-base font-medium leading-[22px] mt-2 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Address {formatAddress(address, 4)} is not in presale whitelist!
        </span>
      } */}
    </div>
  </section>
}

export default MintSection