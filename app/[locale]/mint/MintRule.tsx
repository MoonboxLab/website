import { useSize } from "ahooks"
import clsx from "clsx"
import { useTranslations } from "next-intl";

export default function MintRule() {
  const screenSize = useSize(document.querySelector("body"))
  const t = useTranslations('Mint');
  
  return <div className={
    clsx(
      "w-full h-auto overflow-visible xl:w-[760px] sm:h-[390px] sm:overflow-y-scroll sm:p-[30px] sm:rounded-[24px] sm:border-black sm:border-[3px] sm:bg-white sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:mt-[20px] xl:mt-0",
    )
  }>
    <h3 className=" text-white sm:text-black text-[21px] sm:text-[24px] font-bold leading-6 mb-[20px] mt-[30px] sm:mt-0">{t("mintRuleTitle")}</h3>
    <div className={clsx(
      { "rounded-[16px] border-black border-[2px] bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] px-[16px] py-[20px]": (screenSize?.width || 0) <= 640 }
    )}>
      <h2 className="text-[20px] sm:text-[22px] font-semibold mb-4">{t('Rule.title1')}</h2>
      <p className=" text-[18px] font-medium leading-[30px]">
        {t.rich('Rule.content1', { br: () => <br /> })}
      </p>
      <h2 className="text-[20px] sm:text-[22px] font-semibold mb-4">{t('Rule.title2')}</h2>
      <p className=" text-[18px] font-medium leading-[30px]">
        {t.rich('Rule.content2', { br: () => <br /> })}
      </p>
      <h2 className="text-[20px] sm:text-[22px] font-semibold mb-4">{t('Rule.title3')}</h2>
      <p className=" text-[18px] font-medium leading-[30px]">
        {t.rich('Rule.content3', { br: () => <br /> })}
      </p>
    </div>
  </div>
}