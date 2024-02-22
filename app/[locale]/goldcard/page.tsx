"use client"
import { formatAddress } from "@/lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import AddressForm from "./AddressForm";
import Header from "@/components/Header";
import { useSize } from "ahooks";
import clsx from "clsx";
import { CheckRaffleResult, GetFormInfo, GetSignNonce } from "@/service/goldcard";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export enum FormStage {
  Ready,
  Form,
  End
}

export default function GoldCard() {
  const t = useTranslations('GoldCard.Ready');
  const tR = useTranslations('GoldCard.Result');

  const locale = useLocale()

  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  const [isRaffleWin, setRaffleWin] = useState<boolean>(false)
  const [isSubmitForm, setSubmitForm] = useState<boolean>(false)
  const [currentStage, setCurrentStage] = useState<FormStage>(FormStage.Ready)

  const [addressNonce, setAddressNonce] = useState<string>("")
  
  const { signMessageAsync } = useSignMessage({ message: addressNonce})
  const [viewLoading, setViewLoading] = useState<boolean>(false)
  const [checkLoading, setCheckLoading] = useState<boolean>(false)

  const [defaultFormValues, setDefaultFormValues] = useState<Record<string, any>>({ prefix: "86" })

  const mediaSize = useSize(document.querySelector('body'));

  useEffect(() => {
    if (address) {
      // 判断当前地址是否中奖
      // 判断当前地址是否已经提交过表单
      handleCheckAddress(address)

      // get sign nonce
      querySignNonce(address)
    }
  }, [address])

  const handleCheckAddress = async (address: string) => {
    const result = await CheckRaffleResult(address)
    if (result['success']) {
      const { edited, reward } = result['data'] || {}
      setRaffleWin(reward)
      setSubmitForm(edited)

      if (edited == true) {
        setCurrentStage(FormStage.End)
      } else {
        setCurrentStage(reward ? FormStage.Form : FormStage.Ready)
      }
    } else {
      toast.error(result['msg'])
    }
  }

  const querySignNonce = async (address: string) => {
    const result = await GetSignNonce(address);
    if (result['success']) {
      console.log(result)
      setAddressNonce(result["data"])
    } else {
      if (result['code'] != 430) { // address not reward
        toast.error(result['msg'])
      }
    }
  }

  const handleViewInfo = async () => {
    setViewLoading(true)
    const signStr = await signMessageAsync()

    const result = await GetFormInfo({ sign: signStr, userAddress: address})
    if (result['success']) {
      const { addressee, deliverAddress, email, idNumber, telNumber} = result['data']

      const matches = telNumber.match(/\((.*?)\)/);

      setDefaultFormValues({
        username: addressee,
        address: deliverAddress,
        email: email,
        userid: idNumber,
        phone: (telNumber as string).split(' ')[1],
        prefix: matches && matches.length > 1 ? matches[1] : ''
      })

      querySignNonce(address as `0x${string}`)
    } else {
      toast.error(result['msg'])
    }

    setViewLoading(false)
  }

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
                  { checkLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {formatAddress(address, 4)}
                </div> :
                <div className=" m-auto h-[56px] w-full rounded-[12px] xl:h-[64px] xl:rounded-[12px] bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[21px] xl:text-[24px] leading-[21px] xl:leading-[24px] font-semibold max-w-[240px] xl:max-w-[280px]" onClick={openConnectModal}>
                  {t("btnConnectWallet")}
                </div>
            }

            {/* Not Raffle Win */}
            {
              address && !isRaffleWin && !checkLoading &&
              <p className="mx-[20px] md:mx-[100px] text-[16px] md:text-[18px] font-medium leading-[18px] text-center mt-[20px] md:mt-[30px] ">{t("noneSelected")}</p>
            }
          </div>}

        {
          currentStage == FormStage.Form &&
          <AddressForm
            nonce={addressNonce}
            setCurrentStage={setCurrentStage}
            defaultFormValues={defaultFormValues}
            setDefaultFormValues={setDefaultFormValues}
            querySignNonce={querySignNonce}
          />
        }

        {
          currentStage == FormStage.End &&
          <div className=" mt-[50px] md:mt-[120px]">
            <h3 className=" mb-[50px] md:mb-[60px] text-[26px] md:text-[30px] font-semibold leading-[30px] text-center md:mx-[90px]">{tR("title")}</h3>
            <div className=" m-auto px-[15px] md:p-[60px] w-full md:w-[550px] h-auto md:min-h-[330px] rounded-[12px] md:bg-black/5">
              <div className="flex mb-[30px]">
                <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{tR('formName')}</div>
                <div className=" text-[16px]  md:text-[18px] font-medium leading-[18px]">{defaultFormValues["username"] || "-"}</div>
              </div>
              <div className="flex mb-[30px]">
                <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{tR("formPhone")}</div>
                <div className=" text-[16px]  md:text-[18px] font-medium leading-[18px]">
                  {Boolean(defaultFormValues['phone']) ? `+${defaultFormValues['prefix']} ${defaultFormValues['phone']}` : '-'}
                </div>
              </div>
              <div className="flex mb-[30px]">
                <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{tR("formAddress")}</div>
                <div className=" text-[16px]  md:text-[18px] font-medium leading-[24px]">{defaultFormValues['address'] || '-'}</div>
              </div>
              <div className="flex mb-[30px]">
                <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{tR("formEmail")}</div>
                <div className="  text-[16px]  md:text-[18px] font-medium leading-[18px]">{defaultFormValues['email'] || '-'}</div>
              </div>
              <div className="flex mb-[30px]">
                <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{tR("formIdNumber")}</div>
                <div className="  text-[16px]  md:text-[18px] font-medium leading-[18px]">{defaultFormValues['userid'] || '-'}</div>
              </div>
            </div>

            {
              defaultFormValues["username"] ?
                <div className=" m-auto mb-[40px] md:mb-0 mt-[60px] md:mt-[40px] h-[48px] w-[160px] rounded-[12px] bg-white border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[18px]  leading-[21px] font-semibold select-none " onClick={() => {
                  setCurrentStage(FormStage.Form)
                }} >
                  {tR("btnModify")}
                </div>
                :
                <div className=" m-auto mb-[40px] md:mb-0 mt-[60px] md:mt-[40px] h-[48px] w-[160px] rounded-[12px] bg-white border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[18px]  leading-[21px] font-semibold select-none " onClick={handleViewInfo} >
                  { viewLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {tR("btnView")}
                </div>
            }
          </div>
        }

      </div>
    </div>
  </div>
}