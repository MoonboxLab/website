import { StageType, StagesInfo } from "@/constants/stage"
import clsx from "clsx"

interface StageProgressProps {
  currentStage: StageType
}
const StageProgress: React.FC<StageProgressProps> = (props) => {
  const { currentStage } = props

  const stageItemStyle = "pl-[26px] relative before:content-[''] before:absolute before:bg-black before:w-[10px] before:h-[10px] before:rounded-full before:left-0 before:top-3 before:z-30"
  const activeStageStyle = "text-active before:bg-active"

  return <section
    // 如果展示 MintSection，去掉 Margin
    // className=" py-5 w-full lg:mt-12"
    className=" py-5 w-full"
  >

    <div className="px-5 lg:hidden relative before:absolute before:content-[''] before:h-full before:w-[1px] before:left-[24px] before:border-dashed before:border-[1px] before:border-black/30 before:z-20">
      <div className={clsx(stageItemStyle, { [activeStageStyle]: currentStage === StageType.WhitelistPhase })}>
        <h3 className=" text-[21px] font-bold">{StagesInfo[StageType.WhitelistPhase].name}:</h3>
        <p className=" text-base leading-[21px] mt-2 mb-6">{StagesInfo[StageType.WhitelistPhase].desc}</p>
      </div>
      <div className={clsx(stageItemStyle, { [activeStageStyle]: currentStage === StageType.Presale })}>
        <h3 className=" text-[21px] font-bold">{StagesInfo[StageType.Presale].name}:</h3>
        <p className=" text-base leading-[21px] mt-2 mb-6">{StagesInfo[StageType.Presale].desc}</p>
      </div>
      <div className={clsx(stageItemStyle, { [activeStageStyle]: currentStage === StageType.PublicSale })}>
        <h3 className=" text-[21px] font-bold">{StagesInfo[StageType.PublicSale].name}:</h3>
        <p className=" text-base leading-[21px] mt-2 mb-6">{StagesInfo[StageType.PublicSale].desc}</p>
      </div>
      <div className={clsx(stageItemStyle, { [activeStageStyle]: currentStage === StageType.EndSale })}>
        <h3 className=" text-[21px] font-bold">{StagesInfo[StageType.EndSale].name}:</h3>
        <p className=" text-base leading-[21px] mt-2 mb-6">{StagesInfo[StageType.EndSale].desc}</p>
      </div>
    </div>

    <div className=" hidden w-full lg:max-w-[1200px] lg:flex items-start justify-center relative sm:space-x-[64px] lg:space-x-[80px] xl:space-x-[108px] before:content-[''] before:absolute before:w-full before:h-[1px] before:border-dashed before:border-t-[1px] before:border-[#0000004C] before:top-5 before:z-10">

      <div className={clsx("relative z-20 bg-white text-black/30", { '!text-black/100': currentStage == StageType.WhitelistPhase })}>
        <h3 className=" text-[18px] leading-[40px] font-bold w-[170px] h-[40px] rounded-[20px] border-dashed border-[1px] border-[#0000004C;] text-center xl:w-[200px] ">{StagesInfo[StageType.WhitelistPhase].name}:</h3>
        <p className=" text-base leading-[21px] font-medium mt-4 max-w-[170px] text-center ">{StagesInfo[StageType.WhitelistPhase].desc}</p>
      </div>
      <div className={clsx("relative z-20 bg-white text-black/30", { '!text-black/100': currentStage === StageType.Presale })}>
        <h3 className=" text-[18px] leading-[40px] font-bold w-[170px] h-[40px] rounded-[20px] border-dashed border-[1px] border-[#0000004C;] text-center xl:w-[200px]">{StagesInfo[StageType.Presale].name}:</h3>
        <p className=" text-base leading-[21px] font-medium mt-4 max-w-[170px] text-center ">{StagesInfo[StageType.Presale].desc}</p>
      </div>
      <div className={clsx("relative z-20 bg-white text-black/30", { '!text-black/100': currentStage === StageType.PublicSale })}>
        <h3 className=" text-[18px] leading-[40px] font-bold w-[170px] h-[40px] rounded-[20px] border-dashed border-[1px] border-[#0000004C;] text-center xl:w-[200px]">{StagesInfo[StageType.PublicSale].name}:</h3>
        <p className=" text-base leading-[21px] font-medium mt-4 max-w-[170px] text-center ">{StagesInfo[StageType.PublicSale].desc}</p>
      </div>
      <div className={clsx("relative z-20 bg-white text-black/30", { '!text-black/100': currentStage === StageType.EndSale })}>
        <h3 className=" text-[18px] leading-[40px] font-bold w-[170px] h-[40px] rounded-[20px] border-dashed border-[1px] border-[#0000004C;] text-center xl:w-[200px]">{StagesInfo[StageType.EndSale].name}:</h3>
        <p className=" text-base leading-[21px] font-medium mt-4 max-w-[170px] text-center ">{StagesInfo[StageType.EndSale].desc}</p>
      </div>
    </div>
  </section >
}

export default StageProgress