"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useTranslations } from "next-intl";

export default function Trilogy() {
  const t = useTranslations("Home");
  return (
    <div className="flex bg-black">
      <Header />
      <div className="mt-[80px] flex w-full flex-col items-center pb-[80px] lg:mt-[120px] lg:pb-[150px]">
        <div className="mt-[40px] flex w-min flex-col">
          <iframe
            className="h-[180px] w-[320px] md:h-[360px] md:w-[640px] lg:h-[432px] lg:w-[768px] xl:h-[576px] xl:w-[1024px]"
            src="https://www.youtube.com/embed/euXWjps13aw?rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <h3 className="font-Inter mt-[20px] text-[21px] font-semibold leading-[24px] text-white lg:mt-[40px] lg:text-[28px]">
            {t("chapter_one")}
          </h3>
          <span className="font-Inter mt-[10px] text-[16px] font-semibold leading-[24px] text-white lg:mt-[20px] lg:text-[19px]">
            {t("chapter_one_description")}
          </span>
        </div>
        <div className="mt-[80px] flex w-min flex-col">
          <iframe
            className="h-[180px] w-[320px] md:h-[360px] md:w-[640px] lg:h-[432px] lg:w-[768px] xl:h-[576px] xl:w-[1024px]"
            src="https://www.youtube.com/embed/r1D8ZSzm87U?rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <h3 className="font-Inter mt-[20px] text-[21px] font-semibold leading-[24px] text-white lg:mt-[40px] lg:text-[28px]">
            {t("chapter_two")}
          </h3>
          <span className="font-Inter mt-[10px] text-[16px] font-semibold leading-[24px] text-white lg:mt-[20px] lg:text-[19px]">
            {t("chapter_two_description")}
          </span>
        </div>
        <div className="mt-[80px] flex w-min flex-col">
          {/* <iframe
            className="h-[180px] w-[320px] md:h-[360px] md:w-[640px] lg:h-[432px] lg:w-[768px] xl:h-[576px] xl:w-[1024px]"
            src="https://www.youtube.com/embed/euXWjps13aw?rel=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          /> */}

          <div className="relative h-[180px] w-[320px] md:h-[360px] md:w-[640px] lg:h-[432px] lg:w-[768px] xl:h-[576px] xl:w-[1024px]">
            <a href="https://www.youtube.com/watch?v=66XeItBBQQU" target="_blank">
              <Image
                fill
                src="/trilogy_chapter_three.jpg"
                alt="chapter three"
                priority
              />
            </a>
          </div>

          <h3 className="font-Inter mt-[20px] text-[21px] font-semibold leading-[24px] text-white lg:mt-[40px] lg:text-[30px]">
            {t("chapter_three")}
          </h3>
          <span className="font-Inter mt-[10px] text-[16px] font-semibold leading-[24px] text-white lg:mt-[20px] lg:text-[21px]">
            {t("chapter_three_description")}
          </span>
        </div>
      </div>
    </div>
  );
}
