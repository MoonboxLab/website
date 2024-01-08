"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useSize } from "ahooks";
import "core-js/features/object/has-own";
import ReactFullpage from "@fullpage/react-fullpage";

import Chat from "@/components/Chat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const t = useTranslations("Home");

  const mediaSize = useSize(document.querySelector("body"));

  const [role, setRole] = useState<string>("role1");

  const [video, setVideo] = useState<string>("");

  const [isShowVideo, setIsShowVideo] = useState<boolean>(false);

  const locale = useLocale();

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-02-01T20:00:00+08:00");

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className=" bg-gray-600">
      <Head>
        <title>Nobody</title>
        <meta name="description" content="Bring life to NFTs" />
        <meta property="og:title" content="Nobody" />
        <meta property="og:description" content="Bring life to NFTs" />
        <meta property="og:image" content="/open-graph.png" />
        <meta property="og:url" content="https://nobody.xyz" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://nobody.xyz/open-graph.jpg"
        ></meta>
      </Head>

      {/* PC UI */}
      {(mediaSize?.width || 0) > 1024 && <Footer countdown={countdown} />}

      {(mediaSize?.width || 0) > 1024 && isShowVideo && (
        <div className="absolute z-[200] h-screen w-full backdrop-blur">
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
        <ReactFullpage
          navigation
          scrollHorizontally={false}
          credits={{ enabled: false }}
          render={() => (
            <ReactFullpage.Wrapper>
              <div className="section h-screen w-screen">
                <div className="relative h-screen w-full bg-white">
                  <Header />
                  <Image
                    src="/home_bg_mint_1.png"
                    fill
                    alt="mint"
                    priority
                    className="object-cover"
                  />
                  <div
                    onClick={() => {
                      setVideo(
                        "https://www.youtube.com/embed/K7KDMH6tyfk?rel=0",
                      );
                      setIsShowVideo(true);
                    }}
                    className="hover-btn-shadow absolute bottom-[108px] left-[20px] flex h-[64px] w-[160px] items-center justify-center rounded-[16px] border-2 border-black bg-white pl-[5px] shadow-[4px_4px_0px_rgba(0,0,0,1)] 4xl:bottom-[140px] 4xl:left-[30px] 4xl:h-[80px] 4xl:w-[200px]"
                  >
                    <Image
                      className="mt-[5px] h-[48px] w-[48px] 4xl:h-[64px] 4xl:w-[64px]"
                      src="/home_play_mv.png"
                      height={64}
                      width={64}
                      alt="play"
                      priority
                    />
                    <span className="ml-[10px] text-[16px] font-semibold leading-[20px] text-black 4xl:ml-[16px] 4xl:text-[18px] 4xl:leading-[24px]">
                      {t("nobody_nft_mv")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="section h-screen w-screen">
                <div className="relative h-screen w-full bg-white pb-[88px] 4xl:pb-[120px]">
                  <Image
                    src="/home_bg_mint_2.png"
                    fill
                    alt="mint"
                    priority
                    className="object-cover"
                  />
                  <div className="relative h-full w-full">
                    <Image
                      src="/nobody_community.webp"
                      height={2463}
                      width={2463}
                      alt="dao"
                      priority
                      className="absolute right-[6%] top-[50%] w-[42%] translate-y-[-50%] object-cover"
                    />
                    {locale == "en" ? (
                      <Image
                        src="/nobody_friend_en.png"
                        height={2262}
                        width={1590}
                        alt="friend"
                        priority
                        className="absolute left-[9%] top-[50%] w-[39%] translate-y-[-50%] object-cover"
                      />
                    ) : (
                      <Image
                        src="/nobody_friend_zh.png"
                        height={1119}
                        width={2259}
                        alt="friend"
                        priority
                        className="absolute left-[9%] top-[50%] w-[39%] translate-y-[-50%] object-cover"
                      />
                    )}
                    <Image
                      src="/nobody_friend_flower.png"
                      height={280}
                      width={170}
                      alt="flower"
                      priority
                      className="absolute bottom-0 left-[2%] w-[9%] object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="section h-screen w-screen">
                <div className="flex h-screen w-full items-center justify-center bg-[#FFD600] px-[50px] pb-[128px] pt-[60px] 4xl:px-[100px] 4xl:pb-[175px] 4xl:pt-[50px] 5xl:pt-[100px]">
                  <div className="grid h-full grid-cols-[46%,auto] gap-[88px] 4xl:gap-[120px] 5xl:gap-[150px]">
                    <div className="flex h-full justify-center">
                      <Tabs
                        defaultValue="role1"
                        className="grid h-full w-full grid-rows-[100px,auto]"
                        onValueChange={setRole}
                      >
                        <TabsList className="grid h-[100px] grid-cols-5 bg-[#FFD600]">
                          <TabsTrigger
                            value="role1"
                            className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                          >
                            <Image
                              src="/nobody_role_1.png"
                              height={100}
                              width={100}
                              alt="role1"
                              priority
                            />
                            {role === "role1" && (
                              <Image
                                className="z-10 w-full"
                                src="/nobody_role_indicator.png"
                                height={10}
                                width={100}
                                alt="indicator"
                                priority
                              />
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="role2"
                            className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                          >
                            <Image
                              src="/nobody_role_2.png"
                              height={100}
                              width={100}
                              alt="role2"
                              priority
                            />
                            {role === "role2" && (
                              <Image
                                className="z-10 w-full"
                                src="/nobody_role_indicator.png"
                                height={10}
                                width={100}
                                alt="indicator"
                                priority
                              />
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="role3"
                            className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                          >
                            <Image
                              src="/nobody_role_3.png"
                              height={100}
                              width={100}
                              alt="role3"
                              priority
                            />
                            {role === "role3" && (
                              <Image
                                className="z-10 w-full"
                                src="/nobody_role_indicator.png"
                                height={10}
                                width={100}
                                alt="indicator"
                                priority
                              />
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="role4"
                            className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                          >
                            <Image
                              src="/nobody_role_4.png"
                              height={100}
                              width={100}
                              alt="role4"
                              priority
                            />
                            {role === "role4" && (
                              <Image
                                className="z-10 w-full"
                                src="/nobody_role_indicator.png"
                                height={10}
                                width={100}
                                alt="indicator"
                                priority
                              />
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="role5"
                            className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                          >
                            <Image
                              src="/nobody_role_5.png"
                              height={100}
                              width={100}
                              alt="role5"
                              priority
                            />
                            {role === "role5" && (
                              <Image
                                className="z-10 w-full"
                                src="/nobody_role_indicator.png"
                                height={10}
                                width={100}
                                alt="indicator"
                                priority
                              />
                            )}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="role1">
                          <Chat role={1} character="liupiaopiao" />
                        </TabsContent>
                        <TabsContent value="role2">
                          <Chat role={2} character="yintianchou" />
                        </TabsContent>
                        <TabsContent value="role3">
                          <Chat role={3} character="cook" />
                        </TabsContent>
                        <TabsContent value="role4">
                          <Chat role={4} character="tang" />
                        </TabsContent>
                        <TabsContent value="role5">
                          <Chat role={5} character="wukong" />
                        </TabsContent>
                      </Tabs>
                    </div>
                    <div className="flex h-full flex-col items-center justify-center">
                      {locale == "en" ? (
                        <Image
                          src="/talk_to_me_en.png"
                          height={1986}
                          width={2721}
                          alt="friend"
                          priority
                          className="w-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/talk_to_me_cn.png"
                          height={2007}
                          width={2571}
                          alt="friend"
                          priority
                          className="w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          )}
        />
      )}

      {/* Mobile UI */}
      {(mediaSize?.width || 0) <= 1024 && isShowVideo && (
        <div className="fixed z-[200] h-screen w-screen backdrop-blur">
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
                    src="https://www.youtube.com/embed/K7KDMH6tyfk?rel=0"
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
          <div className="relative h-screen w-full">
            <Header />
            <Image
              src="/home_bg_mint_mobile_1.jpg"
              fill
              alt="mint"
              priority
              className="object-cover"
            />
            <div className="absolute bottom-[120px] z-10 flex w-full flex-col px-[15px]">
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
                  {t("nobody_nft_mv")}
                </span>
              </div>
              <div className="hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="text-[21px] font-semibold text-black">
                  {t("mint")}
                </span>
                {(countdown.days !== 0 ||
                  countdown.hours !== 0 ||
                  countdown.minutes !== 0 ||
                  countdown.seconds !== 0) && (
                  <span className="ml-[10px] text-[18px] font-semibold text-black">
                    {t("count_down", {
                      day: countdown.days,
                      hour: countdown.hours,
                      minute: countdown.minutes,
                      second: countdown.seconds,
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center bg-black py-[40px]">
            <div className="flex flex-col items-start">
              <div className="flex">
                <Image
                  src="/mint_progress_now.png"
                  height={108}
                  width={20}
                  alt="now"
                  priority
                />
                <div className="ml-[15px] flex flex-col justify-center">
                  <span className="text-[21px] font-semibold leading-[21px] text-[#FFD600]">
                    {t("presale")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-[#FFD600]">
                    {t("presale_time")}
                  </span>
                  {/* <div className="hover-btn-shadow mt-[20px] flex h-[40px]  w-[160px] items-center justify-center rounded-[18px] border-2 border-black bg-[#FFD600] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <span className="text-[16px] font-semibold text-black">
                      {t("join_waitlist")}
                    </span>
                  </div> */}
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
                    {t("public_sale")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-white">
                    {t("public_sale_time")}
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
                    {t("refund")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-white">
                    {t("refund_time")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex w-full flex-col px-[30px] py-[40px]">
            <Image src="/home_bg_mint_mobile_2.jpg" fill alt="mint" priority />
            {locale == "en" ? (
              <Image
                src="/nobody_friend_en.png"
                height={2262}
                width={1590}
                alt="friend"
                priority
                className="z-10 w-full object-cover"
              />
            ) : (
              <Image
                src="/nobody_friend_zh.png"
                height={1119}
                width={2259}
                alt="friend"
                priority
                className="z-10 w-full object-cover"
              />
            )}
            <Image
              src="/nobody_community.webp"
              height={360}
              width={360}
              alt="dao"
              priority
              className="z-10 mt-[40px] w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col bg-[#FFD600] pb-[60px] pt-[40px]">
            <span className="w-full text-center text-[48px] font-black leading-[48px] text-black">
              {t("talk_to_me")}
            </span>
            <div className="flex h-full flex-col items-start px-[16px] py-[30px]">
              <div className="flex w-full items-center justify-center rounded-[16px] border-2 border-black bg-[#FFD600] p-[25px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="w-full text-center text-[24px] font-bold leading-[30px] text-black">
                  {t("nobody_content_1")}
                </span>
              </div>
              <div className="mt-[20px] flex w-full items-center justify-center rounded-[16px] border-2 border-black bg-[#FFD600] p-[25px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="w-full text-center text-[24px] font-bold leading-[30px] text-black">
                  {t("nobody_content_2")}
                </span>
              </div>
              <div className="mt-[20px] flex w-full items-center justify-center rounded-[16px] border-2 border-black bg-[#FFD600] p-[25px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <span className="w-full text-center text-[24px] font-bold leading-[30px] text-black">
                  {t("nobody_content_3")}
                </span>
              </div>
            </div>
            <Tabs
              defaultValue="role1"
              className="grid h-[550px] w-full grid-rows-[100px,auto]"
              onValueChange={setRole}
            >
              <TabsList className="grid h-[100px] grid-cols-5  bg-[#FFD600]">
                <TabsTrigger
                  value="role1"
                  className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                >
                  <Image
                    src="/nobody_role_1.png"
                    height={100}
                    width={100}
                    alt="role1"
                    priority
                  />
                  {role === "role1" && (
                    <Image
                      className="z-10 w-full"
                      src="/nobody_role_indicator.png"
                      height={10}
                      width={100}
                      alt="indicator"
                      priority
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="role2"
                  className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                >
                  <Image
                    src="/nobody_role_2.png"
                    height={100}
                    width={100}
                    alt="role2"
                    priority
                  />
                  {role === "role2" && (
                    <Image
                      className="z-10 w-full"
                      src="/nobody_role_indicator.png"
                      height={10}
                      width={100}
                      alt="indicator"
                      priority
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="role3"
                  className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                >
                  <Image
                    src="/nobody_role_3.png"
                    height={100}
                    width={100}
                    alt="role3"
                    priority
                  />
                  {role === "role3" && (
                    <Image
                      className="z-10 w-full"
                      src="/nobody_role_indicator.png"
                      height={10}
                      width={100}
                      alt="indicator"
                      priority
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="role4"
                  className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                >
                  <Image
                    src="/nobody_role_4.png"
                    height={100}
                    width={100}
                    alt="role4"
                    priority
                  />
                  {role === "role4" && (
                    <Image
                      className="z-10 w-full"
                      src="/nobody_role_indicator.png"
                      height={10}
                      width={100}
                      alt="indicator"
                      priority
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="role5"
                  className="relative flex h-[100px] flex-col bg-[#FFD600] data-[state=active]:bg-[#FFD600]"
                >
                  <Image
                    src="/nobody_role_5.png"
                    height={100}
                    width={100}
                    alt="role5"
                    priority
                  />
                  {role === "role5" && (
                    <Image
                      className="z-10 w-full"
                      src="/nobody_role_indicator.png"
                      height={10}
                      width={100}
                      alt="indicator"
                      priority
                    />
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="role1">
                <Chat role={1} character="liupiaopiao" />
              </TabsContent>
              <TabsContent value="role2">
                <Chat role={2} character="yintianchou" />
              </TabsContent>
              <TabsContent value="role3">
                <Chat role={3} character="cook" />
              </TabsContent>
              <TabsContent value="role4">
                <Chat role={4} character="tang" />
              </TabsContent>
              <TabsContent value="role5">
                <Chat role={5} character="wukong" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
