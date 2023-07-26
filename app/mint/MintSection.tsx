import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TOTAL_NFT_COUNT } from "@/constants/contact"
import { useCountDown } from "ahooks"
import { useMemo, useState } from "react"
import Image from "next/image"

const MintSection: React.FC = () => {
  const [mintedCount, setMintedCount] = useState<number>(2314)
  const [selectCount, setSelectCount] = useState<number>(1)

  const PRESALE_START_TIME = '2023-09-30 12:00:00'

  const [presaleTime, presaleTimeFormat] = useCountDown({
    targetDate: PRESALE_START_TIME
  })

  const [countDay, countHour, countMinute, countSecond] = useMemo(() => {
    const { days, hours, minutes, seconds } = presaleTimeFormat
    return [days, hours, minutes, seconds]
  }, [presaleTimeFormat])

  return <section className="w-full flex flex-col p-5 items-center space-y-[20px] sm:max-w-[680px] lg:max-w-[864px] lg:space-y-0 lg:flex-row lg:items-start lg:space-x-[40px] lg:p-0 lg:py-10 2xl:max-w-[1200px] 3xl:py-[70px] 3xl:space-x-[70px]">
    <div className=" relative overflow-hidden w-full max-w-[400px] max-h-[400px] lg:max-w-[420px] lg:max-h-[420px] 3xl:max-h-[530px] 3xl:max-w-[530px] aspect-square bg-gray-600 rounded-[10px]">
      <Image src="/alien_nft_cover.svg" alt="nft_cover" fill />
      <div className=" absolute pb-5 pl-5 bottom-0 w-full bg-gradient-to-b from-white/5 to-[#f3e5d1]/70 sm:hidden">
        <p className=" text-white text-base leading-4 font-medium">End in:</p>
        <p className=" mt-[10px] text-white text-[30px] leading-[30px] font-medium">{countDay}d:{countHour}h:{countMinute}m:{countSecond}s</p>
      </div>
    </div>

    <div className=" w-full flex flex-col justify-start items-start lg:max-w-[350px] 3xl:max-w-[400px]">
      <h3 className=" text-2xl leading-6 font-bold lg:text-[30px] lg:leading-[30px] 2xl:text-4xl 2xl:leading-9 3xl:text-5xl 3xl:leading-[48px]">Presale</h3>
      <p className=" hidden lg:block text-base leading-4 font-medium mt-[10px] lg:mt-3 3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">Supply: {TOTAL_NFT_COUNT}</p>
      <p className=" text-base leading-4 font-medium mt-[10px] lg:mt-3  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">Price: 0.05 ETH</p>
      <p className=" text-base leading-4 font-medium mt-[10px] lg:mt-3  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-4">Max mint per wallet: 2</p>

      <p className=" hidden lg:block text-base leading-4 font-medium mt-10  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-[60px]">
        End in:
      </p>
      <div className="hidden lg:block text-[30px] leading-[30px] font-medium my-[10px] 3xl:text-4xl 3xl:leading-[36px]">
        <span className=" text-active">{countDay}</span>d:<span className=" text-active">{countHour}</span>h:<span className=" text-active">{countMinute}</span>m:<span className=" text-active">{countSecond}</span>s
      </div>

      <div className="w-full max-w-[400px] inline-flex items-center text-base leading-4 font-medium mt-[10px] justify-between  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-5">
        <span>Progress: </span>
        <Progress className=" lg:hidden mx-[10px] h-2 bg-[#E9E9E9FF]" value={mintedCount / 100} />
        <span>{mintedCount}/{TOTAL_NFT_COUNT}</span>
      </div>
      <Progress className=" hidden lg:block max-w-[400px] h-2 mt-3 bg-[#E9E9E9FF] 3xl:mt-4" value={mintedCount / 100} />


      <div className="w-full max-w-[400px] inline-flex items-center text-base leading-4 font-medium mt-5 lg:mt-[52px]  3xl:text-[21px] 3xl:leading-[21px] 3xl:mt-[60px]">
        <span className=" grow">Amount: </span>
        <div>
          <Button className=" text-black text-base" variant={"ghost"}>-</Button>
          <span className=" mx-2">{selectCount}</span>
          <Button className=" text-black text-base" variant={"ghost"}>+</Button>
        </div>
      </div>


      <Button className="w-full h-12 rounded-3xl mt-3 bg-active hover:bg-active active:bg-active text-lg leading-[18px] font-bold lg:h-10 lg:mt-5 lg:max-w-[400px] 3xl:mt-7">Mint</Button>
    </div>
  </section>
}

export default MintSection