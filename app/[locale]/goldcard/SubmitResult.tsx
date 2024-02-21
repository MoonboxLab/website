"use client"

import { useTranslations } from "next-intl";

export default function SubmitResult() {
  const t = useTranslations('GoldCard.Result');

  return <div className=" mt-[50px] md:mt-[120px]">
    <h3 className=" mb-[50px] md:mb-[60px] text-[26px] md:text-[30px] font-semibold leading-[30px] text-center md:mx-[90px]">{t("title")}</h3>
    <div className=" m-auto px-[15px] md:p-[60px] w-full md:w-[550px] min-h-[330px] rounded-[12px] md:bg-black/5">
      <div className="flex mb-[30px]">
        <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{t('formName')}</div>
        <div className=" text-[16px]  md:text-[18px] font-medium leading-[18px]">张三</div>
      </div>
      <div className="flex mb-[30px]">
        <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{t("formPhone")}</div>
        <div className=" text-[16px]  md:text-[18px] font-medium leading-[18px]">啊来看放开三阿发了</div>
      </div>
      <div className="flex mb-[30px]">
        <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{t("formAddress")}</div>
        <div className=" text-[16px]  md:text-[18px] font-medium leading-[24px]">懂啊肯蓝洞卡饭开三方；开沙拉酱分开啊；三分裤来三发来囧卡力帆赛况阿帆就懂了饭了；傻等</div>
      </div>
      <div className="flex mb-[30px]">
        <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{t("formEmail")}</div>
        <div className="  text-[16px]  md:text-[18px] font-medium leading-[18px]"></div>
      </div>
      <div className="flex mb-[30px]">
        <div className=" shrink-0 w-[100px] text-[18px] font-semibold leading-[18px]">{t("formIdNumber")}</div>
        <div className="  text-[16px]  md:text-[18px] font-medium leading-[18px]">ddssdds</div>
      </div>
    </div>

    <div className=" m-auto mb-[40px] md:mb-0 mt-[40px] h-[48px] w-[160px] rounded-[12px] bg-white border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[18px]  leading-[21px] font-semibold select-none " >
      {t("btnModify")}
    </div>
  </div>
}