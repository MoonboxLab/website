"use client";

import Header from "@/components/Header";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function LeaderboardPage() {
  const t = useTranslations("Leaderboard");
  const [tab, setTab] = useState(1);
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <div className="absolute left-0 right-0 top-0">
        <Header />
      </div>
      <Image
        src="/leaderboard-header.webp"
        alt="background"
        className="pointer-events-none w-full object-cover"
        width={1920}
        height={340}
      />
      <div className="mt-8">
        <div className="flex items-center justify-center gap-5">
          <button
            className={`sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px] ${
              tab === 0 ? "opacity-30" : "opacity-100"
            }`}
            onClick={() => setTab(0)}
          >
            {t("goldCard")}
          </button>
          <button
            className={`sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px] ${
              tab === 1 ? "opacity-30" : "opacity-100"
            }`}
            onClick={() => setTab(1)}
          >
            {t("NFT")}
          </button>
        </div>
        <div className="px-5 pb-3 text-[#174172]">
          {tab === 0 ? (
            <div className="mx-auto mt-4 grid w-full max-w-[1447px] gap-x-24 gap-y-8 rounded-3xl border border-black bg-[#F3EFE4] px-16 py-10 shadow-[3px_3px_0px_rgba(0,0,0,1)] md:grid-cols-2 lg:grid-cols-3">
              <div className="group place-self-center md:col-span-2 lg:col-span-3">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/stephenchow.webp"
                    alt="stephenchow"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/stephenchow-hover.webp"
                    alt="stephenchow"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Stephen Chow 周星馳
                </div>
              </div>
              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/mcjin.webp"
                    alt="mcjin"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/mcjin-hover.webp"
                    alt="mcjin"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  MC Jin 歐陽靖
                </div>
              </div>

              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/vannesswu.webp"
                    alt="vannesswu"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/vannesswu-hover.webp"
                    alt="vannesswu"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Vanness Wu 吳建豪
                </div>
              </div>
              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/memeland.webp"
                    alt="memeland"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/memeland-hover.webp"
                    alt="memeland"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  9 Gag/ Memeland CEO 陈展程
                </div>
              </div>
              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/sklam.webp"
                    alt="sklam"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/sklam-hover.webp"
                    alt="sklam"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  AllRightsReserved (ARR) 創辦人 SK Lam
                </div>
              </div>
              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/chrischan.webp"
                    alt="chrischan"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/chrischan-hover.webp"
                    alt="chrischan"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  星輝海外有限公司董事總經理 陳震宇 Chris Chan
                </div>
              </div>
              <div className="group">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/igniousyong.webp"
                    alt="igniousyong"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/igniousyong-hover.webp"
                    alt="igniousyong"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  比高集團 Ignious Yong
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-4 grid w-full max-w-[1447px] gap-x-24 gap-y-8 rounded-3xl border border-black bg-[#F3EFE4] px-16 py-10 shadow-[3px_3px_0px_rgba(0,0,0,1)] md:grid-cols-2 lg:grid-cols-6">
              <div className="group lg:col-span-3 lg:place-self-end">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/stephenchow.webp"
                    alt="stephenchow"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/stephenchow-nft-hover.webp"
                    alt="stephenchow"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Stephen Chow 周星馳
                </div>
              </div>
              <div className="group lg:col-span-3">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/ashin.webp"
                    alt="ashin"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/ashin-nft-hover.webp"
                    alt="ashin"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Ashin 阿信 (陈信宏)
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/edisonchen.webp"
                    alt="edisonchen"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/edisonchen-nft-hover.webp"
                    alt="edisonchen"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Edison 陈冠希
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/jjlin.webp"
                    alt="jjlin"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/jjlin-nft-hover.webp"
                    alt="jjlin"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  JJ Lin 林俊傑
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/charlenechoi.webp"
                    alt="charlenechoi"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/charlenechoi-nft-hover.webp"
                    alt="charlenechoi "
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Charlene Choi 阿Sa
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/vannesswu.webp"
                    alt="vannesswu"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/vannesswu-nft-hover.webp"
                    alt="vannesswu"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Vanness Wu 吳建豪
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/mcjin.webp"
                    alt="mcjin"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/mcjin-nft-hover.webp"
                    alt="mcjin"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  MC Jin 歐陽靖
                </div>
              </div>
              <div className="group lg:col-span-2">
                <div className="relative lg:h-[350px]">
                  <Image
                    src="/stephenfung.webp"
                    alt="stephenfung"
                    width={350}
                    height={350}
                    className="mx-auto block object-cover transition duration-300"
                  />
                  <Image
                    src="/stephenfung-nft-hover.webp"
                    alt="stephenfung"
                    width={350}
                    height={350}
                    className="absolute inset-0 mx-auto block object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-4 text-center text-base font-bold md:text-lg lg:text-2xl">
                  Stephen Fung 馮德倫
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
