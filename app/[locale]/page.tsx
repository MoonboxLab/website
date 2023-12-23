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
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

      {/* PC UI */}
      {(mediaSize?.width || 0) > 1024 && <Footer />}

      {(mediaSize?.width || 0) > 1024 && isShowVideo && (
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

      {(mediaSize?.width || 0) > 1024 && (
        <FullpageContainer
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          transitionDuration={600}
        >
          <FullpageSection>
            <div className="relative h-screen w-full items-center">
              <Header />
              <Image src="/home_bg_mint.jpg" fill alt="mint" priority />
              <div
                onClick={() => {
                  setVideo("https://www.youtube.com/embed/K7KDMH6tyfk?rel=0");
                  setIsShowVideo(true);
                }}
                className="hover-btn-shadow absolute bottom-[108px] left-[20px] flex h-[80px] w-[200px] items-center justify-center rounded-[16px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:bottom-[140px]"
              >
                <Image
                  className="mt-[5px]"
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
            </div>
          </FullpageSection>
          <FullpageSection>
            <div className="flex h-screen w-full items-center justify-center bg-white px-[50px] pb-[128px] pt-[60px] 4xl:px-[100px] 4xl:pb-[175px] 4xl:pt-[50px] 5xl:pt-[100px]">
              <div className="grid h-full w-[1180px] grid-cols-[38%,auto] gap-[88px] 4xl:w-[1760px] 4xl:gap-[120px] 5xl:w-[2100px] 5xl:gap-[200px]">
                <div className="flex h-full justify-center">
                  <Tabs
                    defaultValue="role1"
                    className="grid h-full w-full grid-rows-6"
                    onValueChange={setRole}
                  >
                    <TabsList className="row-span-1 grid h-[100px] grid-cols-5">
                      <TabsTrigger
                        value="role1"
                        className="relative h-[100px] bg-white"
                      >
                        {role !== "role1" && (
                          <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                        )}
                        <Image
                          src="/nobody_role_1.png"
                          height={100}
                          width={100}
                          alt="role1"
                          priority
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="role2"
                        className="relative h-[100px] bg-white"
                      >
                        {role !== "role2" && (
                          <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                        )}
                        <Image
                          src="/nobody_role_2.png"
                          height={100}
                          width={100}
                          alt="role2"
                          priority
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="role3"
                        className="relative h-[100px] bg-white"
                      >
                        {role !== "role3" && (
                          <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                        )}
                        <Image
                          src="/nobody_role_3.png"
                          height={100}
                          width={100}
                          alt="role3"
                          priority
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="role4"
                        className="relative h-[100px] bg-white"
                      >
                        {role !== "role4" && (
                          <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                        )}
                        <Image
                          src="/nobody_role_4.png"
                          height={100}
                          width={100}
                          alt="role4"
                          priority
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="role5"
                        className="relative h-[100px] bg-white"
                      >
                        {role !== "role5" && (
                          <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                        )}
                        <Image
                          src="/nobody_role_5.png"
                          height={100}
                          width={100}
                          alt="role5"
                          priority
                        />
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="role1" className="row-span-5">
                      <div className="flex h-full flex-col">
                        <div className="relative flex-1">
                          <Image
                            className="absolute bottom-0 w-full"
                            src="/nobody_role_1_bg.png"
                            height={450}
                            width={450}
                            alt="role1"
                            priority
                          />
                        </div>
                        <Input
                          placeholder="等你与我聊聊天…"
                          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
                          ref={roleChatRef}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="role2" className="row-span-5">
                      <div className="flex h-full flex-col">
                        <div className="relative flex-1">
                          <Image
                            className="absolute bottom-0 w-full"
                            src="/nobody_role_2_bg.png"
                            height={450}
                            width={450}
                            alt="role2"
                            priority
                          />
                        </div>
                        <Input
                          placeholder="等你与我聊聊天…"
                          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
                          ref={roleChatRef}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="role3" className="row-span-5">
                      <div className="flex h-full flex-col">
                        <div className="relative flex-1">
                          <Image
                            className="absolute bottom-0 w-full"
                            src="/nobody_role_3_bg.png"
                            height={450}
                            width={450}
                            alt="role3"
                            priority
                          />
                        </div>
                        <Input
                          placeholder="等你与我聊聊天…"
                          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
                          ref={roleChatRef}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="role4" className="row-span-5">
                      <div className="flex h-full flex-col">
                        <div className="relative flex-1">
                          <Image
                            className="absolute bottom-0 w-full"
                            src="/nobody_role_4_bg.png"
                            height={450}
                            width={450}
                            alt="role4"
                            priority
                          />
                        </div>
                        <Input
                          placeholder="等你与我聊聊天…"
                          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
                          ref={roleChatRef}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="role5" className="row-span-5">
                      <div className="flex h-full flex-col">
                        <div className="relative flex-1">
                          <Image
                            className="absolute bottom-0 w-full"
                            src="/nobody_role_5_bg.png"
                            height={450}
                            width={450}
                            alt="role5"
                            priority
                          />
                        </div>
                        <Input
                          placeholder="等你与我聊聊天…"
                          className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 4xl:h-[56px] 4xl:rounded-xl 4xl:text-[18px] 4xl:leading-[18px] 4xl:placeholder:text-[18px] 5xl:h-[64px]"
                          ref={roleChatRef}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex h-full flex-col items-start">
                  <span className="w-full text-left text-[36px] font-bold text-black 4xl:text-[48px] 5xl:text-[56px]">
                    ORIGIN STORY OF NOBODY
                  </span>
                  <div className="flex h-full flex-col items-start">
                    <div
                      className="text-balck mt-[30px] max-w-[1400px] flex-1 text-[16px] font-semibold leading-[24px]  4xl:mt-[30px] 4xl:text-[24px] 4xl:leading-[32px] 5xl:mt-[50px] 5xl:text-[28px] 5xl:leading-[40px]"
                      dangerouslySetInnerHTML={{
                        __html: t.raw("nobody_story_content"),
                      }}
                    />
                    <div className="grid flex-none grid-cols-3 items-center gap-[30px]">
                      <div className="flex flex-col items-center">
                        <div
                          className="relative rounded-xl border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                          onClick={() => {
                            setVideo(
                              "https://www.youtube.com/embed/4oixai0Fgvg?rel=0",
                            );
                            setIsShowVideo(true);
                          }}
                        >
                          <Image
                            className="rounded-lg"
                            src="/chapter_one.jpg"
                            width={400}
                            height={165}
                            alt="chapter one"
                            priority
                          />
                          <Image
                            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-2xl"
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
                          className="relative rounded-xl border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                          onClick={() => {
                            setVideo(
                              "https://www.youtube.com/embed/kMTaAkQ0rcs?rel=0",
                            );
                            setIsShowVideo(true);
                          }}
                        >
                          <Image
                            className="rounded-lg"
                            src="/chapter_two.jpg"
                            width={400}
                            height={165}
                            alt="chapter two"
                            priority
                          />
                          <Image
                            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-2xl"
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
                          className="relative rounded-xl border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                          onClick={() => {
                            setVideo(
                              "https://www.youtube.com/embed/6spSsLZmEuM?rel=0",
                            );
                            setIsShowVideo(true);
                          }}
                        >
                          <Image
                            className="rounded-lg"
                            src="/chapter_three.jpg"
                            width={400}
                            height={165}
                            alt="chapter three"
                            priority
                          />
                          <Image
                            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-2xl"
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
            </div>
          </FullpageSection>
        </FullpageContainer>
      )}

      {/* Mobile UI */}
      {(mediaSize?.width || 0) <= 1024 && isShowVideo && (
        <div className="absolute z-[200] h-screen w-screen bg-black/80">
          <div className="absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] flex-col items-end">
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
            <div className="flex w-screen flex-col">
              <AspectRatio ratio={16 / 9} className="px-[15px]">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/4oixai0Fgvg?rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      )}

      {(mediaSize?.width || 0) <= 1024 && (
        <div className="w-full bg-white">
          <div className="items-cente relative h-screen w-full">
            <Header />
            <Image src="/home_bg_mint_mobile.jpg" fill alt="mint" priority />
            <div className="absolute bottom-[45px] z-10 flex w-full flex-col px-[15px]">
              <div
                className="hover-btn-shadow relative flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                onClick={() => {
                  setVideo("https://www.youtube.com/embed/K7KDMH6tyfk?rel=0");
                  setIsShowVideo(true);
                }}
              >
                <Image
                  className="absolute left-0 ml-[2px] mt-[8px]"
                  src="/home_play_mv.png"
                  height={50}
                  width={50}
                  alt="play"
                  priority
                />
                <span className="text-[21px] font-semibold text-black">
                  Nobody NFT MV
                </span>
              </div>
              <div className="hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="text-[21px] font-semibold text-black">
                  Mint
                </span>
                <span className="ml-[10px] text-[18px] font-semibold text-black">
                  (01/24 08:00)
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center bg-black py-[40px]">
            <div className="flex flex-col items-start">
              <div className="flex h-[108px]">
                <Image
                  src="/mint_progress_now_long.png"
                  height={108}
                  width={20}
                  alt="now"
                  priority
                />
                <div className="ml-[15px] flex flex-col justify-center">
                  <span className="text-[21px] font-semibold leading-[21px] text-yellow-300">
                    Presale
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-yellow-300">
                    01/23 08:00~01/24 08:00(UTC8)
                  </span>
                  <div className="hover-btn-shadow mt-[20px] flex h-[40px]  w-[160px] items-center justify-center rounded-[18px] border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <span className="text-[16px] font-semibold text-black">
                      Receive Waitlist
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-[40px] flex">
                <Image
                  src="/mint_progress_next.png"
                  height={48}
                  width={20}
                  alt="next"
                  priority
                />
                <div className="ml-[15px] flex flex-col justify-center">
                  <span className="text-[21px] font-semibold leading-[21px] text-white">
                    Public sale
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-white">
                    01/24 08:00~01/25 08:00(UTC8)
                  </span>
                </div>
              </div>
              <div className="mt-[40px] flex">
                <Image
                  src="/mint_progress_next.png"
                  height={48}
                  width={20}
                  alt="next"
                  priority
                />
                <div className="ml-[15px] flex flex-col justify-center">
                  <span className="text-[21px] font-semibold leading-[21px] text-white">
                    Refund
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-white">
                    Start at 01-26 08:00(UTC8)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultValue="role1"
            className="grid h-full w-full grid-rows-6"
            onValueChange={setRole}
          >
            <TabsList className="row-span-1 grid h-[100px] grid-cols-5">
              <TabsTrigger
                value="role1"
                className="relative h-[100px] bg-white"
              >
                {role !== "role1" && (
                  <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                )}
                <Image
                  src="/nobody_role_1.png"
                  height={100}
                  width={100}
                  alt="role1"
                  priority
                />
              </TabsTrigger>
              <TabsTrigger
                value="role2"
                className="relative h-[100px] bg-white"
              >
                {role !== "role2" && (
                  <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                )}
                <Image
                  src="/nobody_role_2.png"
                  height={100}
                  width={100}
                  alt="role2"
                  priority
                />
              </TabsTrigger>
              <TabsTrigger
                value="role3"
                className="relative h-[100px] bg-white"
              >
                {role !== "role3" && (
                  <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                )}
                <Image
                  src="/nobody_role_3.png"
                  height={100}
                  width={100}
                  alt="role3"
                  priority
                />
              </TabsTrigger>
              <TabsTrigger
                value="role4"
                className="relative h-[100px] bg-white"
              >
                {role !== "role4" && (
                  <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                )}
                <Image
                  src="/nobody_role_4.png"
                  height={100}
                  width={100}
                  alt="role4"
                  priority
                />
              </TabsTrigger>
              <TabsTrigger
                value="role5"
                className="relative h-[100px] bg-white"
              >
                {role !== "role5" && (
                  <div className="absolute z-10 h-[100px] w-full bg-white/50" />
                )}
                <Image
                  src="/nobody_role_5.png"
                  height={100}
                  width={100}
                  alt="role5"
                  priority
                />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="role1" className="row-span-5">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    className="absolute bottom-0 left-[50%] w-full max-w-[450px] translate-x-[-50%]"
                    src="/nobody_role_1_bg.png"
                    height={450}
                    width={450}
                    alt="role1"
                    priority
                  />
                </div>
                <div className="w-full px-[15px]">
                  <Input
                    placeholder="等你与我聊聊天…"
                    className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0"
                    ref={roleChatRef}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="role2" className="row-span-5">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    className="absolute bottom-0 left-[50%] w-full max-w-[450px] translate-x-[-50%]"
                    src="/nobody_role_2_bg.png"
                    height={450}
                    width={450}
                    alt="role2"
                    priority
                  />
                </div>
                <div className="w-full px-[15px]">
                  <Input
                    placeholder="等你与我聊聊天…"
                    className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0"
                    ref={roleChatRef}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="role3" className="row-span-5">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    className="absolute bottom-0 left-[50%] w-full max-w-[450px] translate-x-[-50%]"
                    src="/nobody_role_3_bg.png"
                    height={450}
                    width={450}
                    alt="role3"
                    priority
                  />
                </div>
                <div className="w-full px-[15px]">
                  <Input
                    placeholder="等你与我聊聊天…"
                    className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0"
                    ref={roleChatRef}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="role4" className="row-span-5">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    className="absolute bottom-0 left-[50%] w-full max-w-[450px] translate-x-[-50%]"
                    src="/nobody_role_4_bg.png"
                    height={450}
                    width={450}
                    alt="role4"
                    priority
                  />
                </div>
                <div className="w-full px-[15px]">
                  <Input
                    placeholder="等你与我聊聊天…"
                    className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0"
                    ref={roleChatRef}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="role5" className="row-span-5">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  <Image
                    className="absolute bottom-0 left-[50%] w-full max-w-[450px] translate-x-[-50%]"
                    src="/nobody_role_5_bg.png"
                    height={450}
                    width={450}
                    alt="role5"
                    priority
                  />
                </div>
                <div className="w-full px-[15px]">
                  <Input
                    placeholder="等你与我聊聊天…"
                    className="h-[40px] w-full flex-none  rounded-[8px] border-[#3B84FF] bg-white px-[20px] text-[14px] font-normal leading-[14px] outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-blue-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0"
                    ref={roleChatRef}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-[40px] flex w-full flex-col items-center px-[15px]">
            <span className="text-[30px] font-bold leading-[36px] text-black">
              ORIGIN STORY OF
            </span>
            <span className="text-[30px] font-bold leading-[36px] text-black">
              NOBODY
            </span>
          </div>
          <div
            className="text-balck mt-[20px] px-[15px] text-[18px] font-medium leading-[30px]"
            dangerouslySetInnerHTML={{
              __html: t.raw("nobody_story_content"),
            }}
          />
          <div className="mt-[40px] flex flex-col pb-[50px]">
            <div className="flex flex-col">
              <AspectRatio ratio={16 / 9} className="px-[15px]">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/4oixai0Fgvg?rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AspectRatio>
              <span className="mt-[5px] px-[15px] text-[18px] font-semibold leading-[18px] text-black">
                Chapter One : Spacebus
              </span>
            </div>
            <div className="mt-[30px] flex flex-col">
              <AspectRatio ratio={16 / 9} className="px-[15px]">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/kMTaAkQ0rcs?rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AspectRatio>
              <span className="mt-[5px] px-[15px] text-[18px] font-semibold leading-[18px] text-black">
                Chapter Two : Accident
              </span>
            </div>
            <div className="mt-[30px] flex flex-col">
              <AspectRatio ratio={16 / 9} className="px-[15px]">
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-xl"
                    src="https://www.youtube.com/embed/6spSsLZmEuM?rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AspectRatio>
              <span className="mt-[5px] px-[15px] text-[18px] font-semibold leading-[18px] text-black">
                Chapter Three : Arrival
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
