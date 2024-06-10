"use client";

import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useCountDown, useSize } from "ahooks";
import "core-js/features/object/has-own";
import ReactFullpage from "@fullpage/react-fullpage";

import Chat from "@/components/Chat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { MINT_START_TIME, RAFFLE_END_TIME, REFUND_END_TIME } from "@/constants/nobody_contract";
import clsx from "clsx";

export default function Home() {
  const t = useTranslations("Home");

  const mediaSize = useSize(document.querySelector("body"));

  const [role, setRole] = useState<string>("role2");

  const [video, setVideo] = useState<string>("");

  const [isShowVideo, setIsShowVideo] = useState<boolean>(false);

  const locale = useLocale();

  const [mintStartCountdown] = useCountDown({ targetDate: MINT_START_TIME })
  const [raffleEndTime] = useCountDown({ targetDate: RAFFLE_END_TIME })
  const [refundEndTime] = useCountDown({ targetDate: REFUND_END_TIME })

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
        <meta property="og:image" content="/twitter_cover.jpg" />
        <meta property="og:url" content="https://nobody.xyz" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="/twitter_cover.jpg"
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
          scrollOverflow={true}
          render={({ fullpageApi }) => (
            <ReactFullpage.Wrapper>
              <div className="section h-screen w-screen" onWheel={() => {
                fullpageApi.setAllowScrolling(true)
              }}>
                <div className="relative h-screen w-full bg-white">
                  <Header />
                  <Image
                    src="/home_bg_mint_1.png"
                    fill
                    alt="mint"
                    priority
                    className="object-cover"
                  />
                  {/* <div className="absolute bottom-[108px] right-[20px] w-[200px] h-[250px] 4xl:bottom-[140px] 4xl:right-[30px] rounded-[16px] border-2 border-black bg-[rgba(219,53,57,1)] pl-[5px] ">
                    <Image src={"/card-back.png"} alt="card back" quality={100} width={90} height={119} className=" absolute top-[23px] left-[29px]" />
                    <Image src={"/card-front.png"} alt="card front" quality={100} width={106} height={128} className=" absolute top-[46px] right-[25px]" />

                    <Image src={"/form_icon1.png"} alt="icon1" width={122} height={130} className=" absolute top-[-12px] left-[-26px]" />
                    <Image src={"/form_icon2.png"} alt="icon2" width={117} height={130} className=" absolute top-[-12px] right-[-28px]" />

                    <Link href={"/goldcard"}>
                      <div className=" absolute left-0 right-0 m-auto bottom-[20px] w-[160px] h-[40px] rounded-[8px] bg-white text-[16px] font-semibold leading-[40px] text-center">{t("goldcardRaffle")}</div>
                    </Link>
                  </div> */}
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
              <div className="section h-screen w-screen" onWheel={() => {
                fullpageApi.setAllowScrolling(true)
              }}>
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
              <div className="section h-screen w-screen" onWheel={() => {
                fullpageApi.setAllowScrolling(true)
              }}>
                <div className="flex h-screen w-full items-center justify-center bg-[#FFD600] px-[0px] pb-[128px] pt-[60px] 4xl:px-[10px] 4xl:pb-[175px] 4xl:pt-[50px] 5xl:pt-[100px]">
                  <div className=" grow w-auto h-auto my-auto mx-[110px] 4xl:mx-[120px]  border-[2px] border-black rounded-[32px] shadow-[4px_4px_0px_rgba(0,0,0,1)] flex pb-[67px] items-center">
                    <div className=" relative lg:w-[450px] lg:h-[450px] 2xl:w-[550px] 2xl:h-[550px] 3xl:w-[603px] 3xl:h-[600px] 4xl:w-[703px] 4xl:h-[700px]">
                      <Image src={"/phone_example_ui.png"} alt="" fill quality={100} />
                    </div>
                    <div className=" ml-[-130px] mt-[100px] relative z-30">
                      <h2 className={clsx(
                      {"text-[48px] font-bold leading-[48px] 2xl:text-[56px] 2xl:leading-[56px] 3xl:text-[80px] 3xl:leading-[90px]": locale == 'zh'},
                      {"font-impact  text-[48px] font-normal leading-[48px] 2xl:text-[56px] 2xl:leading-[56px] 3xl:text-[96px] 3xl:leading-[90px]": locale == 'en'}
                      )} >
                        {t("appTitle")}
                      </h2>
                      <p className="  lg:text-[20px] lg:leading-[24px] 2xl:text-[26px] 2xl:leading-[32px] font-bold 3xl:text-[30px] 3xl:leading-[40px] max-w-[547px] mb-[45px] mt-[30px] 4xl:mb-[60px] 4xl:mt-[40px]">
                        {t.rich("appSubtitle", { br: () => <br /> })}
                      </p>
                      <div className=" text-white flex ">
                        <a href="https://apps.apple.com/us/app/nobody-ai/id6473243933?platform=iphone" target="_blank">
                          <div className=" flex min-w-fit bg-black h-[80px] rounded-[12px] px-[20px] py-[16px] cursor-pointer" >
                            <Image src={"/app_store_logo.png"} alt="app store logo" width={39} height={48} quality={100} />
                            <div className=" ml-[14px]" >
                              <p className=" text-[18px] font-medium leading-[18px]">Download on the</p>
                              <p className=" text-[24px] font-bold leading-[24px] mt-[6px]">App Store</p>
                            </div>
                          </div>
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.moonbox.app" target="_blank">
                          <div className=" flex min-w-fit bg-black h-[80px] rounded-[12px] px-[20px] py-[16px] cursor-pointer ml-[20px]" >
                            <Image src={"/google_play_logo.png"} alt="app store logo" width={43} height={48} quality={100} />
                            <div className=" ml-[12px]" >
                              <p className=" text-[18px] font-medium leading-[18px]">Get it on</p>
                              <p className=" text-[24px] font-bold leading-[24px] mt-[6px]">Google Play</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className=" absolute w-0 h-0 3xl:w-[515px] 3xl:h-[640px] 4xl:w-[731px] 4xl:h-[885px] right-0 bottom-[78px] 4xl:bottom-[110px]">
                    <Image src={"/sun.png"} alt="" fill style={{ objectFit: 'contain' }} />
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
          <div className="relative h-auto w-full">
            <div className="absolute top-0 w-full">
              <Header />
            </div>
            <Image
              src="/home_bg_mint_mobile_1.jpg"
              width={1080}
              height={1920}
              alt="mint"
              priority
              className="w-full object-contain"
            />
            <div className="absolute bottom-[15%] z-10 flex w-full flex-col px-[15px]">
              {/* <div
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
              </div> */}
{/* 
              <Link href={"/goldcard"}>
                <div className="hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
                  <span className="text-[21px] font-semibold text-[rgba(219,53,57,1)] underline">
                    {t("goldcardRaffle")}
                  </span>
                  <Image src="/mobile_goldcard_btn_icon1.png" alt="icon1" width={40} height={26} className=" absolute left-[58px] top-[16px]" />
                  <Image src="/mobile_goldcard_btn_icon2.png" alt="icon1" width={86} height={28} className=" absolute right-[18px] top-[14px]" />
                </div>
              </Link> */}

              {
                mintStartCountdown <= 0 &&
                <Link href={"/mint"}>
                  <div className="hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-[#FFD600] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <span className="text-[21px] font-semibold text-black">
                      {t("mint")}
                    </span>
                  </div>
                </Link>
              }

            </div>
          </div>
          <div className="flex w-full justify-center bg-black py-[40px]">
            <div className="flex flex-col items-start">
              <div className="flex">
                <Image
                  src="/mint_progress_next.png"
                  height={108}
                  width={20}
                  alt="now"
                  priority
                />
                <div className="ml-[15px] flex flex-col justify-center">
                  <span className="text-[21px] font-semibold leading-[21px] text-white">
                    {t("presale")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] text-white">
                    {t("presale_time")}
                  </span>
                </div>
              </div>
              <div className="mt-[40px] flex">
                <Image
                  src={raffleEndTime > 0 ? "/mint_progress_now.png" : "/mint_progress_next.png"}
                  height={48}
                  width={20}
                  alt="next"
                  priority
                />
                <div className={clsx("ml-[15px] flex flex-col justify-center", raffleEndTime > 0 ? "text-[#FFD600]" : "text-white")}>
                  <span className="text-[21px] font-semibold leading-[21px] ">
                    {t("public_sale")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] ">
                    {t("public_sale_time")}
                  </span>
                </div>
              </div>
              <div className="mt-[40px] flex">
                <Image
                  src={(raffleEndTime == 0 && refundEndTime > 0) ? "/mint_progress_now.png" : "/mint_progress_next.png"}
                  height={48}
                  width={20}
                  alt="next"
                  priority
                />
                <div className={clsx("ml-[15px] flex flex-col justify-center", (raffleEndTime == 0 && refundEndTime > 0) ? "text-[#FFD600]" : "text-white")}>
                  <span className="text-[21px] font-semibold leading-[21px] ">
                    {t("refund")}
                  </span>
                  <span className="text-[16px] font-semibold leading-[21px] ">
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
          <div className=" w-full bg-[#FFD600] pb-[60px] pt-[40px]">
            <div className="flex justify-center overflow-hidden">
              <div className=" relative h-[500px] w-[500px] sm:h-[800px] sm:w-[800px] mr-[-80px]">
                <Image src={"/phone_example_ui.png"} alt="" fill style={{ objectFit: "contain" }} />
              </div>
            </div>
            <h2 className=" font-impact text-center text-[60px] font-normal leading-[60px] mt-[60px] mb-[20px]">{t("appTitle")}</h2>
            <p className=" text-[24px] font-bold leading-[36px] mx-[20px] text-center">{t.rich("appSubtitle", { br: () => <br /> })}</p>

            {
              (mediaSize?.width || 0) <= 420 ?
                <div className=" text-white mx-[30px] mt-[60px] mb-[40px]">
                  <a href="https://apps.apple.com/us/app/nobody-ai/id6473243933?platform=iphone" target="_blank">
                    <div className=" flex min-w-fit bg-black h-[64px] rounded-[12px] px-[12px] py-[12px] cursor-pointer w-[200px] mx-auto" >
                      <Image src={"/app_store_logo.png"} alt="app store logo" width={30} height={36} quality={100} />

                      <div className=" ml-[14px]" >
                        <p className=" text-[14px] font-medium leading-[14px]">Download on the</p>
                        <p className=" text-[18px] font-bold leading-[18px] mt-[6px]">App Store</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.moonbox.app" target="_blank">
                    <div className=" flex min-w-fit bg-black h-[64px] rounded-[12px] px-[12px] py-[12px] cursor-pointer mt-[20px] w-[200px] mx-auto" >
                      <Image src={"/google_play_logo.png"} alt="app store logo" width={33} height={36} quality={100} />
                      <div className=" ml-[10px]" >
                        <p className=" text-[14px] font-medium leading-[14px]">Get it on</p>
                        <p className=" text-[18px] font-bold leading-[18px] mt-[6px]">Google Play</p>
                      </div>
                    </div>
                  </a>
                </div> :
                <div className={clsx(
                  "text-white flex  mt-[60px] mb-[40px] mx-[22px] justify-center",
                )}>
                  <a href="https://apps.apple.com/us/app/nobody-ai/id6473243933?platform=iphone" target="_blank">
                    <div className=" flex min-w-fit bg-black h-[64px] rounded-[12px] px-[12px] py-[12px] cursor-pointer" >
                      <Image src={"/app_store_logo.png"} alt="app store logo" width={30} height={36} quality={100} />
                      <div className=" ml-[14px]" >
                        <p className=" text-[14px] font-medium leading-[14px]">Download on the</p>
                        <p className=" text-[18px] font-bold leading-[18px] mt-[6px]">App Store</p>
                      </div>
                    </div>
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.moonbox.app" target="_blank">
                    <div className=" flex min-w-fit bg-black h-[64px] rounded-[12px] px-[12px] py-[12px] cursor-pointer ml-[20px]" >
                      <Image src={"/google_play_logo.png"} alt="app store logo" width={33} height={36} quality={100} />
                      <div className=" ml-[10px]" >
                        <p className=" text-[14px] font-medium leading-[14px]">Get it on</p>
                        <p className=" text-[18px] font-bold leading-[18px] mt-[6px]">Google Play</p>
                      </div>
                    </div>
                  </a>
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
