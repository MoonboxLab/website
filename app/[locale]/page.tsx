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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const t = useTranslations("Home");

  const mediaSize = useSize(document.querySelector("body"));

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const secondPageStoryIntroduce = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [role, setRole] = useState<string>("role1");

  const [video, setVideo] = useState<string>("");

  const [isShowVideo, setIsShowVideo] = useState<boolean>(false);

  const roleChatRef = useRef<HTMLInputElement>(null);

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

      {isShowVideo && (
        <div className="absolute z-[200] h-screen w-full bg-black/80">
          <div className="absolute left-[50%] top-[50%] z-[120] flex translate-x-[-50%] translate-y-[-50%] flex-col items-end">
            <Button
              onClick={() => setIsShowVideo(false)}
              className="bg-inherit pr-0 hover:bg-inherit active:bg-inherit"
            >
              <Image
                src="/video_close.svg"
                height={32}
                width={32}
                alt="play"
                priority
              />
            </Button>
            <div className="mt-[5px] rounded-3xl border-[5px] border-black">
              <iframe
                className="h-[180px] w-[320px] rounded-2xl md:h-[360px] md:w-[640px] lg:h-[432px] lg:w-[768px] xl:h-[360px] xl:w-[640px] 3xl:h-[432px] 3xl:w-[768px] 4xl:h-[576px] 4xl:w-[1024px] 4xl:rounded-xl 5xl:h-[720px] 5xl:w-[1280px]"
                src={video}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

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
              <div
                onClick={() => {
                  setVideo("https://www.youtube.com/embed/K7KDMH6tyfk?rel=0");
                  setIsShowVideo(true);
                }}
                className="hover-btn-shadow absolute bottom-[150px] left-[30px] flex h-[80px] w-[200px] items-center justify-center rounded-[10px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              >
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
            <div className="grid w-full grid-cols-[500px,auto] items-center gap-[90px] bg-white px-[65px] 4xl:grid-cols-[640px,auto] 4xl:gap-[120px]">
              <div className="flex h-full justify-center bg-white pb-[175px] pt-[150px]">
                <Tabs
                  defaultValue="role1"
                  className="grid-rows-10 grid h-full w-full"
                  onValueChange={setRole}
                >
                  <TabsList className="row-span-1 grid h-[80px] grid-cols-5">
                    <TabsTrigger value="role1" className="relative">
                      {role !== "role1" && (
                        <div className="absolute z-10 h-[80px] w-full bg-white/50" />
                      )}
                      <Image
                        src="/nobody_role_1.png"
                        height={75}
                        width={75}
                        alt="role1"
                        priority
                      />
                    </TabsTrigger>
                    <TabsTrigger value="role2" className="relative">
                      {role !== "role2" && (
                        <div className="absolute z-10 h-[80px] w-full bg-white/50" />
                      )}
                      <Image
                        src="/nobody_role_2.png"
                        height={75}
                        width={75}
                        alt="role2"
                        priority
                      />
                    </TabsTrigger>
                    <TabsTrigger value="role3" className="relative">
                      {role !== "role3" && (
                        <div className="absolute z-10 h-[80px] w-full bg-white/50" />
                      )}
                      <Image
                        src="/nobody_role_3.png"
                        height={75}
                        width={75}
                        alt="role3"
                        priority
                      />
                    </TabsTrigger>
                    <TabsTrigger value="role4" className="relative">
                      {role !== "role4" && (
                        <div className="absolute z-10 h-[80px] w-full bg-white/50" />
                      )}
                      <Image
                        src="/nobody_role_4.png"
                        height={75}
                        width={75}
                        alt="role4"
                        priority
                      />
                    </TabsTrigger>
                    <TabsTrigger value="role5" className="relative">
                      {role !== "role5" && (
                        <div className="absolute z-10 h-[80px] w-full bg-white/50" />
                      )}
                      <Image
                        src="/nobody_role_5.png"
                        height={75}
                        width={75}
                        alt="role5"
                        priority
                      />
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="role1" className="row-span-9">
                    <div className="flex h-full flex-col">
                      <div className="relative flex-1">
                        <Image
                          className="absolute px-[10px] pt-[60px]"
                          src="/nobody_role_1.png"
                          fill
                          alt="role1"
                          priority
                        />
                      </div>
                      <Input
                        placeholder="等你与我聊聊天…"
                        className="h-[40px] w-full flex-none rounded-lg border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] 4xl:placeholder:text-[18px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:text-[18px] 4xl:leading-[18px]"
                        ref={roleChatRef}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="role2" className="row-span-9">
                    <div className="flex h-full flex-col">
                      <div className="relative flex-1">
                        <Image
                          className="absolute px-[10px] pt-[60px]"
                          src="/nobody_role_2_bg.png"
                          fill
                          alt="role2"
                          priority
                        />
                      </div>
                      <Input
                        placeholder="等你与我聊聊天…"
                        className="h-[40px] w-full flex-none rounded-lg border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] 4xl:placeholder:text-[18px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:text-[18px] 4xl:leading-[18px]"
                        ref={roleChatRef}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="role3" className="row-span-9">
                    <div className="flex h-full flex-col">
                      <div className="relative flex-1">
                        <Image
                          className="absolute px-[10px] pt-[60px]"
                          src="/nobody_role_3.png"
                          fill
                          alt="role3"
                          priority
                        />
                      </div>
                      <Input
                        placeholder="等你与我聊聊天…"
                        className="h-[40px] w-full flex-none rounded-lg border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] 4xl:placeholder:text-[18px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:text-[18px] 4xl:leading-[18px]"
                        ref={roleChatRef}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="role4" className="row-span-9">
                    <div className="flex h-full flex-col">
                      <div className="relative flex-1">
                        <Image
                          className="absolute px-[10px] pt-[60px]"
                          src="/nobody_role_4.png"
                          fill
                          alt="role4"
                          priority
                        />
                      </div>
                      <Input
                        placeholder="等你与我聊聊天…"
                        className="h-[40px] w-full flex-none rounded-lg border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] 4xl:placeholder:text-[18px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:text-[18px] 4xl:leading-[18px]"
                        ref={roleChatRef}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="role5" className="row-span-9">
                    <div className="flex h-full flex-col">
                      <div className="relative flex-1">
                        <Image
                          className="absolute px-[10px] pt-[60px]"
                          src="/nobody_role_5.png"
                          fill
                          alt="role5"
                          priority
                        />
                      </div>
                      <Input
                        placeholder="等你与我聊聊天…"
                        className="h-[40px] w-full flex-none rounded-lg border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] 4xl:placeholder:text-[18px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:text-[18px] 4xl:leading-[18px]"
                        ref={roleChatRef}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex h-full flex-col items-start pb-[175px] pt-[150px]">
                <span className="w-full text-left text-[36px] font-bold text-black 4xl:text-[48px]">
                  ORIGIN STORY OF NOBODY
                </span>
                <div className="flex h-full flex-col items-start">
                  <div
                    className="text-balck mt-[30px] 4xl:mt-[50px] flex-1 text-[16px] font-semibold leading-[24px] 4xl:text-[24px] 4xl:leading-[36px]"
                    dangerouslySetInnerHTML={{
                      __html: t.raw("nobody_story_content"),
                    }}
                  />
                  <div className="grid flex-none grid-cols-3 items-center gap-[30px]">
                    <div className="flex flex-col items-center">
                      <div
                        className="relative rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                        onClick={() => {
                          setVideo(
                            "https://www.youtube.com/embed/4oixai0Fgvg?rel=0",
                          );
                          setIsShowVideo(true);
                        }}
                      >
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
                      <span className="mt-[20px] text-[14px] font-semibold leading-[14px] text-black 4xl:text-[18px] 4xl:leading-[18px]">
                        Chapter One : Spacebus
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="relative rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                        onClick={() => {
                          setVideo(
                            "https://www.youtube.com/embed/kMTaAkQ0rcs?rel=0",
                          );
                          setIsShowVideo(true);
                        }}
                      >
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
                      <span className="mt-[20px] text-[14px] font-semibold leading-[14px] text-black 4xl:text-[18px] 4xl:leading-[18px]">
                        Chapter Two : Accident
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="relative rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                        onClick={() => {
                          setVideo(
                            "https://www.youtube.com/embed/6spSsLZmEuM?rel=0",
                          );
                          setIsShowVideo(true);
                        }}
                      >
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
                      <span className="mt-[20px] text-[14px] font-semibold leading-[14px] text-black 4xl:text-[18px] 4xl:leading-[18px]">
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
