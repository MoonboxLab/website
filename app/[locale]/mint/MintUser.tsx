import { MintPeriod, NFT_SALE_PRICE, NOBODY_CONTRACT_INFO } from "@/constants/nobody_contract"
import { formatAddress } from "@/lib/utils"
import { useLocalStorageState, useSize } from "ahooks"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { formatEther } from "viem"
import { useContractEvent } from "wagmi"
import { Search } from "lucide-react"
import Image from "next/image"

const ORIGIN_ADDRESS = [
  "0x135DD71D05c775036a3a96d85b611c7E04103C3D",
  "0x512fa22C4867AFF0f9BAEB423A434d92898Bc9c7",
  "0xDfc09E14D9E5f9BaBd9dDF179Fa1C75fd2a70984",
  "0x48DF7f8F2e9163ab56e89Bd5E914B87ec79eaf22",
  "0x36978ddA9bd0af3Ff71e2d5CE94E302fca411E05",
  "0xFAD899A14766331ED1d2C0a070AF2019113D44Dd",
  "0x0Cd973a3c63c92bF65805B5F6caFDa0bCBA37BE8",
  "0x5A2452cBb0ED82CFEAB8F4B9975FE678DA4a7BFb",
  "0xae10118223fedd3861C76a4a87E48832EB9944e1",
  "0x3A1D6645eE7841BEC0AECC3Ec52e5abBe85Ba632",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
  "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
]

let timeoutId: any

interface MintUserProps {
  currentPeriod: MintPeriod
}
export default function MintUser(props: MintUserProps) {
  const { currentPeriod } = props
  const screenSize = useSize(document.querySelector("body"))
  const t = useTranslations("Mint")

  const [realUserList, setRealUserList] = useLocalStorageState<string[]>("user_deposit", {
    defaultValue: ORIGIN_ADDRESS
  })
  const [mintUserList, setMintUserList] = useState<string[]>(realUserList ?? [])

  const [listenAddress, setListenAddress] = useState<string>("")

  const addAddressWithRandomDelay = () => {
    const delay = Math.floor(Math.random() * 5000) + 1500
    timeoutId = setTimeout(() => {
      const newList = mintUserList.slice()
      const lastItem = newList.pop();

      setMintUserList([lastItem as string, ...newList])
    }, delay)
  }

  useEffect(() => {
    clearTimeout(timeoutId)

    if (currentPeriod == MintPeriod.Mint) {
      addAddressWithRandomDelay()
    }

    return () => {
      clearTimeout(timeoutId)
      if (mintUserList.length != 0) {
        setRealUserList(mintUserList)
      }
    };
  }, [mintUserList])

  useEffect(() => {
    if (listenAddress && !mintUserList?.includes(listenAddress)) {
      clearTimeout(timeoutId)
      // Only save latest 18 address
      const newList = mintUserList.slice(-18)
      newList.push(listenAddress)
      setMintUserList([...newList])
    }
  }, [listenAddress])

  // useContractEvent({
  //   ...NOBODY_CONTRACT_INFO,
  //   eventName: 'PublicReserved',
  //   listener: (logs) => {
  //     console.log(logs[0].args.reserver)
  //     if (logs[0].args.reserver) {
  //       setListenAddress(logs[0].args.reserver)
  //     }
  //   }
  // })

  // useContractEvent({
  //   ...NOBODY_CONTRACT_INFO,
  //   eventName: 'WhitelistReserved',
  //   listener: (logs) => {
  //     console.log(logs[0].args.reserver)
  //     if (logs[0].args.reserver) {
  //       setListenAddress(logs[0].args.reserver)
  //     }
  //   }
  // })

  return <div className="w-full xl:w-[420px] sm:h-[390px] sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-[20px] sm:mt-0 ">
    <h3 className="text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0"
    >{t("mintUserTitle")}</h3>
    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[20px] max-h-[330px] min-h-[150px]": (screenSize?.width || 0) <= 640 }
    )}>
      <div className=" text-[18px] font-medium leading-[36px]">
        {
          currentPeriod != MintPeriod.Ready &&
          mintUserList.slice(0, 8).map((item, index) => <p key={index}><span className=" inline-block min-w-[132px]">{formatAddress(item, 4)}</span> <span className=" ml-[40px]">{formatEther(NFT_SALE_PRICE)} ETH</span></p>)
        }

      </div>
      {
        currentPeriod == MintPeriod.Ready && <div className=" relative h-full min-h-[320px] flex items-center justify-center">
          <Image src={"/empty_icon.png"} alt="empty" width={90} height={88} />
        </div> 
      }
    </div>
  </div>
}