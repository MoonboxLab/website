import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSize } from "ahooks";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { useRouter, usePathname } from "next-intl/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { Power, X, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import CustomConnectButton from "./CustomConnectWallet";
import { formatAddress } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { getPoint } from "@/service/point";

const Header: React.FC = () => {
  const mediaSize = useSize(document.querySelector("body"));
  const t = useTranslations("Home");
  const locale = useLocale();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const [accordionList, setAccordionList] = useState<string[]>([
    "language",
    "market",
  ]);

  const handleLocaleChange = (locale: String) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale });
    });
  };

  const [point, setPoint] = useState("--");

  const fetchPoint = useCallback(async () => {
    if (!address) return;
    const resp = await getPoint(address);
    if (resp.code === 200) {
      setPoint(resp.data.toString());
    }
  }, [address]);

  useEffect(() => {
    fetchPoint();
  }, [address, fetchPoint]);

  return (
    <header className="relative z-[100] flex w-full justify-between px-[12px] py-[8px] sm:z-[200] sm:px-[20px]">
      <Link href={"/"}>
        <div className=" relative ml-[0px]  h-[56px] w-[56px] sm:ml-[0px] lg:h-[80px] lg:w-[80px]">
          <Image
            src="/nobody_logo_yellow.png"
            alt="logo"
            priority={true}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>
      <div className="flex items-center">
        <Link href={"/declaration"} className=" hidden lg:block">
          <div className=" sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] min-w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white px-[24px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:min-w-[80px] 3xl:h-[48px] 3xl:min-w-[96px]">
            <span className=" ml-[6px] text-[16px]  font-semibold leading-[16px] text-black sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px]">
              {t("header_declaration")}
            </span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="sm:hover-btn-shadow ml-[10px] hidden h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:inline-flex sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px]">
              <span className=" ml-[6px] text-[16px]  font-semibold leading-[16px] text-black sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px]">
                {t("event")}
              </span>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 w-[235px] rounded-[12px] py-[14px]">
            <Link href={`/${locale}/bid`}>
              <DropdownMenuItem>
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <span className="text-[16px] font-medium leading-[16px]">
                    {t("bid")}
                  </span>
                </div>
              </DropdownMenuItem>
            </Link>
            <Link href={`/${locale}/talkshow`}>
              <DropdownMenuItem className="mt-2">
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <span className="text-[16px] font-medium leading-[16px]">
                    {t("talkshow")}
                  </span>
                </div>
              </DropdownMenuItem>
            </Link>
            <Link href={`/${locale}/auction`}>
              <DropdownMenuItem className="mt-2">
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <span className="text-[16px] font-medium leading-[16px]">
                    {t("show")}
                  </span>
                </div>
              </DropdownMenuItem>
            </Link>
            {/* <Link href={"/goldcard"}>
              <DropdownMenuItem className='mt-2'>
                <div className=' h-[25px] inline-flex items-center justify-between px-1'>
                  <span className='text-[16px] leading-[16px] font-medium'>{t("goldenCard")}</span>
                </div>
              </DropdownMenuItem>
            </Link> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <a
          href="https://blog.nobody.xyz"
          target="_blank"
          className=" hidden lg:block"
        >
          <div className=" sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] min-w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white px-[24px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:min-w-[80px] 3xl:h-[48px] 3xl:min-w-[96px]">
            <span className=" ml-[6px] text-[16px]  font-semibold leading-[16px] text-black sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px]">
              {t("header_blog")}
            </span>
          </div>
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=" sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px]">
              <span className=" ml-[6px] text-[16px]  font-semibold leading-[16px] text-black sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px]">
                OKX NFT
              </span>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 w-[165px] rounded-[12px] py-[14px]">
            <a
              href="https://www.okx.com/web3/marketplace/nft/collection/eth/nobody"
              target="_blank"
            >
              <DropdownMenuItem>
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <Image
                    src={"/OKX.png"}
                    priority={true}
                    quality={100}
                    alt="OKX NFT"
                    width={32}
                    height={32}
                  />
                  <span className="ml-[10px] text-[16px] font-medium leading-[16px]">
                    OKX NFT
                  </span>
                </div>
              </DropdownMenuItem>
            </a>

            <a
              href="https://opensea.io/collection/real-nobody-xyz"
              target="_blank"
            >
              <DropdownMenuItem className=" mt-2">
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <Image
                    src={"/OpenSea.png"}
                    priority={true}
                    quality={100}
                    alt="OKX NFT"
                    width={32}
                    height={32}
                  />
                  <span className="ml-[10px] text-[16px] font-medium  leading-[16px]">
                    OpenSea
                  </span>
                </div>
              </DropdownMenuItem>
            </a>

            <a href="https://element.market/collections/nobody" target="_blank">
              <DropdownMenuItem className=" mt-2">
                <div className=" inline-flex h-[25px] items-center justify-between px-1">
                  <Image
                    src={"/Element.png"}
                    priority={true}
                    quality={100}
                    alt="OKX NFT"
                    width={32}
                    height={32}
                  />
                  <span className="ml-[10px] text-[16px] font-medium leading-[16px]">
                    Element
                  </span>
                </div>
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>

        {(mediaSize?.width || 0) > 375 && (
          <a
            href="https://twitter.com/realnobodyxyz"
            target="_blank"
            className=" ml-[10px] sm:ml-4"
          >
            <div className=" sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px] 3xl:w-[48px]">
              <svg
                className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1458"
              >
                <path
                  d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"
                  p-id="1459"
                  fill="#000"
                ></path>
              </svg>
            </div>
          </a>
        )}

        {(mediaSize?.width || 0) > 375 && (
          <a
            href="https://www.instagram.com/realnobodyxyz/"
            target="_blank"
            className=" ml-[10px] sm:ml-4"
          >
            <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px]  3xl:w-[48px]">
              <svg
                className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2717"
              >
                <path
                  d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9z m0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zM725.5 250.7c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9c-0.1-26.6-21.4-47.9-47.9-47.9z"
                  p-id="2718"
                  fill="#000"
                ></path>
                <path
                  d="M911.8 512c0-55.2 0.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-0.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-0.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9 0.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165z m-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"
                  p-id="2719"
                  fill="#000000"
                ></path>
              </svg>
            </div>
          </a>
        )}

        {(mediaSize?.width || 0) > 375 && (
          <a
            href="https://discord.gg/nobodyxyz"
            target="_blank"
            className=" ml-[10px] sm:ml-4"
          >
            <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px]  3xl:w-[48px]">
              <svg
                className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                viewBox="0 0 1280 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5511"
              >
                <path
                  d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z"
                  p-id="5512"
                  fill="#000000"
                ></path>
              </svg>
            </div>
          </a>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" hidden lg:flex">
            <div className=" sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[80px] 3xl:h-[48px] 3xl:w-[96px]">
              <svg
                className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4000"
                width="64"
                height="64"
              >
                <path
                  d="M697.984 598.016l144 0q11.989333-56.021333 11.989333-86.016t-11.989333-86.016l-144 0q6.016 41.984 6.016 86.016t-6.016 86.016zM621.994667 834.005333q121.984-40.021333 185.984-152.021333l-125.994667 0q-20.010667 80-59.989333 152.021333zM612.010667 598.016q6.016-41.984 6.016-86.016t-6.016-86.016l-200.021333 0q-6.016 41.984-6.016 86.016t6.016 86.016l200.021333 0zM512 852.010667q56.021333-82.005333 82.005333-169.984l-164.010667 0q25.984 88.021333 82.005333 169.984zM342.016 342.016q20.010667-80 59.989333-152.021333-121.984 40.021333-185.984 152.021333l125.994667 0zM216.021333 681.984q64 112 185.984 152.021333-40.021333-72.021333-59.989333-152.021333l-125.994667 0zM182.016 598.016l144 0q-6.016-41.984-6.016-86.016t6.016-86.016l-144 0q-11.989333 56.021333-11.989333 86.016t11.989333 86.016zM512 171.989333q-56.021333 82.005333-82.005333 169.984l164.010667 0q-25.984-88.021333-82.005333-169.984zM808.021333 342.016q-64-112-185.984-152.021333 40.021333 72.021333 59.989333 152.021333l125.994667 0zM512 86.016q176 0 301.013333 125.013333t125.013333 301.013333-125.013333 301.013333-301.013333 125.013333-301.013333-125.013333-125.013333-301.013333 125.013333-301.013333 301.013333-125.013333z"
                  fill="#000000"
                  p-id="4001"
                ></path>
              </svg>
              <span className=" ml-[6px] text-[16px]  font-semibold leading-[16px] text-black sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px]">
                {t("header_language")}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 h-[110px] w-[160px] rounded-[12px] py-[14px]">
            <DropdownMenuItem onClick={() => handleLocaleChange("en")}>
              <div className=" inline-flex h-[25px] items-center justify-between px-3">
                <span className=" mr-[10px] text-[21px] font-semibold">En</span>
                <span className="text-[16px] font-medium leading-[16px]">
                  English
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLocaleChange("zh")}
              className=" mt-2"
            >
              <div className=" inline-flex h-[25px] items-center justify-between px-3">
                <span className=" mr-[10px] text-[21px] font-semibold">Zh</span>
                <span className="text-[16px] font-medium leading-[16px]">
                  繁體中文
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConnectButton.Custom>
          {({ account, chain, authenticationStatus, mounted }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");
            if (!connected) {
              return null;
            }
            return (
              <div className="sm:hover-btn-shadow ml-[10px] hidden h-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white px-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:flex lg:h-[40px] 3xl:h-[48px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0.00 0.00 96.00 102.00"
                  className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                >
                  <path
                    fill="#000"
                    d="
  M 7.04 57.25
  Q 6.66 63.43 6.88 69.75
  C 7.00 73.45 6.73 75.36 9.62 77.35
  Q 15.44 81.35 22.23 82.79
  Q 30.50 84.54 38.43 84.95
  Q 38.63 84.96 38.63 85.15
  L 38.63 91.07
  Q 38.63 91.34 38.35 91.36
  Q 30.95 91.64 20.57 89.36
  Q 11.84 87.45 5.27 82.45
  Q 0.27 78.64 0.34 72.17
  Q 0.40 67.35 0.43 18.77
  C 0.43 13.27 3.03 10.30 8.00 7.28
  Q 16.28 2.23 27.02 1.02
  Q 41.52 -0.62 54.21 1.58
  Q 58.95 2.41 64.75 4.80
  Q 72.19 7.86 75.87 12.86
  Q 77.30 14.79 77.32 18.25
  Q 77.40 31.43 77.32 37.66
  Q 77.31 38.29 76.68 38.29
  L 71.54 38.29
  A 0.75 0.75 0.0 0 1 70.79 37.54
  L 70.79 29.98
  Q 70.79 29.48 70.35 29.71
  Q 63.54 33.14 60.50 34.00
  Q 41.01 39.48 21.24 35.03
  Q 13.94 33.39 7.30 29.52
  A 0.25 0.25 0.0 0 0 6.93 29.73
  Q 6.77 37.83 6.88 45.27
  Q 6.91 47.26 8.40 49.04
  Q 9.40 50.25 12.37 52.02
  Q 16.81 54.67 23.99 55.81
  Q 33.61 57.35 38.23 57.82
  Q 38.68 57.87 38.68 58.33
  L 38.68 63.76
  A 0.38 0.37 -90.0 0 1 38.31 64.14
  Q 29.50 64.27 27.14 63.65
  Q 20.01 61.75 16.43 60.83
  Q 12.69 59.87 7.50 57.00
  Q 7.07 56.76 7.04 57.25
  Z
  M 70.33 18.56
  A 31.57 11.58 0.0 0 0 38.76 6.98
  A 31.57 11.58 0.0 0 0 7.19 18.56
  A 31.57 11.58 0.0 0 0 38.76 30.14
  A 31.57 11.58 0.0 0 0 70.33 18.56
  Z"
                  />
                  <path
                    fill="#000"
                    d="
  M 69.61 40.99
  C 78.79 40.97 88.41 42.11 94.50 49.69
  Q 95.81 51.32 95.66 55.81
  Q 95.59 57.87 95.62 71.35
  Q 95.64 84.84 95.72 86.90
  Q 95.88 91.39 94.58 93.02
  C 88.52 100.62 78.90 101.80 69.72 101.81
  C 60.54 101.83 50.92 100.69 44.83 93.11
  Q 43.52 91.48 43.67 86.99
  Q 43.74 84.93 43.72 71.45
  Q 43.69 57.96 43.61 55.90
  Q 43.45 51.41 44.75 49.78
  C 50.82 42.18 60.43 41.00 69.61 40.99
  Z
  M 88.77 53.96
  A 19.01 6.17 0.0 0 0 69.76 47.79
  A 19.01 6.17 0.0 0 0 50.75 53.96
  A 19.01 6.17 0.0 0 0 69.76 60.13
  A 19.01 6.17 0.0 0 0 88.77 53.96
  Z
  M 69.76 66.91
  Q 63.49 66.91 60.50 66.26
  Q 55.47 65.18 50.86 63.49
  A 0.41 0.40 10.8 0 0 50.31 63.86
  Q 50.30 64.90 50.26 70.75
  Q 50.25 72.16 50.89 72.66
  Q 56.43 76.93 63.50 77.26
  Q 67.81 77.46 69.77 77.46
  Q 71.72 77.46 76.03 77.25
  Q 83.10 76.91 88.64 72.63
  Q 89.28 72.13 89.26 70.72
  Q 89.22 64.87 89.20 63.83
  A 0.41 0.40 -10.8 0 0 88.65 63.46
  Q 84.05 65.16 79.02 66.25
  Q 76.03 66.90 69.76 66.91
  Z
  M 69.73 95.30
  C 76.20 95.30 82.35 94.40 87.71 90.72
  C 89.01 89.83 89.15 89.04 89.20 87.51
  Q 89.30 84.61 89.12 80.72
  A 0.32 0.32 0.0 0 0 88.57 80.52
  C 87.27 81.91 86.00 81.97 84.28 82.45
  C 79.58 83.76 74.64 84.67 69.74 84.66
  C 64.84 84.66 59.90 83.74 55.20 82.42
  C 53.48 81.93 52.21 81.87 50.92 80.48
  A 0.32 0.32 0.0 0 0 50.37 80.68
  Q 50.18 84.57 50.27 87.47
  C 50.32 89.00 50.46 89.79 51.75 90.68
  C 57.11 94.37 63.25 95.29 69.73 95.30
  Z"
                  />
                </svg>
                <span className="g:ml-[10px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] 3xl:text-[21px]">
                  {point}
                </span>
              </div>
            );
          }}
        </ConnectButton.Custom>
        <div className="drawer w-auto">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex lg:hidden">
            <label htmlFor="my-drawer" className="drawer-button">
              <div className="sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[48px]  lg:w-[48px]">
                <Image
                  className="h-[20px] w-[20px]"
                  width={24}
                  height={24}
                  src="/header_more_mobile.svg"
                  alt="more"
                />
              </div>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu min-h-full w-full overflow-y-scroll bg-white px-4">
              {/* Sidebar content here */}

              <div className=" mt-2 flex items-center justify-between">
                <div className=" inline-flex items-center justify-between">
                  <Image
                    src="/logo-header-mobile.png"
                    alt="logo"
                    priority={true}
                    width={48}
                    height={48}
                  />
                  <span className=" ml-2 text-[18px] font-semibold leading-[18px]">
                    {formatAddress(address, 4)}
                  </span>
                </div>

                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                >
                  <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:h-[48px] sm:w-[48px]  sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <X />
                  </div>
                </label>
              </div>

              <div className=" my-4 mt-8 border-b-[1px] border-gray-200"></div>
              <Link href={"/declaration"}>
                <div className=" my-4 mt-1 flex items-center justify-between text-[18px] font-semibold leading-[18px]  ">
                  {t("header_declaration")}
                  <ChevronRight width={18} height={18} />
                </div>
              </Link>

              <div className="my-4 mt-0 border-b-[1px] border-gray-200"></div>

              <Accordion
                type="single"
                collapsible
                defaultValue={"event"}
                className="w-full"
              >
                <AccordionItem value="event">
                  <AccordionTrigger className="text-[18px] font-semibold leading-[18px]  no-underline hover:no-underline">
                    {t("event")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Link href={`/${locale}/bid`}>
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        {t("bid")}
                      </div>
                    </Link>
                    <Link href={`/${locale}/talkshow`}>
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        {t("talkshow")}
                      </div>
                    </Link>
                    <Link href={`/${locale}/show`}>
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        {t("show")}
                      </div>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="my-4 mt-0 border-b-[1px] border-gray-200"></div>
              <a href="https://blog.nobody.xyz" target="_blank">
                <div className=" my-4 mt-1 flex justify-between text-[18px] font-semibold leading-[18px]  ">
                  {t("header_blog")}
                  <ChevronRight width={18} height={18} />
                </div>
              </a>
              <ConnectButton.Custom>
                {({ account, chain, authenticationStatus, mounted }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");
                  if (!connected) {
                    return null;
                  }
                  return (
                    <>
                      <div className=" my-1 border-b-[1px] border-gray-200"></div>
                      <div className="my-4 flex justify-between text-[18px] font-semibold leading-[18px]  ">
                        {t("point")}: {point}
                      </div>
                    </>
                  );
                }}
              </ConnectButton.Custom>
              <div className=" my-1 border-b-[1px] border-gray-200"></div>

              <Accordion
                type="multiple"
                value={accordionList}
                onValueChange={(list) => setAccordionList(list)}
                className="w-full"
              >
                <AccordionItem value="language">
                  <AccordionTrigger className=" text-[18px] font-semibold leading-[18px] no-underline hover:no-underline">
                    {t("header_languageNav")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      onClick={() => handleLocaleChange("en")}
                      className="py-3 text-[18px] font-semibold leading-[18px]"
                    >
                      English
                    </div>
                    <div
                      onClick={() => handleLocaleChange("zh")}
                      className="py-3 text-[18px] font-semibold leading-[18px]"
                    >
                      繁體中文
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="market">
                  <AccordionTrigger className="text-[18px] font-semibold leading-[18px]  no-underline hover:no-underline">
                    {t("header_nft_market")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <a
                      href="https://opensea.io/collection/real-nobody-xyz"
                      target="_blank"
                    >
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        OpenSea
                      </div>
                    </a>
                    <a
                      href="https://www.okx.com/web3/marketplace/nft/collection/eth/nobody"
                      target="_blank"
                    >
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        OKX NFT
                      </div>
                    </a>
                    <a
                      href="https://element.market/collections/nobody"
                      target="_blank"
                    >
                      <div className="py-3 text-[18px] font-semibold leading-[18px]">
                        Element
                      </div>
                    </a>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {(mediaSize?.width || 0) <= 375 && (
                <div className="mt-4 flex justify-around">
                  <a
                    href="https://twitter.com/realnobodyxyz"
                    target="_blank"
                    className=""
                  >
                    <div className=" sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px] 3xl:w-[48px]">
                      <svg
                        className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1458"
                      >
                        <path
                          d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"
                          p-id="1459"
                          fill="#000"
                        ></path>
                      </svg>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/realnobodyxyz/"
                    target="_blank"
                    className=""
                  >
                    <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px]  3xl:w-[48px]">
                      <svg
                        className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="2717"
                      >
                        <path
                          d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9z m0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zM725.5 250.7c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9c-0.1-26.6-21.4-47.9-47.9-47.9z"
                          p-id="2718"
                          fill="#000"
                        ></path>
                        <path
                          d="M911.8 512c0-55.2 0.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-0.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-0.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9 0.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165z m-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"
                          p-id="2719"
                          fill="#000000"
                        ></path>
                      </svg>
                    </div>
                  </a>

                  <a
                    href="https://discord.gg/nobodyxyz"
                    target="_blank"
                    className=""
                  >
                    <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[40px] 3xl:h-[48px]  3xl:w-[48px]">
                      <svg
                        className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                        viewBox="0 0 1280 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="5511"
                      >
                        <path
                          d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z"
                          p-id="5512"
                          fill="#000000"
                        ></path>
                      </svg>
                    </div>
                  </a>
                </div>
              )}

              <div className=" mt-12">
                <CustomConnectButton />
              </div>
            </ul>
          </div>
        </div>

        {/* {(mediaSize?.width || 0) < 1024 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="ml-[10px] sm:ml-4 inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[48px] lg:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]  sm:hover-btn-shadow">
                <Image className='w-[20px] h-[20px]' width={24} height={24} src="/header_more_mobile.svg" alt="more" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[300] -mt-[72px] h-auto w-screen rounded-[0px] px-[16px] py-[16px]">
              <DropdownMenuItem className="mb-[15px]">
                <div className="flex h-auto w-full items-end justify-end">
                  <div className="sm:hover-btn-shadow inline-flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:h-[48px] sm:w-[48px]  sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <X />
                  </div>
                </div>
              </DropdownMenuItem>
              <div className="text-[18px] leading-[30px] font-semibold">{formatAddress(address, 4)}</div>
              <Link href={"/declaration"} >
                <span className="text-center text-[18px] leading-[30px] hover-btn-shadow mt-[20px] flex h-[56px] w-full items-center justify-center rounded-[12px] border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] font-semibold">
                  {t('header_declaration')}
                </span>
              </Link>
              <CustomConnectButton />
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}

        {(mediaSize?.width || 0) >= 1024 && (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <div
                          className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[190px]"
                          onClick={openConnectModal}
                        >
                          <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px] 3xl:text-[21px]">
                            {t("header_connect_wallet")}
                          </span>
                        </div>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <div
                          className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[190px]"
                          onClick={openChainModal}
                        >
                          <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px] 3xl:text-[21px]">
                            {t("header_wrong_network")}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[190px]">
                            <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px] 3xl:text-[21px]">
                              {formatAddress(account.address, 4)}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-[10px] flex h-[60px] items-center rounded-[12px] lg:w-[160px] 3xl:w-[190px]">
                          <DropdownMenuItem
                            className="w-full p-[10px] 3xl:p-[20px]"
                            onClick={() => disconnect()}
                          >
                            <Power className=" mr-2 text-black" />
                            <span className="w-full text-center text-[16px] font-medium leading-[18px] 3xl:text-[18px]">
                              {t("disconnect")}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        )}
      </div>
    </header>
  );
};

export default Header;
