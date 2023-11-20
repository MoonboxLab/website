"use client";
import "core-js/features/object/has-own";

import Modal from "react-modal";
import ReactPlayer from "react-player";
import Image from "next/image";
import { useLocalStorageState, useSize } from "ahooks";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { RefObject, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
// import { useChat } from 'ai/react';
import { useChat } from "@/lib/useChat";
import BotMessageItem from "@/components/BotMessageItem";
import UserMessageItem from "@/components/UserMessageItem";
import { track } from "@vercel/analytics/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FirstSectionProps {
  showChatModal: boolean;
  setShowChatModal: (arg: boolean) => any;
  playingMedia: boolean;
  setPlayingMedia: (arg: boolean) => any;
}
export default function FirstSection(props: FirstSectionProps) {
  const { showChatModal, setShowChatModal, playingMedia, setPlayingMedia } =
    props;

  const mediaSize = useSize(document.querySelector("body"));
  const t = useTranslations("Home");

  const playerRef = useRef<ReactPlayer>();
  const inputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const chatInputRef = useRef<HTMLInputElement>(null);
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const chatListBottomRef = useRef<HTMLEmbedElement>(null);

  const [showMainModal, setShowMainModal] = useState<boolean>(false);
  const [showSecondModal, setShowSecondModal] = useState<boolean>(true);

  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitingEmail, setSubmitingEmail] = useState<boolean>(false);

  const [isSubmitedEmail, setSubmitEmail] = useLocalStorageState<
    boolean | undefined
  >("moonbox-email-submit", {
    defaultValue: false,
  });

  const [isMuted, setVidoeMuted] = useLocalStorageState<boolean | undefined>(
    "moonbox-hove-video-mute",
    {
      defaultValue: false,
    },
  );

  const locale = useLocale();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "InitInfo",
        role: "assistant",
        content: t.raw("ai_sayhi"),
      },
    ],
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    chatListBottomRef.current?.scrollTo({
      top: chatListBottomRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [chatListBottomRef.current?.scrollHeight, messages]);

  const submitEmail = async (inputEmail: String) => {
    setSubmitting(true);

    try {
      const { status, statusText } = await fetch("/api/add-email", {
        method: "POST",
        body: JSON.stringify({ email: inputEmail }),
      });

      if (status == 200) {
        toast.success(t("submit_success"), {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setShowMainModal(false);

        setSubmitEmail(true);

        if (inputRef.current?.value) {
          inputRef.current.value = "";
        }
        if (secondInputRef.current?.value) {
          secondInputRef.current.value = "";
        }
      } else {
        toast.error(statusText, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Submit Error", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setSubmitting(false);
  };

  const sendWeclomeEmailToUser = async (
    email: string,
    captchaRes: Record<string, any>,
  ) => {
    try {
      const result = await fetch("https://homeapi.moonbox.com/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          ticket: captchaRes.ticket,
          rand: captchaRes.randstr,
        }),
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitEmail = async (valueRef: RefObject<HTMLInputElement>) => {
    if (isSubmitting) return;

    const inputRef = valueRef;
    const inputEmail = inputRef.current?.value || "";
    if (!inputEmail) return;

    if (!isValidEmail(inputEmail)) {
      toast.warn(t("submit_email_format_error"), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // 验证码逻辑
    try {
      // @ts-ignore
      var captcha = new TencentCaptcha(
        "189994500",
        (res) => {
          console.log(res);
          if (res.ret == 0) {
            submitEmail(inputEmail);
            sendWeclomeEmailToUser(inputEmail, res);
          }
        },
        {
          userLanguage: locale == "en" ? "en" : "zh-cn",
        },
      );
      captcha.show();
    } catch (err) {
      console.log(err);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="section relative h-screen w-full">
      {(mediaSize?.width || 0) > 640 && (
        <div className="relative left-0 top-0 z-10 hidden h-full w-full sm:block">
          <div className="ml-[125px] flex h-screen w-full flex-col justify-center">
            <span className="text-shadow z-50 flex-nowrap text-[72px] font-semibold leading-[72px] text-white">
              {t("auction_start_soon")}
            </span>
            <div className="z-50 mt-[30px]">
              <span className="text-gradient text-shadow flex-nowrap text-[120px] font-semibold leading-[120px] text-white">
                {t("special_role")}
              </span>
            </div>
            <span className="z-50 mt-[40px] flex-nowrap text-[21px]  font-semibold text-white">
              {t("auction_start_time")}
            </span>
            <span className="z-50 w-[778px] text-[21px] font-semibold  text-white">
              {t("auction_eligibility")}
            </span>

            <Dialog>
              <DialogTrigger asChild>
                <span className="z-50 mt-[30px] flex-nowrap text-[21px]  font-semibold text-white underline">
                  {t("view_rules")}
                </span>
              </DialogTrigger>
              <DialogContent className="3xl:max-w-[1035px]">
                <DialogHeader>
                  <DialogTitle className="text-[21px]">
                    {t("auction_rules")}
                  </DialogTitle>
                  <DialogDescription className="pt-[30px] text-[16px]">
                    <div dangerouslySetInnerHTML={{__html: t.raw('auction_rules_detail')}} />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <Image
            src={"/home_background_auction_1.png"}
            alt="background_image"
            fill
            style={{ objectFit: "cover" }}
            // priority
          />
        </div>
      )}

      {/* Mobile Video */}
      <div className="relative flex h-full w-screen flex-col justify-center sm:hidden">
        <div className="absolute left-0 top-0 h-full w-full ">
          <Image
            src={"/home_bg_mobile_stage2.jpg"}
            alt="background_image"
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            quality={100}
          />
          {playingMedia && (
            <div className="relative z-[100] h-full w-full bg-black/80"></div>
          )}
        </div>
        <div className=" relative z-[110]">
          {/* Close Button */}
          {playingMedia && (
            <div
              className=" absolute right-2 top-[-30px] inline-flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full bg-slate-400/40"
              onClick={() => {
                setPlayingMedia(false);
                // @ts-ignore
                playerRef.current?.seekTo(0, "fraction");
              }}
            >
              <X size={18} color="#d2d2d2" />
            </div>
          )}

          {!playingMedia && (
            <div
              className=" absolute left-[50%] z-[120] inline-flex h-[64px] w-[64px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-full border-[2px] bg-black/80 "
              onClick={() => setPlayingMedia(true)}
            >
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6577"
                width="30"
                height="30"
              >
                <path
                  d="M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z"
                  fill="#ffffff"
                ></path>
              </svg>
            </div>
          )}

          <AspectRatio ratio={1920 / 1080}>
            {(mediaSize?.width || 0) <= 640 && playingMedia && (
              <ReactPlayer
                key={"Mobile"}
                // @ts-ignore
                ref={playerRef}
                pip={false}
                controls
                controlslist="nofullscreen play timeline volume"
                playing={playingMedia}
                onEnded={() => {
                  setPlayingMedia(false);
                  // @ts-ignore
                  playerRef.current?.seekTo(0, "fraction");

                  // if (!isSubmitedEmail) {
                  //   setShowMainModal(true);
                  // }
                  setShowChatModal(true);
                }}
                width="100%"
                height="auto"
                url={
                  "https://d4pw50zft54fq.cloudfront.net/homepage-scene/2/playlist.m3u8"
                }
              />
            )}
          </AspectRatio>
        </div>
      </div>

      {/* PC small modal */}
      {!playingMedia &&
        !showMainModal &&
        !showChatModal &&
        (mediaSize?.width || 0) > 640 &&
        showSecondModal && (
          <div className=" hover-btn-shadow absolute bottom-[20px] left-[20px] z-[110] h-[178px] w-[406px] overflow-visible rounded-[16px] border-[2px] border-black bg-[rgba(77,88,99,1)] p-[20px] shadow-[5px_5px_0px_rgba(0,0,0,1)]">
            <div className=" absolute left-[30px] top-[-23px] h-[69px] w-[76px]">
              <Image src="/mail_modal_ill.png" fill alt="mail modal" priority />
            </div>

            <h3 className=" font-Inter mb-[20px] mt-[20px] text-[18px] font-semibold leading-[24px] text-white">
              {t("email_modal_title")}
            </h3>

            <div className="flex justify-between">
              <Input
                placeholder={t("email_modal_input_placeholder")}
                className="!focus-visible:ring-0 !focus-visible:outline-none !focus:ring-0 !active:ring-0 h-[48px] w-[260px] rounded-[24px] border-none border-transparent bg-black/20 px-4 text-[16px] font-medium leading-[16px] text-white outline-none ring-0 placeholder:text-[16px] placeholder:font-medium placeholder:text-white/30 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none"
                ref={secondInputRef}
                onChange={() => {
                  if (
                    Boolean(secondInputRef.current?.value) &&
                    !isSubmitingEmail
                  ) {
                    setSubmitingEmail(true);
                  }
                  if (
                    !Boolean(secondInputRef.current?.value) &&
                    isSubmitingEmail
                  ) {
                    setSubmitingEmail(false);
                  }
                }}
              />

              <Button
                className={clsx(
                  "h-[48px] w-[120px] rounded-full text-[16px] font-normal leading-[16px] text-black",
                  secondInputRef.current?.value
                    ? "bg-white hover:bg-white"
                    : "bg-white/40 hover:bg-white/40",
                )}
                disabled={isSubmitting}
                onClick={() => handleSubmitEmail(secondInputRef)}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {t("email_modal_subscribe")}
              </Button>
            </div>
          </div>
        )}

      {/* mobile */}
      {!showChatModal && (
        <div className="absolute bottom-[120px] left-0 right-0 z-20 sm:hidden">
          <div
            className="mx-auto mb-[10px] flex h-[56px] w-[360px] cursor-pointer items-end rounded-[12px] border-[2px] border-black bg-white px-[14px] shadow-[4px_4px_0px_#000000FF]"
            onClick={() => setShowChatModal(true)}
          >
            <Image
              src={"/chat_bot_avatar.png"}
              alt="chat avatar"
              width={50}
              height={65}
            />
            <span className=" ml-[10px] text-[18px] font-semibold leading-[48px]">
              {t("mobile_chat_btn")}
            </span>
          </div>
          <div
            className="mx-auto flex h-[56px] w-[360px] cursor-pointer items-center rounded-[12px] border-[2px] border-black bg-white py-[14px] pl-[20px] shadow-[4px_4px_0px_#000000FF]"
            onClick={() => setShowMainModal(true)}
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
      )}

      {/* Main email modal */}
      <Modal
        isOpen={showMainModal}
        style={{
          content: {
            width: (mediaSize?.width || 0) > 640 ? "636px" : "350px",
            height: (mediaSize?.width || 0) > 640 ? "370px" : "305px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "24px",
            padding: 0,
            overflow: "visible",
          },
        }}
      >
        <div className=" absolute left-0 right-0 top-[-32px]  mx-auto h-[91px] w-[96px] sm:top-[-39px] sm:h-[107px] sm:w-[112px]">
          <Image src="/mail_modal_ill.png" fill alt="mail modal" priority />
        </div>

        <div
          className=" absolute right-[20px] top-[20px] cursor-pointer opacity-80"
          onClick={() => setShowMainModal(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h3 className=" mb-[16px] mt-[78px] px-[15px] text-center text-[18px] font-semibold  leading-[24px] sm:mb-[40px] sm:mt-[86.6px] sm:px-[20px] sm:text-[24px] sm:leading-[30px]">
          {t("email_modal_title")}
        </h3>

        <Input
          placeholder={t("email_modal_input_placeholder")}
          className="mx-auto h-[48px] w-[300px] rounded-full bg-black/10 px-4  
        text-[16px] font-normal leading-[16px] outline-none placeholder:text-[18px] placeholder:font-normal placeholder:text-black/20 focus:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none active:ring-0 sm:mx-[40px] sm:h-[56px] sm:w-[556px] sm:px-6 sm:text-[18px] sm:leading-[18px]"
          ref={inputRef}
        />

        <Button
          className="mx-auto mt-[12px] flex h-[48px] w-[300px] rounded-full text-[16px] font-semibold leading-[16px] sm:mx-[40px] sm:mt-[20px] sm:h-[56px] sm:w-[556px] sm:text-[18px] sm:leading-[18px]"
          disabled={isSubmitting}
          onClick={() => handleSubmitEmail(inputRef)}
        >
          {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t("email_modal_subscribe")}
        </Button>
      </Modal>

      {/* Bot Chat Modal  */}
      <Modal
        isOpen={showChatModal}
        style={{
          content: {
            width:
              (mediaSize?.width || 0) > 640
                ? (mediaSize?.width || 0) > 1800
                  ? "932px"
                  : "832px"
                : "92%",
            height: (mediaSize?.width || 0) > 640 ? "70%" : "80%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: (mediaSize?.width || 0) > 640 ? "transparent" : "gray",
            borderRadius: (mediaSize?.width || 0) > 640 ? "24px" : "12px",
            border: "none",
            padding: (mediaSize?.width || 0) > 640 ? 0 : "10px",
            overflow: "visible",
            zIndex: "130",
          },
        }}
      >
        <div className=" mb-1 flex justify-end sm:hidden">
          <X color="white" onClick={() => setShowChatModal(false)} />
        </div>
        <div
          className="hide-scrollbar h-[84%] min-h-[200px] overflow-y-scroll sm:h-[92%]"
          ref={chatListBottomRef}
        >
          {messages.length === 1 ? (
            <BotMessageItem
              message={messages[0].content}
              id={messages[0].id}
              key={messages[0].id}
            />
          ) : (
            messages.map((item) => {
              if (item.role == "assistant") {
                return (
                  <BotMessageItem
                    message={item.content}
                    id=""
                    key={`${item.id}_${new Date().toString()}`}
                  />
                );
              }
              if (item.role == "user") {
                return <UserMessageItem message={item.content} key={item.id} />;
              }
            })
          )}
        </div>
        <form
          onSubmit={(...args) => {
            handleSubmit(...args);
            track("SendMessage");
          }}
        >
          <div
            className={clsx(
              "m-auto flex h-[48px] w-full max-w-[700px] rounded-[12px]  border-[2px] border-white/10 bg-black/40 p-[4px] sm:h-[68px] sm:bg-[#1D1D1DFF] sm:px-[10px]  sm:py-[8px] 4xl:max-w-[800px]",
            )}
          >
            <Input
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                if (!activeInput && Boolean(input)) {
                  setActiveInput(true);
                }
                if (activeInput && !Boolean(input)) {
                  setActiveInput(false);
                }
              }}
              ref={chatInputRef}
              placeholder={t("chat_model_placeholder")}
              className={clsx(
                "h-[36px] border-none bg-transparent pl-1 text-[18px] font-normal leading-[24px] text-white ring-0 placeholder:text-[18px] placeholder:font-normal placeholder:leading-[24px] placeholder:text-white/20 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none active:ring-0 sm:h-[48px] sm:p-0",
              )}
            />
            <button
              type="submit"
              className={clsx(
                "ml-1 inline-flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center  rounded-[8px] sm:ml-[10px] sm:h-[48px] sm:w-[48px]",
                Boolean(chatInputRef.current?.value)
                  ? "bg-[#3B84FFFF]"
                  : "bg-white/20",
              )}
            >
              <svg
                className="h-[18px] w-[18px] sm:h-[24px] sm:w-[24px]"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4973"
                fill={
                  Boolean(chatInputRef.current?.value) ? "#fff" : "#ffffff80"
                }
              >
                <path d="M478.4128 491.7248l-202.1376-30.1056a81.92 81.92 0 0 1-64.67584-52.38784L125.52192 178.4832c-7.8848-21.17632 2.49856-44.8512 23.22432-52.92032a39.38304 39.38304 0 0 1 31.90784 1.47456L878.592 475.15648c19.90656 9.9328 28.18048 34.48832 18.432 54.82496-3.8912 8.21248-10.40384 14.848-18.432 18.8416L180.6336 896.96256a39.77216 39.77216 0 0 1-53.6576-18.8416 41.7792 41.7792 0 0 1-1.45408-32.58368l86.07744-230.74816a81.92 81.92 0 0 1 64.67584-52.38784l202.1376-30.1056a20.48 20.48 0 0 0 0-40.5504z"></path>
              </svg>
            </button>
          </div>
        </form>
        <div className=" mt-[20px] hidden justify-center sm:flex 3xl:mt-[28px] 4xl:mt-[40px]">
          <div
            onClick={() => {
              setShowChatModal(false);
            }}
            className="inline-flex h-[42px] w-[170px] cursor-pointer items-center justify-center rounded-[24px] border-[1px] border-white/20 bg-white/10 text-[16px] font-normal leading-[16px] text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] 4xl:h-[48px] 4xl:w-[180px] 4xl:text-[18px] 4xl:leading-[18px]"
          >
            {t("chat_modal_closeBtn")}
          </div>
        </div>
      </Modal>
    </div>
  );
}
