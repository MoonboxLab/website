"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/Header";

export default function Trilogy() {
  const t = useTranslations("Home");
  return (
    <div className="flex bg-black">
      <Header />
      <div className="mt-[75px] flex w-full flex-col items-center pb-[60px] lg:mt-[160px]">
        <div className="flex flex-col px-[15px] sm:h-[337.5px] sm:w-[600px] xl:h-[675px] xl:w-[1200px]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/euXWjps13aw?si=M3AaikWtswWke_JW"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <h3 className="font-Inter mb-[5px] mt-[15px] text-[18px] font-semibold leading-[24px] text-white">
            {t("chapter_one")}
          </h3>
          <span className="font-Inter text-[16px] font-semibold leading-[24px] text-white">
            {t("chapter_one_description")}
          </span>
        </div>
        <div className="mt-[60px] flex flex-col px-[15px] sm:h-[337.5px] sm:w-[600px] xl:h-[675px] xl:w-[1200px]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/r1D8ZSzm87U?si=Y24r2o2U0p_5y5l3"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <h3 className="font-Inter mb-[5px] mt-[15px] text-[18px] font-semibold leading-[24px] text-white">
            {t("chapter_two")}
          </h3>
          <span className="font-Inter text-[16px] font-semibold leading-[24px] text-white">
            {t("chapter_two_description")}
          </span>
        </div>
        <div className="mt-[60px] flex flex-col px-[15px] sm:h-[337.5px] sm:w-[600px] xl:h-[675px] xl:w-[1200px]">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/euXWjps13aw?si=M3AaikWtswWke_JW"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <h3 className="font-Inter mb-[5px] mt-[15px] text-[18px] font-semibold leading-[24px] text-white">
            {t("chapter_three")}
          </h3>
          <span className="font-Inter text-[16px] font-semibold leading-[24px] text-white">
            {t("chapter_three_description")}
          </span>
        </div>
      </div>
    </div>
  );
}
