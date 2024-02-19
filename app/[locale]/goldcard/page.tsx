"use client"
import { formatAddress } from "@/lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AddressForm from "./AddressForm";
import SubmitResult from "./SubmitResult";

export default function GoldCard() {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isRaffleWin, setRaffleWin] = useState<boolean>(true)
  const [isSubmitForm, setSubmitForm] = useState<boolean>(true)

  useEffect(() => {
    if (address) {
      // 判断当前地址是否中奖

      // 判断当前地址是否已经提交过表单
    }
  }, [address])

  return <div className=" relative h-screen w-screen flex items-center justify-center">
    <Image src={"/goldcard_bg.webp"} alt="background-image" fill style={{ objectFit: 'cover' }} />

    <div className=" relative z-10 w-[700px] h-[800px] bg-white rounded-[24px] border-[2px] border-black">

      <div className=" absolute bottom-0 right-[40px] w-[160px] h-[124px]">
        <Image src={"/form_avatar.webp"}  alt="avatar" fill />
      </div>

      {/* Connect Wallet */}
      {!isRaffleWin && <div className=" mt-[250px] flex-col items-center justify-center">
        <h3 className=" text-[48px] font-semibold leading-[48px] text-center">抽獎驗證</h3>
        <h4 className=" text-[30px] font-semibold leading-[30px] mt-[20px] mb-[80px] text-center">連接錢包查看你是否抽中金卡</h4>

        {
          address ?
            <div className=" m-auto h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold max-w-[240px] xl:max-w-[280px]">
              {formatAddress(address, 4)}
            </div> :
            <div className=" m-auto h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold max-w-[240px] xl:max-w-[280px]" onClick={openConnectModal}>
              連接錢包
            </div>
        }

{/* Not Raffle Win */}
        <p className=" text-[18px] font-medium leading-[18px] text-center mt-[30px]">很遺憾！ 未被抽中金卡，期待你参与下次活動～</p>
      </div>}

      {
        isRaffleWin && !isSubmitForm && <AddressForm />
      }

      {
        isSubmitForm && <SubmitResult />
      }

    </div>
  </div>
}