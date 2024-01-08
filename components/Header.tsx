import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSize } from "ahooks";
import { useTranslations } from "next-intl";
import { track } from '@vercel/analytics';
import { useRouter, usePathname } from 'next-intl/client'
import { useTransition } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { Power, X } from "lucide-react";
import Link from "next/link";
import CustomConnectButton from "./CustomConnectWallet";

const Header: React.FC = () => {
  const mediaSize = useSize(document.querySelector('body'));
  const t = useTranslations('Home');

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const { disconnect } = useDisconnect();

  const handleLocaleChange = (locale: String) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale });
    });
  };

  return (
    <header className="relative z-[100] py-[15px] flex w-full justify-between px-[20px] sm:z-[200] 4xl:py-[20px]">
      <Link href={"/"} >
        <div className=" relative ml-[10px]  h-[56px] w-[56px] sm:ml-[20px] lg:h-[80px] lg:w-[80px]">
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
        <Link href={"/declaration"} className=" hidden lg:block" >
          <div className=' inline-flex items-center justify-center h-[36px] min-w-[84px] lg:h-[40px] lg:min-w-[80px] 3xl:h-[48px] 3xl:min-w-[96px] px-[24px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-[10px] sm:ml-4 sm:hover-btn-shadow'>
            <span className=' text-[16px] leading-[16px]  sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px] font-semibold text-black ml-[6px]'>{t('header_declaration')}</span>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=' inline-flex items-center justify-center h-[36px] w-[84px] lg:h-[40px] lg:w-[80px] 3xl:h-[48px] 3xl:w-[96px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-[10px] sm:ml-4 sm:hover-btn-shadow'>
              <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4000" width="64" height="64"><path d="M697.984 598.016l144 0q11.989333-56.021333 11.989333-86.016t-11.989333-86.016l-144 0q6.016 41.984 6.016 86.016t-6.016 86.016zM621.994667 834.005333q121.984-40.021333 185.984-152.021333l-125.994667 0q-20.010667 80-59.989333 152.021333zM612.010667 598.016q6.016-41.984 6.016-86.016t-6.016-86.016l-200.021333 0q-6.016 41.984-6.016 86.016t6.016 86.016l200.021333 0zM512 852.010667q56.021333-82.005333 82.005333-169.984l-164.010667 0q25.984 88.021333 82.005333 169.984zM342.016 342.016q20.010667-80 59.989333-152.021333-121.984 40.021333-185.984 152.021333l125.994667 0zM216.021333 681.984q64 112 185.984 152.021333-40.021333-72.021333-59.989333-152.021333l-125.994667 0zM182.016 598.016l144 0q-6.016-41.984-6.016-86.016t6.016-86.016l-144 0q-11.989333 56.021333-11.989333 86.016t11.989333 86.016zM512 171.989333q-56.021333 82.005333-82.005333 169.984l164.010667 0q-25.984-88.021333-82.005333-169.984zM808.021333 342.016q-64-112-185.984-152.021333 40.021333 72.021333 59.989333 152.021333l125.994667 0zM512 86.016q176 0 301.013333 125.013333t125.013333 301.013333-125.013333 301.013333-301.013333 125.013333-301.013333-125.013333-125.013333-301.013333 125.013333-301.013333 301.013333-125.013333z" fill="#000000" p-id="4001"></path></svg>
              <span className=' text-[16px] leading-[16px]  sm:text-[18px] sm:leading-[18px] 3xl:text-[21px] 3xl:leading-[21px] font-semibold text-black ml-[6px]'>{t('header_language')}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mt-2 w-[160px] h-[110px] rounded-[12px] py-[14px]'>
            <DropdownMenuItem onClick={() => handleLocaleChange('en')} >
              <div className=' h-[25px] inline-flex items-center justify-between px-3'>
                <span className=' text-[21px] font-semibold mr-[10px]'>En</span>
                <span className=' text-[18px] leading-[18px] font-medium'>English</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLocaleChange('zh')} className=' mt-2'>
              <div className=' h-[25px] inline-flex items-center justify-between px-3'>
                <span className=' text-[21px] font-semibold mr-[10px]'>Zh</span>
                <span className=' text-[18px] leading-[18px] font-medium'>繁體中文</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <a href='https://twitter.com/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
          <div className=' inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[40px] lg:w-[40px] 3xl:h-[48px] 3xl:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:hover-btn-shadow'>
            <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1458" ><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" p-id="1459" fill="#000"></path></svg>
          </div>
        </a>

        <a href='https://www.instagram.com/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
          <div className='inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[40px] lg:w-[40px] 3xl:h-[48px] 3xl:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]  sm:hover-btn-shadow'>
            <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2717" ><path d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9z m0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zM725.5 250.7c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9c-0.1-26.6-21.4-47.9-47.9-47.9z" p-id="2718" fill="#000"></path><path d="M911.8 512c0-55.2 0.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-0.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-0.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9 0.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165z m-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z" p-id="2719" fill="#000000"></path></svg>
          </div>
        </a>

        <a href='https://discord.gg/therealmoonbox' target="_blank" className=' ml-[10px] sm:ml-4'>
          <div className='inline-flex items-center justify-center h-[36px] w-[36px] lg:h-[40px] lg:w-[40px] 3xl:h-[48px] 3xl:w-[48px] rounded-[10px] border-black border-2 bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]  sm:hover-btn-shadow'>
            <svg className='w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]' viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5511"><path d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z" p-id="5512" fill="#000000"></path></svg>
          </div>
        </a>

        {(mediaSize?.width || 0) < 1024 && (
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
              <DropdownMenuItem>
                {/* <span className="h-[30px] w-full text-center text-[18px] leading-[30px] font-semibold">
                  Connect Wallet
                </span> */}
              </DropdownMenuItem>
              <Link href={"/declaration"} >
                <DropdownMenuItem>
                  <span className="h-[30px] w-full text-center text-[18px] leading-[30px] font-semibold">
                    {t('header_declaration')}
                  </span>
                </DropdownMenuItem>
              </Link>
              <CustomConnectButton />
            </DropdownMenuContent>

          </DropdownMenu>
        )}

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
                          className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[180px]"
                          onClick={openConnectModal}
                        >
                          <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px]">
                            {t("header_connect_wallet")}
                          </span>
                        </div>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <div
                          className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[180px]"
                          onClick={openChainModal}
                        >
                          <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px]">
                            {t("header_wrong_network")}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[84px] items-center justify-center rounded-[10px] border-2 border-black bg-white pr-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px]  lg:w-[160px] 3xl:h-[48px] 3xl:w-[180px]">
                            <span className="ml-[6px] whitespace-nowrap text-[16px] font-semibold text-black sm:text-[18px] lg:ml-[10px]">
                              {account.displayName}
                            </span>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-[10px] flex h-[60px] w-[180px] items-center rounded-[12px]">
                          <DropdownMenuItem
                            className="w-full p-[20px]"
                            onClick={() => disconnect()}
                          >
                            <Power className=' mr-3 text-black' />
                            <span className="w-full text-center text-[18px] font-medium leading-[18px]">
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
      {/* <div className="absolute top-0 z-[120] hidden h-[120px] w-full bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-white bg-blend-multiply mix-blend-multiply sm:block"></div> */}
    </header>
  );
};

export default Header;
