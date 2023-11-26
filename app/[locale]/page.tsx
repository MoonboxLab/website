"use client";
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import "core-js/features/object/has-own";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import FirstSection from "./home_section";
import "@shinyongjun/react-fullpage/css";
import { Separator } from "@/components/ui/separator";
import AuctionItem from "@/components/AuctionItem";
import AddressItem from "@/components/AddressItem";
import { ChevronDown } from "lucide-react";
import { useSize } from "ahooks";
import { Transition } from "@headlessui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  const t = useTranslations("Home");

  const mediaSize = useSize(document.querySelector("body"));

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [playingMedia, setPlayingMedia] = useState<boolean>(false);

  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const auctionData = [{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"Lova and peace\"", owned: "0x4a…5635" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "0x4a…5635" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "0x4a…5635" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" },{ name: "阿星", image: "/auction_item_image.png", catchphrase: "\"你想学吗？我教你啊\"", owned: "" }]; //prettier-ignore

  const addressData = [{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"},{ address: "0x4a0be38a0ac7039ed6e3823abf33f367911b5635", value: "32.5"}] //prettier-ignore
  // const addressData = undefined

  const [auctionItemExpand, setAuctionItemExpand] = useState<boolean>(false);

  const [isScrollUp, setIsScrollUp] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({
      top: chatListBottomRef.current?.scrollHeight,
      behavior: "smooth",
    });
    // auction items expand on PC
    if ((mediaSize?.width || 0) > 640) {
      setAuctionItemExpand(true);
    }
    // show or hide bottom button
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingUp = currentScrollPos < prevScrollPos;

      setIsScrollUp(isScrollingUp);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [chatListBottomRef.current?.scrollHeight, prevScrollPos]);

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

      <FirstSection
        playingMedia={playingMedia}
        setPlayingMedia={setPlayingMedia}
        showChatModal={showChatModal}
        setShowChatModal={setShowChatModal}
      />

      <div className="relative flex h-auto w-full flex-col bg-[#151515] bg-contain bg-[80%_80%]">
        <div className="relative w-full">
          <div className="flex flex-col items-center px-[25px] py-[80px] sm:py-[160px]">
            <span className="z-10 text-[30px] font-bold leading-[30px] text-white xl:text-[36px] xl:leading-[36px] 4xl:text-[48px] 4xl:leading-[48px]">
              {t("about_nobody")}
            </span>
            <span className="z-10 mt-[30px] max-w-[732px] text-center text-[21px] font-medium leading-[30px] text-white xl:text-[24px] xl:leading-[36px] 4xl:max-w-[966px] 4xl:text-[30px] 4xl:leading-[48px]">
              {t("team_welcome")}
            </span>
            <span className="z-10 mt-[30px] max-w-[732px] text-center text-[21px] font-medium leading-[30px] text-white xl:text-[24px] xl:leading-[36px] 4xl:max-w-[966px] 4xl:text-[30px] 4xl:leading-[48px]">
              {t("team_introduce")}
            </span>
          </div>
          <Image
            className="absolute right-0 top-0 h-[150px] w-[190px] sm:h-auto sm:w-[36%] xl:h-[365px] xl:w-[465px]"
            src={"/home_auction_bg_2.webp"}
            alt="home_auction_bg_2"
            width={465}
            height={365}
            priority
          />
          <Image
            className="absolute bottom-0 left-0 h-[185px] w-[243px] sm:h-auto sm:w-[33%] xl:h-[431px] xl:w-[566px]"
            src={"/home_auction_bg_3.webp"}
            alt="home_auction_bg_3"
            width={566}
            height={431}
            priority
          />
          <Image
            className="absolute bottom-[20px] right-[20px] h-[56px] w-[56px] sm:bottom-[5%] sm:right-[10%] sm:h-[112px] sm:w-[112px]"
            src={"/home_auction_bg_4.webp"}
            alt="home_auction_bg_4"
            width={112}
            height={112}
            priority
          />
        </div>
        <Separator className="bg-gray-800" />
        <div className="flex w-full max-w-[1920px] flex-col items-center py-[60px] sm:py-[160px]">
          <span className="text-[30px] font-bold leading-[30px] text-white xl:text-[36px] xl:leading-[36px] 4xl:text-[48px] 4xl:leading-[48px]">
            {t("auction_schedule")}
          </span>
          <div className="relative mt-[40px] flex flex-col justify-between px-[30px] sm:mt-[80px] sm:w-full sm:flex-row sm:px-[30px] xl:px-[50px] 3xl:px-[110px]">
            <div className="absolute left-[40px] top-0 h-full border-r-2 border-dashed border-gray-400 sm:hidden" />
            <div className="relative flex flex-col pb-[15px] pl-[40px] sm:pb-0 sm:pl-0">
              <span className="text-[21px] font-medium leading-[21px] text-gray-600 xl:text-[24px] xl:leading-[40px] 4xl:text-[30px] 4xl:leading-[50px]">
                {t("invite_registration")}
              </span>
              <span className="mt-[10px] text-[16px] leading-[16px] text-gray-600 sm:mt-0 xl:text-[18px] xl:leading-[34px] 4xl:text-[21px] 4xl:leading-[50px]">
                12/15-12/30 24:00
              </span>
              <Image
                className="absolute left-[4px] top-[25px] sm:hidden"
                width={14}
                height={14}
                src="/auction_schedule_past.svg"
                alt="auction_schedule_past"
              />
            </div>
            <Image
              className="hidden sm:block"
              width={51}
              height={17}
              src="/schedule_arrow.svg"
              alt="next"
            />
            <div className="relative flex flex-col py-[15px] pl-[40px] sm:py-0 sm:pl-0">
              <span className="text-[21px] font-medium leading-[21px] text-yellow-300 xl:text-[24px] xl:leading-[40px] 4xl:text-[30px] 4xl:leading-[50px]">
                {t("auction_stage")}
              </span>
              <span className="mt-[10px] text-left text-[16px] leading-[16px] text-yellow-300 sm:mt-0 xl:text-[18px] xl:leading-[34px] 4xl:text-[21px] 4xl:leading-[50px]">
                1/5-1/20 24:00
              </span>
              <Image
                className="absolute left-[4px] top-[35px] sm:hidden"
                width={14}
                height={14}
                src="/auction_schedule_now.svg"
                alt="auction_schedule_now"
              />
            </div>
            <Image
              className="hidden sm:block"
              width={51}
              height={17}
              src="/schedule_arrow.svg"
              alt="next"
            />
            <div className="relative flex flex-col py-[15px] pl-[40px] sm:py-0 sm:pl-0">
              <span className="text-[21px] font-medium leading-[21px] text-white xl:text-[24px] xl:leading-[40px] 4xl:text-[30px] 4xl:leading-[50px]">
                {t("announce_address")}
              </span>
              <span className="mt-[10px] text-left text-[16px] leading-[16px] text-white sm:mt-0 xl:text-[18px] xl:leading-[34px] 4xl:text-[21px] 4xl:leading-[50px]">
                1/5-1/20 24:00
              </span>
              <Image
                className="absolute left-[4px] top-[35px] sm:hidden"
                width={14}
                height={14}
                src="/auction_schedule_future.svg"
                alt="auction_schedule_future"
              />
            </div>
            <Image
              className="hidden sm:block"
              width={51}
              height={17}
              src="/schedule_arrow.svg"
              alt="next"
            />
            <div className="relative flex flex-col py-[15px] pl-[40px] sm:py-0 sm:pl-0">
              <span className="text-[21px] font-medium leading-[21px] text-white xl:text-[24px] xl:leading-[40px] 4xl:text-[30px] 4xl:leading-[50px]">
                {t("nft_distribution_refunds")}
              </span>
              <span className="mt-[10px] text-left text-[16px] leading-[16px] text-white sm:mt-0 xl:text-[18px] xl:leading-[34px] 4xl:text-[21px] 4xl:leading-[50px]">
                1/5-1/20 24:00
              </span>
              <Image
                className="absolute left-[4px] top-[35px] sm:hidden"
                width={14}
                height={14}
                src="/auction_schedule_future.svg"
                alt="auction_schedule_future"
              />
            </div>
          </div>
        </div>
        <Separator className="bg-gray-800" />
        <div className="flex w-full flex-col items-center px-[12px] py-[60px] sm:py-[160px] xl:px-[30px] 3xl:px-[40px] 4xl:px-[100px]">
          <span className="text-[30px] font-bold leading-[30px] text-white xl:text-[36px] xl:leading-[36px] 4xl:text-[48px] 4xl:leading-[48px]">
            {t("auction_appreciate")}
          </span>
          <div className="mt-[40px] grid w-full grid-cols-2 gap-[12px] sm:mt-[80px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-[16px] 3xl:grid-cols-5 3xl:gap-[25px] 4xl:grid-cols-6 4xl:gap-[30px]">
            {auctionItemExpand &&
              auctionData.map((item, index) => (
                <AuctionItem
                  key={index}
                  image={item.image}
                  name={item.name}
                  catchphrase={item.catchphrase}
                  owned={item.owned}
                />
              ))}
            {!auctionItemExpand &&
              auctionData
                .slice(0, 6)
                .map((item, index) => (
                  <AuctionItem
                    key={index}
                    image={item.image}
                    name={item.name}
                    catchphrase={item.catchphrase}
                    owned={item.owned}
                  />
                ))}
          </div>
          {!auctionItemExpand && (
            <div
              className="mt-[20px] flex h-[48px] w-full items-center justify-center rounded-[12px] bg-white sm:hidden"
              onClick={() => {
                setAuctionItemExpand(true);
              }}
            >
              <span className="text-[16px] font-semibold leading-[16px] text-black">
                Load more
              </span>
              <ChevronDown className="ml-[5px] h-full pt-[5px]" />
            </div>
          )}
        </div>
        <div className="relative flex w-full flex-col items-center">
          <Separator className="bg-gray-800" />
          <Image
            className="absolute right-[12px] h-[243px] w-[147px] sm:-bottom-[120px] sm:right-[25px] sm:h-[460px] sm:w-[280px]"
            src={"/home_auction_bg_5.png"}
            alt="home_auction_bg_5"
            width={280}
            height={460}
            priority
          />
        </div>
        {!addressData && (
          <div className="relative my-[60px] h-[190px] w-full px-[12px] sm:m-0 sm:h-[720px] sm:px-[100px] sm:py-[160px]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white bg-opacity-10">
              <span className="text-[30px] text-white opacity-30 sm:text-[60px]">
                {t("auctioned_address")}
              </span>
            </div>
          </div>
        )}
        {addressData && (
          <div className="my-[60px] h-[735px] w-full px-[12px] sm:m-0 sm:h-[1086px] sm:px-[100px] sm:py-[160px]">
            <div className="flex h-full w-full justify-center">
              <video
                className="hidden h-full w-fit xl:block"
                autoPlay
                loop
                muted
                playsInline
                src="/home_auction_bg_6.mp4"
              />

              <div className="flex flex-col items-center">
                <span className="h-min w-full text-center text-[30px] font-bold leading-[30px] text-white xl:text-[36px] xl:leading-[36px] 4xl:text-[48px] 4xl:leading-[48px]">
                  {t("auctioned_address")}
                </span>
                <div className="mt-[40px] flex flex-col sm:mt-[60px]">
                  {addressData.slice(0, 10).map((item, index) => (
                    <AddressItem
                      key={index}
                      address={item.address}
                      value={item.value}
                      index={index + 1}
                      all={false}
                    />
                  ))}
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="mt-[25px] text-[16px] font-semibold text-white underline">
                        {t("view_all")}
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85%] max-w-[375px] overflow-scroll rounded-xl p-[12px] sm:max-h-[690px] sm:max-w-[620px] sm:p-[30px]">
                      <DialogHeader>
                        <DialogTitle className="text-left text-[21px]">
                          {t("auctioned_address")}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center">
                        {addressData.map((item, index) => (
                          <AddressItem
                            key={index}
                            address={item.address}
                            value={item.value}
                            index={index + 1}
                            all={true}
                          />
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        )}
        <Separator className="bg-gray-800" />
        <div className="flex w-full flex-col items-center justify-center py-[60px] sm:py-[80px]">
          <div className="flex">
            <a
              href="https://twitter.com/therealmoonbox"
              target="_blank"
              className=" ml-[10px] sm:ml-4"
            >
              <div className=" hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:h-[48px] sm:w-[48px] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg
                  className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1458"
                >
                  <path
                    d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-140.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"
                    p-id="1459"
                    fill="#000"
                  />
                </svg>
              </div>
            </a>
            <a
              href="https://www.instagram.com/therealmoonbox"
              target="_blank"
              className=" ml-[10px] sm:ml-4"
            >
              <div className="hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:h-[48px] sm:w-[48px]  sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg
                  className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2717"
                >
                  <path
                    d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9z m0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zM725.5 250.7c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9c-0.1-26.6-21.4-47.9-47.9-47.9z"
                    p-id="2718"
                    fill="#000"
                  />
                  <path
                    d="M911.8 512c0-55.2 0.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-0.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-0.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9 0.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165z m-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"
                    p-id="2719"
                    fill="#000000"
                  />
                </svg>
              </div>
            </a>
            <a
              href="https://discord.gg/therealmoonbox"
              target="_blank"
              className="ml-[10px] sm:ml-4"
            >
              <div className="hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:h-[48px] sm:w-[48px]  sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <svg
                  className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
                  viewBox="0 0 1280 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5511"
                >
                  <path
                    d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z"
                    p-id="5512"
                    fill="#000000"
                  />
                </svg>
              </div>
            </a>
          </div>
          <span className="mt-[40px] text-[16px] leading-[16px] text-gray-400 sm:text-[18px] sm:leading-[18px]">
            @therealmoonbox
          </span>
          <span className="mt-[12px] text-[14px] leading-[14px] text-gray-400 sm:text-[16px] sm:leading-[16px]">
            ©2023 moonbox ALL RIGHTS RESERVED
          </span>
        </div>
      </div>

      {/* Mobile floating button */}
      <Transition
        className="fixed bottom-[5%] z-20 flex w-full justify-center sm:hidden"
        show={isScrollUp}
        enter="transition duration-300 ease-out"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition duration-200 ease-in"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
      >
        <div className="w-full px-[16px]">
          <div
            className="mb-[10px] flex h-[56px] w-full cursor-pointer items-center rounded-[12px] border-[2px] border-black bg-white px-[14px] shadow-[4px_4px_0px_#000000FF]"
            onClick={() => setShowChatModal(true)}
          >
            <Image
              src={"/home_auction.png"}
              alt="chat avatar"
              width={50}
              height={65}
            />
            <span className="ml-[10px] text-[18px] font-semibold leading-[48px]">
              {t("participate_auction")}
            </span>
          </div>
          <div
            className="flex h-[56px] w-full cursor-pointer items-center rounded-[12px] border-[2px] border-black bg-white py-[14px] pl-[20px] shadow-[4px_4px_0px_#000000FF]"
            // onClick={() => setShowMainModal(true)}
          >
            <div className=" inline-flex h-[28px] w-[40px] items-center justify-center rounded-full">
              <Image
                src={"/email_icon.png"}
                alt="email"
                width="40"
                height="28"
              />
            </div>
            <span className="ml-[13px] text-[18px] font-semibold leading-[18px]">
              {t("mobile_email_btn")}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  );
}
