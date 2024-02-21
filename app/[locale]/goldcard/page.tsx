"use client"
import { formatAddress } from "@/lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AddressForm from "./AddressForm";
import SubmitResult from "./SubmitResult";
import Header from "@/components/Header";
import { useSize } from "ahooks";
import clsx from "clsx";

export enum FormStage {
  Ready,
  Form,
  End
}

export default function GoldCard() {
  const t = useTranslations('GoldCard.Ready');
  const locale = useLocale()

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isRaffleWin, setRaffleWin] = useState<boolean>(false)
  const [isSubmitForm, setSubmitForm] = useState<boolean>(false)
  const mediaSize = useSize(document.querySelector('body'));

  const [currentStage, setCurrentStage] = useState<FormStage>(FormStage.Form)

  useEffect(() => {

  }, [isRaffleWin, isSubmitForm])

  useEffect(() => {
    if (address) {
      // 判断当前地址是否中奖

      // 判断当前地址是否已经提交过表单
    }
  }, [address])

  return <div className=" relative h-screen w-screen ">
    <Image src={"/goldcard_bg.webp"} alt="background-image" fill style={{ objectFit: 'cover' }} />

    <div className=" fixed z-[100] top-0 w-full">
      <Header />
    </div>

    <div className=" h-screen w-screen  overflow-scroll">
      <div className=" relative z-10 mt-[122px] md:mt-[140px] mb-[80px] mx-[10px] md:mx-auto w-[calc(100%-20px)]  md:w-[700px] min-h-[500px] h-auto md:min-h-[800px] bg-white rounded-[24px] border-[2px] border-black">
        <div className=" absolute bottom-0 right-[40px] w-[140px] h-[109px] md:w-[160px] md:h-[124px]">
          {
            !((mediaSize?.width || 0) < 768 && [FormStage.End, FormStage.Form].includes(currentStage)) &&
            <Image src={"/form_avatar.webp"} alt="avatar" fill />
          }
        </div>
        <div className=" absolute w-[144px] h-[153px] top-[-14px] left-[-10px] md:w-[171px] md:h-[182px] md:top-[26px] md:left-[19px]">
          <Image src={"/form_icon1.png"} alt="icon1" fill />
        </div>
        <div className=" absolute  w-[137px] h-[153px] top-[-14px] right-[-10px] md:w-[163px] md:h-[182px] md:top-[26px] md:right-[17px]">
          <Image src={"/form_icon2.png"} alt="icon1" fill />
        </div>

        {/* Connect Wallet */}
        {currentStage == FormStage.Ready &&
          <div className={clsx(
            "mt-[120px] flex-col items-center justify-center",
            locale == 'en' ? "md:mt-[230px]" : "md:mt-[250px]"
          )}>
            <h3 className=" text-[36px] md:text-[48px] font-semibold leading-[36px] md:leading-[48px] text-center">{t("title")}</h3>
            <h4 className=" text-[21px] md:text-[30px] font-semibold leading-[21px] md:leading-[30px] md:mx-[80px] mt-[10px] md:mt-[20px] mb-[60px] md:mb-[80px] text-center">{t("subTitle")}</h4>

            {
              address ?
                <div className=" m-auto h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold max-w-[240px] xl:max-w-[280px]">
                  {formatAddress(address, 4)}
                </div> :
                <div className=" m-auto h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold max-w-[240px] xl:max-w-[280px]" onClick={openConnectModal}>
                  {t("btnConnectWallet")}
                </div>
            }

            {/* Not Raffle Win */}
            {
              address && !isRaffleWin &&
              <p className="mx-[20px] md:mx-[100px] text-[16px] md:text-[18px] font-medium leading-[18px] text-center mt-[20px] md:mt-[30px] ">{t("noneSelected")}</p>
            }
          </div>}

        {
          currentStage == FormStage.Form && <AddressForm />
        }

        {
          currentStage == FormStage.End && <SubmitResult />
        }

      </div>
    </div>
  </div>
}