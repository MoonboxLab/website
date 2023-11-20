"use client";
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import "core-js/features/object/has-own";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import FirstSection from "./home_section";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";
import Typed from "typed.js";

export default function Home() {
  const t = useTranslations("Home");

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTypedSecondPage, setTypedSecondPage] = useState<boolean>(false);

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
        <meta property="og:image" content="/home_video_cover.png" />
        <meta property="og:url" content="https://moonbox.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />

      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        transitionDuration={600}
        onBeforeChange={(before, after) => {
          if (showChatModal) {
            setActiveIndex(0);
          }
        }}
      >
        <FullpageSection>
          <FirstSection
            playingMedia={playingMedia}
            setPlayingMedia={setPlayingMedia}
            showChatModal={showChatModal}
            setShowChatModal={setShowChatModal}
          />
        </FullpageSection>

        <FullpageSection>
          <div className="flex h-auto w-full flex-col items-center bg-[#151515] bg-[url('/bg-section2.png')] bg-contain bg-[80%_80%]">
            <div className="flex flex-col items-center pt-[230px] pb-[160px]">
              <span className="text-[24px] font-bold leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[60px] 3xl:leading-[60px]">
                About Nobody
              </span>
              <span className="mt-[30px] max-w-[1093px] text-center text-[24px] font-medium leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[36px] 3xl:leading-[48px]">
                Welcome to moonbox , a place that celebrates connection, unity,
                and togetherness.
              </span>
              <span className="mt-[30px] max-w-[1117px] text-center text-[24px] font-medium leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[36px] 3xl:leading-[48px]">
                Our dedicated team is committed to creating value and providing
                unforgettable experiences for our NFT holders. Join us on this
                exciting journey as we continue to expand and evolve in the
                world of digital collectibles.
              </span>
            </div>
            <div className="flex flex-col items-center py-[160px]">
              <span className="text-[24px] font-bold leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[60px] 3xl:leading-[60px]">
                Auction Schedule
              </span>
              <div className="flex">
                <div className="flex flex-col">
                  <span className="mt-[30px] max-w-[1093px] text-center text-[24px] font-medium leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[36px] 3xl:leading-[48px]">
                    Invite registration
                  </span>
                  <span className="mt-[30px] max-w-[1117px] text-center text-[24px] font-medium leading-[36px] text-white lg:text-[32px] lg:leading-[42px] 3xl:text-[36px] 3xl:leading-[48px]">
                    12/15-12/30 24:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FullpageSection>
      </FullpageContainer>
    </div>
  );
}
