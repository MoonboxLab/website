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
  DialogOverlay,
  DialogPortal,
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
      {/* PC UI */}
      {(mediaSize?.width || 0) > 640 && (
        <div className="relative left-0 top-0 z-10 hidden h-full w-full sm:block">
          <div className="ml-[125px] flex h-screen w-full flex-col justify-center">
            <span className="text-shadow z-50 flex-nowrap text-[72px] font-semibold leading-[72px] text-white">
              {t("auction_start_soon")}
            </span>
            <div className="z-50 mt-[30px]">
              <Image
                src={"/home_nobody_role.png"}
                alt="home_nobody_role"
                height={100}
                width={880}
                style={{ objectFit: "cover" }}
                priority
              />
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
                  <DialogTitle className="px-[16px] text-[21px]">
                    {t("auction_rules")}
                  </DialogTitle>
                  <DialogDescription className="px-[16px] py-[30px] text-[16px] text-black">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: t.raw("auction_rules_detail"),
                      }}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div className="mouse z-50">
              <div className="scroll z-50"></div>
            </div>
          </div>
          <Image
            src={"/home_auction_bg_1.png"}
            alt="home_auction_bg_1"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {/* Mobile UI */}
      <div className="relative flex h-full w-screen flex-col justify-center sm:hidden">
        <div className="flex h-screen w-full flex-col px-[16px]">
          <span className="text-shadow z-50 mt-[40%] flex-nowrap text-[36px] font-semibold leading-[36px] text-white">
            {t("auction_start_soon")}
          </span>
          <div className="z-50 mt-[20px]">
            <Image
              src={"/home_nobody_role_mobile.png"}
              alt="home_nobody_role_mobile"
              height={150}
              width={356}
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <span className="z-50 mt-[30px] flex-nowrap text-[18px] font-semibold text-white">
            {t("auction_start_time")}
          </span>
          <span className="z-50 text-[18px] font-semibold text-white">
            {t("auction_eligibility")}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <span className="z-50 mt-[20px] flex-nowrap text-[16px] font-semibold text-white underline">
                {t("view_rules")}
              </span>
            </DialogTrigger>
            <DialogContent className="max-h-[80%] max-w-[90%] overflow-scroll">
              <DialogHeader>
                <DialogTitle className="text-left text-[18px]">
                  {t("auction_rules")}
                </DialogTitle>
                <DialogDescription className="py-[20px] text-left text-[16px] text-black">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: t.raw("auction_rules_detail"),
                    }}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Image
            src={"/home_auction_bg_mobile_1.png"}
            alt="home_auction_bg_mobile_1"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      {/* PC mail modal */}
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

      {/* Mobile floating window */}
      {!showChatModal && (
        <div className="absolute bottom-[5%] left-0 right-0 z-20 sm:hidden">
          <div
            className="mx-auto mb-[10px] flex h-[56px] w-[360px] cursor-pointer items-center rounded-[12px] border-[2px] border-black bg-white px-[14px] shadow-[4px_4px_0px_#000000FF]"
            onClick={() => setShowChatModal(true)}
          >
            <Image
              src={"/home_auction.png"}
              alt="chat avatar"
              width={50}
              height={65}
            />
            <span className=" ml-[10px] text-[18px] font-semibold leading-[48px]">
              {t("participate_auction")}
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

      {/* Mobile email modal */}
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
    </div>
  );
}
