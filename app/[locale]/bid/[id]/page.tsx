"use client";
import Image from "next/image";

import { useTranslations } from "next-intl";

import Header from "@/components/Header";
import { getBigItem } from "@/service/bid";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function BidDetailsPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Bid");
  const item = getBigItem(Number(params.id));
  const [isCollapse, setIsCollapse] = useState(true);
  const [currentBid, setCurrentBid] = useState(0);
  const [price, setPrice] = useState("");
  const steps = [5, 10, 20];
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

          <div className="mx-auto mt-4 w-full rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-10">
            {item ? (
              <>
                <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-20">
                  <Image
                    src={item?.img}
                    alt="bid-card"
                    height={450}
                    width={450}
                    className="aspect-square w-[450px] object-cover"
                  />
                  <div className="lg:max-w-[500px]">
                    <div className="text-3xl font-bold">{item?.name}</div>
                    <div className="mt-3 text-2xl lg:mt-5">
                      {item?.coin} {item?.price}
                    </div>
                    <div className="mt-2 space-y-2 border-b border-black/50 pb-3 text-sm lg:pb-5">
                      <div
                        className={`${
                          isCollapse ? "line-clamp-2" : "line-clamp-none"
                        }`}
                      >
                        {t(item?.desc)}
                      </div>
                      {isCollapse && (
                        <div
                          className="cursor-pointer text-right"
                          onClick={() => setIsCollapse(false)}
                        >
                          &gt; {t("readMore")}
                        </div>
                      )}
                      {!isCollapse && (
                        <div
                          className="cursor-pointer text-right"
                          onClick={() => setIsCollapse(true)}
                        >
                          &gt; {t("collapse")}
                        </div>
                      )}
                    </div>
                    <>
                      <div className="mt-3 text-sm text-[#117E8A] lg:mt-5">
                        {t("step1")}
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-lg font-bold lg:text-2xl">
                          {t("enterNFT")}
                        </div>
                        <div className="text-xs font-normal lg:text-base">
                          2d 1 h 53m | 24 {t("bids")}
                        </div>
                      </div>
                      <div className="mt-3 flex max-w-[300px] items-center gap-2 rounded border border-[#605D5E] p-3 text-sm lg:text-base">
                        <div>Nobody #</div>
                        <InputOTP maxLength={4}>
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot
                              index={0}
                              className="h-6 w-3 rounded-none border-0 border-y-0 border-b-2 border-black first:rounded-l-none first:border-l-0 last:rounded-r-none last:border-r-0"
                            />
                            <InputOTPSlot
                              index={1}
                              className="h-6 w-3 rounded-none border-0 border-y-0 border-b-2 border-black first:rounded-l-none first:border-l-0 last:rounded-r-none last:border-r-0"
                            />
                            <InputOTPSlot
                              index={2}
                              className="h-6 w-3 rounded-none border-0 border-y-0 border-b-2 border-black first:rounded-l-none first:border-l-0 last:rounded-r-none last:border-r-0"
                            />
                            <InputOTPSlot
                              index={3}
                              className="h-6 w-3 rounded-none border-0 border-y-0 border-b-2 border-black first:rounded-l-none first:border-l-0 last:rounded-r-none last:border-r-0"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <div className="mt-3 text-sm text-[#117E8A] lg:mt-5">
                        {t("step2")}
                      </div>
                      <div className="text-lg font-bold lg:text-2xl">
                        {t("placeYourBid")}
                      </div>
                      <div className="mt-3 flex flex-col items-center gap-3 text-sm lg:mt-5 lg:flex-row lg:gap-2 lg:text-base">
                        {steps.map((item) => (
                          <button
                            key={item}
                            className="w-full rounded bg-[#117E8A] px-2 py-3 text-white lg:px-4 lg:py-2"
                            onClick={() => {
                              setPrice((currentBid + item).toString());
                            }}
                          >
                            {t("bid")} USDT {currentBid + item}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-base uppercase lg:mt-5">
                        <div className="h-px flex-1 bg-[#605D5E]/50"></div>
                        <div>{t("or")}</div>
                        <div className="h-px flex-1 bg-[#605D5E]/50"></div>
                      </div>
                      <div className="mt-2 text-sm font-medium lg:mt-3 lg:text-base">
                        {t("maxBid")}
                      </div>
                      <div className="text-sm text-[#212427]/50 lg:text-base">
                        {t("enterMore")}
                      </div>
                      <div className="flex flex-col gap-2 lg:flex-row">
                        <div className="flex flex-1 gap-2 rounded border border-[#605D5E] p-3">
                          <div>USDT</div>
                          <input
                            min={0}
                            className="flex-1 bg-transparent outline-none"
                            onInput={(e) => {
                              let value = (e.target as HTMLInputElement).value;
                              if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
                                value = value.replace(/[^0-9.]/g, ""); // 移除非数字和小数点的字符
                                let index = -1;
                                let find = false;
                                value.split("").forEach((item, i) => {
                                  const char = price[i];
                                  if (item === "." && !find) {
                                    index++;
                                    if (char !== item) {
                                      find = true;
                                    }
                                  }
                                });
                                const parts = value.split(".");
                                if (parts.length > 1) {
                                  value = parts
                                    .map((item, i) => {
                                      if (index === i) {
                                        return item + ".";
                                      }
                                      return item;
                                    })
                                    .join("");
                                  value = value.replace(/^0+/, "");
                                }
                                (e.target as HTMLInputElement).value = value;
                              }
                              if (value.split(".").length > 1) {
                                value =
                                  (value.split(".")[0] || 0) +
                                  "." +
                                  value.split(".")[1].slice(0, 8);
                              }
                              setPrice(value);
                            }}
                            value={price.toString()}
                          />
                        </div>
                        <button className="rounded bg-[#117E8A] px-2 py-3 text-white lg:px-8 lg:py-2">
                          {t("placeBid")}
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-[#212427] lg:mt-3 lg:text-sm">
                        {t("bidDesc")}
                      </div>
                    </>
                  </div>
                </div>
                <div className="mt-8 rounded border border-black/50 p-4 lg:mt-12 lg:p-8">
                  <div className="text-lg font-bold lg:text-2xl">
                    {t("itemSpec")}
                  </div>
                  <div className="mt-2 text-sm lg:text-base"></div>
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold">{t("noItem")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
