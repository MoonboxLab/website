"use client";

import "core-js/features/object/has-own";
import Image from "next/image";
import { useSize } from "ahooks";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";
import Footer from "@/components/ConnectWallet";

export default function Home() {
  const t = useTranslations("Home");

  const mediaSize = useSize(document.querySelector("body"));

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const secondPageStoryIntroduce = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({
      top: chatListBottomRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [chatListBottomRef.current?.scrollHeight]);

  return (
    <div className=" bg-gray-600">
      <Head>
        <title>Moonbox</title>
        <meta name="description" content="Bring life to NFTs" />
        <meta property="og:title" content="Moonbox" />
        <meta property="og:description" content="Bring life to NFTs" />
        <meta property="og:image" content="/open-graph.png" />
        <meta property="og:url" content="https://moonbox.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://moonbox.com/open-graph.jpg"
        ></meta>
      </Head>

      <Header />

      {/* PC UI */}
      {(mediaSize?.width || 0) >= 1024 && (
        <FullpageContainer
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          transitionDuration={600}
        >
          <FullpageSection>
            <div className="relative h-screen w-full items-center">
              <Image src="/home_bg_mint.jpg" fill alt="mint" priority />
              <div className="hover-btn-shadow absolute bottom-[150px] left-[30px] flex h-[80px] w-[200px] items-center justify-center rounded-[10px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <Image
                  src="/home_play_mv.png"
                  height={64}
                  width={64}
                  alt="play"
                  priority
                />
                <span className="ml-[16px] text-[18px] font-semibold leading-[24px] text-black">
                  {t("nobody_nft_mv")}
                </span>
              </div>
              <Footer />
            </div>
          </FullpageSection>
          <FullpageSection>
            <div className="flex w-full items-center bg-white px-[65px]">
              <div className="h-full w-1/3 bg-white"></div>
              <div className="flex h-full w-2/3 flex-col items-center pb-[175px] pt-[150px]">
                <span className="text-[48px] font-bold text-black">
                  ORIGIN STORY OF NOBODY
                </span>
                <div className="flex flex-col items-start">
                  <div
                    className="text-balck mt-[50px] max-w-[1024px] text-[24px] font-semibold leading-[36px]"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("nobody_story_content"),
                    }}
                  />
                  <div className="mt-[80px] grid grid-cols-3 items-center gap-[30px]">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src="/chapter_one.jpg"
                          width={300}
                          height={165}
                          alt="chapter one"
                          priority
                        />
                        <Image
                          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                          src="/chapter_play.png"
                          width={64}
                          height={64}
                          alt="play"
                          priority
                        />
                      </div>
                      <span className="mt-[20px] text-[18px] font-semibold leading-[18px] text-black">
                        Chapter One : Spacebus
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src="/chapter_two.jpg"
                          width={300}
                          height={165}
                          alt="chapter two"
                          priority
                        />
                        <Image
                          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                          src="/chapter_play.png"
                          width={64}
                          height={64}
                          alt="play"
                          priority
                        />
                      </div>
                      <span className="mt-[20px] text-[18px] font-semibold leading-[18px] text-black">
                        Chapter Two : Accident
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Image
                          src="/chapter_three.jpg"
                          width={300}
                          height={165}
                          alt="chapter three"
                          priority
                        />
                        <Image
                          className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                          src="/chapter_play.png"
                          width={64}
                          height={64}
                          alt="play"
                          priority
                        />
                      </div>
                      <span className="mt-[20px] text-[18px] font-semibold leading-[18px] text-black">
                        Chapter Three : Arrival
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </FullpageSection>
        </FullpageContainer>
      )}

      {/* Mobile UI */}
    </div>
  );
}
