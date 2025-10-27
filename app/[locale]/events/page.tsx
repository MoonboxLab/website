"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/Header";

export default function EventsPage() {
  const t = useTranslations("Home");
  const tMusic = useTranslations("Music");
  const locale = useLocale();

  const events = [
    {
      id: "hares",
      name: t("hares"),
      href: "/hares",
      banner: locale === "en" ? "/hares/en-banner.webp" : "/hares/banner.webp",
    },
    {
      id: "impact",
      name: t("impact"),
      href: "/impact",
      banner: locale === "en" ? "/impact/en-banner.jpg" : "/impact/banner.jpeg",
    },
    {
      id: "bid",
      name: t("bid"),
      href: "/bid",
      banner: "/bid/banner.webp",
    },
    {
      id: "talkshow",
      name: t("talkshow"),
      href: "/talkshow",
      banner: "/show_bg.jpg", // talkshow页面使用show_bg.jpg作为背景
    },
    {
      id: "show",
      name: t("show"),
      href: "/show",
      banner: "/show_bg.jpg", // show页面也使用show_bg.jpg作为背景
    },
  ];

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
          {/* Dream a Music Superstar Banner - Featured at top */}
          <div className="mt-8">
            <Link href={`/${locale}/music`}>
              <div className="group relative cursor-pointer overflow-hidden">
                <Image
                  src="/music/banner.png"
                  alt={t("dreamMusicSuperstar")}
                  width={1280}
                  height={720}
                  className="aspect-[1280/720] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute inset-x-6 bottom-6 text-white">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold">
                      {t("dreamMusicSuperstar")}
                    </h1>
                    <span className="animate-pulse rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                      NOW LIVE!
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-gray-200">
                    {tMusic("nobodySquareIntro")}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Historical Events Grid */}
          <div className="mt-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
              {t("historicalEvents")}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link key={event.id} href={`/${locale}${event.href}`}>
                  <div className="group relative h-[250px] w-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                    <Image
                      src={event.banner}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{event.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
