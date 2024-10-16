"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCountDown } from "ahooks";
import Big from "big.js";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";

import Header from "@/components/Header";
import { useBigItem, useApprove, useBidSubmit } from "@/service/bid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BidDetailsPage({ params }: { params: { id: string } }) {
  const homeT = useTranslations("Home");
  const t = useTranslations("Bid");
  const [item, loading, fetchBigItem] = useBigItem(Number(params.id));
  const [allowance, approveLoading, approveToken, fetchAllowance] =
    useApprove();
  const [isCollapse, setIsCollapse] = useState(true);
  const [currentBid, setCurrentBid] = useState(0);
  const [nftId, setNftId] = useState("");
  const [price, setPrice] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [bidLoading, bidSubmit] = useBidSubmit();

  const [endDate, setEndDate] = useState(Date.now());
  const [countdown, formattedRes] = useCountDown({
    targetDate: endDate,
  });

  const steps = [5, 10, 20];

  const handleBid = useCallback(async () => {
    if (!price || !nftId || !Number(price)) {
      if (!nftId) {
        toast.error(t("requireNFT"));
      }
      return;
    }
    try {
      await bidSubmit(item?.id || 0, price, nftId);
      await fetchBigItem();
      await fetchAllowance();
      setConfirmDialog(false);
      toast.success(t("bidSuccess"));
    } catch (e) {
      console.error(e);
      console.table(e);
    }
  }, [price, nftId, bidSubmit, item, fetchBigItem, fetchAllowance, t]);

  useEffect(() => {
    setCurrentBid(Number(item?.price || 0));
    setEndDate(Number(item?.expireTime) * 1000 || Date.now());
  }, [item]);
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
            <Link
              href="/bid"
              className={`sm:hover-btn-shadow ml-[10px] inline-flex h-[36px] w-[120px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] sm:ml-4 sm:shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:h-[40px] lg:w-[120px] 3xl:h-[48px] 3xl:w-[142px]`}
            >
              {t("bigTab")}
            </Link>
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
                    className="aspect-square w-[450px] rounded object-cover"
                  />
                  <div className="lg:w-full lg:max-w-[520px]">
                    <div className="text-3xl font-bold">{t(item?.name)}</div>
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
                        <div className="text-xs font-normal tabular-nums lg:text-base">
                          {countdown <= 0
                            ? t("end")
                            : `${formattedRes.days}d ${formattedRes.hours}h ${
                                formattedRes.minutes
                              }m ${
                                formattedRes.seconds === 0
                                  ? formattedRes.seconds + "s"
                                  : ""
                              }`}{" "}
                          | {item?.count} {t("bids")}
                        </div>
                      </div>
                      <div className="mt-3 flex max-w-[300px] items-center gap-2 rounded border border-[#605D5E] p-3 text-sm lg:text-base">
                        <div className="whitespace-nowrap">Nobody #</div>
                        <div className="flex-1">
                          <input
                            value={nftId}
                            onChange={(e) => setNftId(e.target.value)}
                            className="w-1/2 border-b-2 border-black bg-transparent outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-[#117E8A] lg:mt-5">
                        {t("step2")}
                      </div>
                      <div className="text-lg font-bold lg:text-2xl">
                        {t("placeYourBid")}
                      </div>
                      <div className="mt-3 flex flex-col flex-wrap items-center gap-3 text-sm lg:mt-5 lg:flex-row lg:gap-2 lg:text-base">
                        <ConnectButton.Custom>
                          {({
                            account,
                            chain,
                            authenticationStatus,
                            mounted,
                            openConnectModal,
                          }) => {
                            const ready =
                              mounted && authenticationStatus !== "loading";
                            const connected =
                              ready &&
                              account &&
                              chain &&
                              (!authenticationStatus ||
                                authenticationStatus === "authenticated");
                            if (!connected) {
                              return (
                                <button
                                  className="w-full flex-1 rounded bg-[#117E8A] px-2 py-3 text-center text-white lg:px-4 lg:py-2"
                                  onClick={openConnectModal}
                                >
                                  {homeT("header_connect_wallet")}
                                </button>
                              );
                            }
                            return steps.map((item, i) => {
                              const newPrice =
                                item === 5 && currentBid === 0
                                  ? 10
                                  : (currentBid || 10) + item;
                              return (
                                <button
                                  key={item}
                                  className={cn(
                                    `w-full flex-1 basis-[calc(33.3333%-12px)] whitespace-nowrap rounded bg-[#117E8A] px-2 py-3 text-white lg:basis-[calc(33.3333%-8px)] lg:px-4 lg:py-2 ${
                                      approveLoading || allowance == null
                                        ? "animate-pulse cursor-not-allowed opacity-50"
                                        : ""
                                    }`,
                                    {
                                      "cursor-not-allowed opacity-50":
                                        countdown === 0 || bidLoading,
                                    },
                                  )}
                                  disabled={
                                    countdown === 0 ||
                                    approveLoading ||
                                    allowance == null
                                  }
                                  onClick={async () => {
                                    if (approveLoading || allowance == null) {
                                      return;
                                    }
                                    setPrice(newPrice.toString());
                                    if (new Big(allowance).lt(newPrice)) {
                                      try {
                                        await approveToken();
                                        await fetchAllowance();
                                      } catch (e) {
                                        console.log(e);
                                      }
                                    } else {
                                      setConfirmDialog(true);
                                    }
                                  }}
                                >
                                  {new Big(allowance || 0).lt(newPrice)
                                    ? t("approve")
                                    : t("bid") + " USDT " + newPrice}
                                </button>
                              );
                            });
                          }}
                        </ConnectButton.Custom>
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
                                  value.split(".")[1].slice(0, 6);
                              }
                              setPrice(value);
                            }}
                            value={price.toString()}
                          />
                        </div>
                        <ConnectButton.Custom>
                          {({
                            account,
                            chain,
                            authenticationStatus,
                            mounted,
                            openConnectModal,
                          }) => {
                            const ready =
                              mounted && authenticationStatus !== "loading";
                            const connected =
                              ready &&
                              account &&
                              chain &&
                              (!authenticationStatus ||
                                authenticationStatus === "authenticated");
                            if (!connected) {
                              return (
                                <button
                                  className="rounded bg-[#117E8A] px-2 py-3 text-white lg:px-8 lg:py-2"
                                  onClick={openConnectModal}
                                >
                                  {homeT("header_connect_wallet")}
                                </button>
                              );
                            }
                            return (
                              <button
                                className={cn(
                                  "rounded bg-[#117E8A] px-2 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 lg:px-8 lg:py-2",
                                )}
                                disabled={
                                  countdown === 0 ||
                                  bidLoading ||
                                  allowance == null ||
                                  !Number(price) ||
                                  Big(price).lte(currentBid)
                                }
                                onClick={async () => {
                                  if (approveLoading || allowance == null) {
                                    return;
                                  }
                                  if (new Big(allowance).lt(price || 0)) {
                                    try {
                                      await approveToken();
                                      await fetchAllowance();
                                    } catch (e) {
                                      console.log(e);
                                    }
                                  } else {
                                    setConfirmDialog(true);
                                  }
                                }}
                              >
                                {new Big(allowance || 0).lt(price || 0)
                                  ? t("approve")
                                  : t("placeBid")}
                              </button>
                            );
                          }}
                        </ConnectButton.Custom>
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
                  <div className="mt-2 text-sm lg:text-base">
                    {t.rich("itemSpecDesc", { br: () => <br /> })}
                  </div>
                </div>
              </>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">{t("noItem")}</div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmBid")}</DialogTitle>
            <DialogDescription className="pt-1 text-sm">
              {countdown <= 0
                ? t("end")
                : `${formattedRes.days}d ${formattedRes.hours}h ${
                    formattedRes.minutes
                  }m ${
                    formattedRes.seconds === 0 ? formattedRes.seconds + "s" : ""
                  }`}{" "}
              | {item?.count} {t("bids")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border-b border-[#605D5E]/50 px-8 pb-10 text-xl">
            {t("youToBid")} <span className="font-bold">{price} USDT</span>
            <div className="mt-4 flex gap-4 lg:mt-8 lg:gap-14">
              <button className="w-full rounded bg-[#117E8A] px-2 py-3 text-sm text-white lg:px-4 lg:py-2 lg:text-base">
                {t("cancel")}
              </button>
              <button
                className="w-full rounded bg-[#117E8A] px-2 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 lg:px-4 lg:py-2 lg:text-base"
                onClick={handleBid}
                disabled={countdown < 0 || bidLoading}
              >
                {bidLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  t("confirm")
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-[#212427]">{t("confirmTips")}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
