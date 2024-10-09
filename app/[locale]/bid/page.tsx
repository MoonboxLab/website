"use client";

import Image from "next/image";

import Header from "@/components/Header";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useBigList } from "@/service/bid";

export default function BidPage() {
  const t = useTranslations("Bid");
  const [list, loading] = useBigList();
  return (
    <div className="relative">
      <div className="w-screen overflow-scroll bg-gray-100 pb-[150px]">
        <div className="absolute left-0 right-0 top-0 z-20 w-full">
          <Header />
        </div>
        <Image
          src={"/show_bg.jpg"}
          alt="background-image"
          height={340}
          width={1920}
          style={{ objectFit: "cover" }}
          className="w-full"
        />

        <div className="mx-auto mt-8 max-w-[1447px] px-4 lg:px-16">
          <div className="flex items-center justify-center gap-5">
            <button
              className={`sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px]`}
            >
              {t("bigTab")}
            </button>
          </div>

          <div className="mt-8">
            <Image
              src="/bid/banner.webp"
              alt="bid-banner"
              width={1920}
              height={340}
              className="w-full object-cover"
            />
          </div>
          {loading ? (
            <div className="mx-auto mt-4 flex w-full items-center justify-center gap-x-24 gap-y-8 rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] md:grid-cols-2 lg:grid-cols-3 lg:gap-y-11 lg:px-16 lg:py-10">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="mx-auto mt-4 grid w-full gap-x-24 gap-y-8 rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] md:grid-cols-2 lg:grid-cols-3 lg:gap-y-11 lg:px-16 lg:py-10">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="group relative border-b border-black/50 pb-5"
                >
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={250}
                    height={250}
                    className="aspect-square object-cover"
                  />
                  <div className="mt-8 text-3xl font-bold">{t(item.name)}</div>
                  <div className="mt-3 flex flex-col justify-between gap-2 text-2xl lg:flex-row">
                    <div>
                      {item.coin} {item.price}
                    </div>
                    <Link
                      href={`/bid/${item.id}`}
                      className="rounded bg-[#117E8A] px-10 py-1 text-center text-base text-white"
                    >
                      {t("bidNow")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
