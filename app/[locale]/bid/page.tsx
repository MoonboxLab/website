"use client";

import Image from "next/image";

import Header from "@/components/Header";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useBigList } from "@/service/bid";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AuctionItem } from "@/service/bid";
import moment from "moment";

function Item({
  item,
  type = "card",
  ended = false,
}: {
  item: AuctionItem;
  type: "card" | "list";
  ended: boolean;
}) {
  const t = useTranslations("Bid");
  const timeRange = useCallback(() => {
    const start = moment(item.startTime * 1000).format("DD");
    const end = moment(item.expireTime * 1000).format("DD MMMM YYYY");
    return `${start} - ${end}`;
  }, [item]);
  return (
    <>
      <Link
        className="group relative hidden border-b border-black/50 pb-5 lg:block"
        href={`/bid/${item.id}`}
      >
        <Image
          src={item.img}
          alt={item.name}
          width={250}
          height={250}
          className="aspect-square rounded object-cover"
        />
        <div className="mt-8 text-3xl font-bold">{t(item.name)}</div>
        <div className="mt-3 flex flex-col justify-between gap-2 text-2xl lg:flex-row">
          <div>
            {item.coin} {Math.max(Number(item?.price), 10)}
          </div>
          {ended ? (
            <div className="rounded border border-[#aaa] px-10 py-1 text-center text-base text-[#605D5E]">
              {t("bidEnded")}
            </div>
          ) : (
            <div className="rounded bg-[#117E8A] px-10 py-1 text-center text-base text-white">
              {t("bidNow")}
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-[#605D5E]">{timeRange()}</div>
      </Link>
      <Link
        className="border-b border-black/50 py-6 lg:hidden lg:border-b-0"
        href={`/bid/${item.id}`}
      >
        <div className="text-base lg:hidden">
          {timeRange()} | {item.count} {t("bids")}
        </div>
        <div className="mt-4 flex items-center gap-3 lg:items-start lg:gap-10">
          <Image
            src={item.img}
            alt={item.name}
            width={100}
            height={100}
            className="aspect-square rounded object-cover lg:w-[200px]"
          />
          <div className="flex flex-1 border-black/50 lg:border-b lg:pb-6">
            <div className="flex h-full flex-1 flex-col gap-2 lg:gap-4">
              <div className="text-xl font-bold lg:text-3xl">
                {t(item.name)}
              </div>
              <div className="text-base lg:text-xl">
                {item.coin} {Math.max(Number(item?.price), 10)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 lg:gap-4">
              {ended ? (
                <div className="rounded border border-[#aaa] px-2 py-0 text-center text-base text-[#605D5E]">
                  {t("bidEnded")}
                </div>
              ) : (
                <div className="rounded bg-[#117E8A] px-2 py-0 text-center text-base text-white">
                  {t("bidNow")}
                </div>
              )}
              <div className="mt-2 hidden text-base lg:block">
                {timeRange()} | {item.count} {t("bids")}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
export default function BidPage() {
  const t = useTranslations("Bid");
  const [list, loading] = useBigList();
  const locale = useLocale();
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnLastSnap: true }),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [ended, setEnded] = useState(false);
  const [type, setType] = useState<"card" | "list">("card");

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (list.length > 0) {
      if (list[0].expireTime * 1000 < Date.now()) {
        setEnded(true);
      } else {
        setEnded(false);
      }
    }
  }, [list]);
  return (
    <div className="relative">
      <div className="w-screen overflow-scroll bg-gray-100 pb-[150px]">
        <div className="absolute left-0 right-0 top-0 z-20 w-full">
          <Header />
        </div>
        <Image
          src={"/show_bg.jpg"}
          quality={100}
          unoptimized
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
              {ended ? t("pastAuction") : t("bigTab")}
            </button>
          </div>

          <div className="mt-8">
            <Carousel plugins={[plugin.current]} setApi={setApi}>
              <CarouselContent>
                <CarouselItem>
                  <Image
                    src="/bid/banner.webp"
                    alt="bid-banner"
                    width={1440}
                    height={569}
                    className="aspect-[1440/569] w-full object-cover"
                  />
                </CarouselItem>
                <CarouselItem>
                  <iframe
                    src={
                      locale === "en"
                        ? "https://www.youtube.com/embed/mDIJ83WgIdg?si=oLAEYqhRpP4F2FIt"
                        : "https://www.youtube.com/embed/brQquj7pjCo?si=UTeTuODUY3iQtUYI"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="aspect-[1440/569] w-full"
                  ></iframe>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-0 h-20 rounded-l-none rounded-r-lg border-0 bg-black/50 text-white" />
              <CarouselNext className="right-0 h-20 rounded-l-lg rounded-r-none border-0 bg-black/50 text-white" />
            </Carousel>
            <div className="relative z-[1]">
              <div className="border border-t-0 border-black bg-white pt-6 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <div className="flex h-1 justify-center gap-3">
                  <div
                    className={`h-1 w-9 rounded-full ${
                      current === 0 ? "bg-[#605D5E]" : "bg-[#AAAAAA]"
                    }`}
                  ></div>
                  <div
                    className={`h-1 w-9 rounded-full ${
                      current === 1 ? "bg-[#605D5E]" : "bg-[#AAAAAA]"
                    }`}
                  ></div>
                </div>
                <div className="relative mt-8 pb-6 text-center text-[#174172]">
                  <div className="text-2xl font-bold lg:text-3xl">
                    {t("nobodySquare")}
                  </div>
                  <div className="mt-2 text-sm font-bold lg:text-2xl">
                    {t("producerInfo")}
                  </div>
                  <div className="mt-2 text-base lg:text-2xl lg:leading-10">
                    {t.rich("nobodySquareIntro", {
                      br: () => <br />,
                    })}
                  </div>

                  {isOpen ? null : (
                    <button
                      className="absolute right-4 top-0 h-6 w-6 rounded-full border-2 border-[#605D5E] lg:top-4 lg:h-12 lg:w-12"
                      onClick={() => setIsOpen(true)}
                    >
                      <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 bg-[#605D5E] lg:w-5"></div>
                      <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-[#605D5E] lg:w-5"></div>
                    </button>
                  )}
                </div>
              </div>
              {isOpen ? (
                <div className="absolute left-0 top-full -mt-px w-full border border-t-0 border-black bg-white px-4 py-6 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:py-12">
                  <button
                    className="absolute -top-2  right-4 h-6 w-6 rounded-full border-2 border-[#605D5E] lg:top-4 lg:h-12 lg:w-12"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="absolute left-1/2 top-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2 bg-[#605D5E] lg:w-5"></div>
                  </button>
                  <div className="mx-auto flex w-full max-w-[998px] flex-col gap-x-12 gap-y-3 text-base text-[#174172] lg:flex-row lg:text-2xl">
                    <div className="flex-1">
                      <div>{t("nobodySquareDesc")}</div>
                      <div className="mt-3 flex gap-2 lg:mt-5 ">
                        <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                          {t("eventTimeTitle")}
                        </div>
                        <div>{t("eventTime")}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                          {t("participationRequirementsTitle")}
                        </div>
                        <div>{t("participationRequirements")}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                          {t("acceptedCurrencyTitle")}
                        </div>
                        <div>{t("acceptedCurrency")}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="">
                        <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                          {t("eventDescriptionTitle")}
                        </div>
                        <div className="mt-2 lg:mt-3">
                          {t("eventDescription")}
                        </div>
                      </div>
                      <div className="mt-3 lg:mt-5">
                        <div className="whitespace-nowrap font-bold underline decoration-solid underline-offset-4">
                          {t("aboutXianRenYiKun")}
                        </div>
                        <div className="mt-2 lg:mt-3">
                          {t("industryLeader")}
                        </div>
                      </div>
                      <div className="mt-3 text-sm opacity-50 lg:mt-5 lg:text-xl">
                        {t("genderConsistencyWarning")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {loading ? (
            <div className="mx-auto mt-4 flex w-full items-center justify-center gap-x-24 gap-y-8 rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] md:grid-cols-2 lg:grid-cols-3 lg:gap-y-11 lg:px-16 lg:py-10">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div
              className={`mx-auto mt-4 grid w-full rounded-3xl border border-black bg-[#F3EFE4] px-3 py-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] lg:px-16 lg:py-10 ${
                type === "list"
                  ? "grid-cols-1"
                  : "gap-x-24 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-11"
              }`}
            >
              {list.map((item) => (
                <Item key={item.id} item={item} type={type} ended={ended} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
