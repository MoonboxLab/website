"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import clsx from "clsx";
import Cookies from "js-cookie";
import { useSize } from "ahooks";
import { SiweMessage } from "siwe";
import { toast } from "react-toastify";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import Header from "@/components/Header";
import VoteItem from "@/components/voteItem";
import ShowItem from "@/components/showItem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  GetNonce,
  GetSubmissions,
  GetVoteDetails,
  GetVoteSum,
} from "@/service/show";
import { PostLogin } from "@/service/show";

export default function Show() {
  const domain = window.location.host;
  const origin = window.location.origin;

  const t = useTranslations("Show");
  const locale = useLocale();

  const mediaSize = useSize(document.querySelector("body"));

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const { signMessageAsync } = useSignMessage();

  type Submission = {
    id: string;
    author: string;
    description: string;
    image: string;
    duration: string;
    embed: string;
    vote_count: number;
  };

  type VoteDetail = {
    submission_author: string;
    submission_image: string;
    vote_count: number;
  };

  const [voteSum, setVoteSum] = useState<number>(0);
  const [prize, setPrize] = useState<number>(0);
  const [submissions, setSubmission] = useState<Submission[]>([]);
  const [VoteDetails, setVoteDetails] = useState<VoteDetail[]>([]);

  const [ruleDialog, setRuleDialog] = useState<boolean>(false);
  const [prizeDialog, setPrizeDialog] = useState<boolean>(false);
  const [connectDialog, setConnectDialog] = useState<boolean>(false);
  const [noNFTDialog, setNoNFTDialog] = useState<boolean>(false);

  const [checkedRules, setCheckedRules] = useState<boolean>(true);
  const [acceptedRules, setAcceptedRules] = useState(true);

  useEffect(() => {
    requestSubmissions();
    setRuleDialog(!acceptedRules);
    if (address) {
      const jwt = Cookies.get(`${address}_jwt`) as string;
      if (!jwt) {
        login(address);
      }
    }
  }, [address, setRuleDialog]);

  const requestVoteSum = async () => {
    const result = await GetVoteSum();
    if (result["code"] !== 0) {
      toast.error(result["message"]);
    } else {
      setVoteSum(result["data"]["vote_count"]);
    }
  };

  const requestSubmissions = async () => {
    const result = await GetSubmissions();
    if (result["code"] !== 0) {
      toast.error(result["message"]);
    } else {
      setSubmission(result["data"]);
    }
  };

  const requestVoteDetails = async (jwt: string) => {
    const result = await GetVoteDetails(jwt);
    if (result["code"] !== 0) {
      toast.error(result["message"]);
    } else {
      const details = result["data"];
      setVoteDetails(details);
      let voteCount = 0;
      for (let i = 0; i < details.length; i++) {
        voteCount += details[i].vote_count;
      }
      const prize = voteCount * 0.00380629;
      setPrize(prize);
    }
  };

  const login = async (address: string) => {
    const result = await GetNonce(address);
    if (result["code"] !== 0) {
      if (result["code"] !== 5003) {
        toast.error(result["message"]);
      }
    } else {
      const nonce = result["data"]["nonce"];
      if (nonce) {
        const message = createSiweMessage(address, nonce);
        if (message) {
          let signature = "";
          try {
            signature = await signMessageAsync({ message: message });
          } catch (error) {
            disconnect();
            toast.error(t("loginFail"));
            return;
          }
          const result = await PostLogin({
            message: message,
            signature: signature,
          });
          if (result["code"] !== 0) {
            toast.error(result["message"]);
          } else {
            toast.success(t("loginSuccess"));
            const jwt = result["data"]["jwt"];
            Cookies.set(`${address}_jwt`, jwt);
          }
        }
      }
    }
  };

  const createSiweMessage = (address: string, nonce: string) => {
    const message = new SiweMessage({
      domain,
      address,
      nonce: nonce,
      uri: origin,
      version: "1",
      chainId: 1,
    });
    return message.prepareMessage();
  };

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
        <div className="mx-[15px] mt-[30px] rounded-[16px] bg-white sm:mx-[60px] 4xl:mx-[160px]">
          <div className="flex h-[40px] w-[130px] items-center justify-center">
            <Image
              className="absolute"
              src={"/show_tag.svg"}
              width={130}
              height={40}
              alt="show tag"
            />
            <span className="z-10 h-[18px] text-[18px] leading-[18px] text-[#FFD600]">
              {t("serial")}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between px-[30px] pb-[30px] sm:flex-row">
            <div className="flex flex-col">
              <span className="mt-[30px] text-[36px] font-bold">
                {t("title")}
              </span>
              <div className="mt-[20px] flex items-center">
                <span className="text-[18px] font-normal text-black">
                  {t("organizer")}
                </span>
                <Image
                  src={"/show_arrow.svg"}
                  width={20}
                  height={20}
                  alt="arrow"
                />
              </div>
              <span className="mt-[6px] text-[18px] font-normal text-black">
                {t("topic")}
              </span>
              <span className="mt-[6px] text-[18px] font-normal text-black">
                {t("encourage")}
              </span>
              <span
                className="mt-[30px] cursor-pointer text-[18px] font-medium text-black underline"
                onClick={() => {
                  setRuleDialog(true);
                }}
              >
                {t("rule")}
              </span>
            </div>
            <Button
              className={clsx(
                "mt-[30px] flex h-[48px] flex-shrink-0 items-center whitespace-nowrap rounded-[12px]  bg-black px-[12px] text-[18px] text-white hover:bg-black 4xl:mt-[25px] 4xl:h-[64px] 4xl:text-[24px]",
                locale == "en"
                  ? "w-[178px] 4xl:w-[228px]"
                  : "w-[160px] 4xl:w-[180px]",
              )}
              onClick={() => {
                if (address) {
                  const jwt = Cookies.get(`${address}_jwt`) as string;
                  if (jwt) {
                    requestVoteSum();
                    requestVoteDetails(jwt);
                    setPrizeDialog(true);
                  } else {
                    setNoNFTDialog(true);
                  }
                } else {
                  setConnectDialog(true);
                }
              }}
            >
              <Image
                className="mr-[8px] w-[40px] 4xl:w-[49px]"
                src={"/show_confetti.svg"}
                width={49}
                height={41}
                alt="show confetti"
              />
              {t("prize")}
            </Button>
          </div>
        </div>

        <div className="mx-[15px] mt-[50px] sm:mx-[60px] 4xl:mx-[160px]">
          <h2 className="text-[24px] font-bold">{t("winner")}</h2>
          <div className="mt-[30px] grid w-full grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-[16px] 3xl:grid-cols-4 3xl:gap-[25px] 4xl:grid-cols-5 4xl:gap-[30px] 5xl:grid-cols-5 5xl:gap-[30px]">
            {submissions.slice(0, 5).map((item, index) => (
              <ShowItem
                key={index}
                id={item.id}
                image={item.image}
                author={item.author}
                description={item.description}
                duration={item.duration}
                embed={item.embed}
                voteCount={item.vote_count}
                winner={true}
              />
            ))}
          </div>
        </div>

        <div className="mx-[15px] mt-[50px] sm:mx-[60px] 4xl:mx-[160px]">
          <h2 className="text-[24px] font-bold">{t("submissions")}</h2>
          <div className="mt-[30px] grid w-full grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-[16px] 3xl:grid-cols-4 3xl:gap-[25px] 4xl:grid-cols-5 4xl:gap-[30px] 5xl:grid-cols-5 5xl:gap-[30px]">
            {submissions.map((item, index) => (
              <ShowItem
                key={index}
                id={item.id}
                image={item.image}
                author={item.author}
                description={item.description}
                duration={item.duration}
                embed={item.embed}
                voteCount={item.vote_count}
                winner={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* {(mediaSize?.width || 0) <= 1024 && (
        <div className="flex h-screen w-screen justify-center">
          <div className="flex flex-col items-center justify-center">
            <Image src={"/show_pc.png"} width={120} height={120} alt="pc" />
            <span className="mt-[20px] text-center text-[24px] font-medium leading-[24px] text-black">
              {t("title")}
            </span>
            <span className="mt-[10px] text-center text-[24px] font-medium leading-[24px] text-black">
              {t("pc")}
            </span>
            <Link href={"/"}>
              <div className="hover-btn-shadow mt-[80px] flex h-[48px] w-[160px] items-center justify-center rounded-[8px] border-[2px] border-black bg-white text-[18px] font-medium leading-[18px] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                HOME
              </div>
            </Link>
          </div>
        </div>
      )} */}

      {/* connect Dialog */}
      <Dialog open={connectDialog} onOpenChange={setConnectDialog}>
        <DialogContent className="flex h-[400px] max-h-[400px] w-[400px] max-w-[400px] flex-col items-center justify-center gap-0 bg-white p-0 sm:rounded-[16px]">
          <span className="text-center text-[24px] font-medium leading-[30px] text-black">
            {t("connectTips")}
          </span>
          <div
            className="hover-btn-shadow mt-[40px] flex h-[48px] w-[160px] items-center justify-center rounded-[8px] border-[2px] border-black bg-[rgba(255,214,0,1)] text-[18px] font-medium leading-[18px] shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            onClick={() => {
              setConnectDialog(false);
              openConnectModal?.();
            }}
          >
            {t("connect")}
          </div>
        </DialogContent>
      </Dialog>

      {/* No NFT Dialog */}
      <Dialog open={noNFTDialog} onOpenChange={setNoNFTDialog}>
        <DialogContent className="flex h-[400px] max-h-[400px] w-[400px] max-w-[400px] flex-col items-center justify-center gap-0 bg-white p-0 sm:rounded-[16px]">
          <Image src={"/show_sorry.jpg"} width={120} height={120} alt="sorry" />
          <span className="mt-[30px] text-center text-[30px] font-medium leading-[40px] text-black">
            {t("sorry")}
          </span>
        </DialogContent>
      </Dialog>

      {/* rule Dialog */}
      <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
        <DialogContent
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
          }}
          className="flex flex-col gap-0 rounded-[16px] bg-white p-[50px] sm:min-w-[600px]"
          showClose={acceptedRules}
        >
          <span className="text-[24px] font-normal">{t("rule")}</span>
          <ol className="mt-[40px] list-inside list-decimal space-y-[10px]">
            <li className="text-[16px] font-normal leading-[30px] text-black">
              {t("rule1")}
            </li>
            <li className="text-[16px] font-normal leading-[30px] text-black">
              {t("rule2")}
            </li>
            <li className="text-[16px] font-normal leading-[30px] text-black">
              {t("rule3")}
            </li>
            <li className="text-[16px] font-normal leading-[30px] text-black">
              {t("rule4")}
            </li>
            <li className="text-[16px] font-normal leading-[30px] text-black">
              {t("rule5")}
            </li>
          </ol>
          {!acceptedRules && (
            <div className="mt-[40px] flex items-center">
              <Checkbox
                id="agree"
                checked={checkedRules}
                onClick={() => {
                  setCheckedRules(!checkedRules);
                }}
                className="focus-visible::outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              <label
                className="ml-[10px] text-[16px] font-medium leading-none"
                htmlFor="agree"
              >
                {t("understand")}
              </label>
            </div>
          )}
          {!acceptedRules && (
            <div
              className={clsx(
                "mt-[40px] flex h-[48px] w-[140px] max-w-[240px] items-center justify-center rounded-[8px] border-[2px] border-black text-[16px] font-medium leading-[16px] xl:h-[48px] xl:max-w-[140px] xl:rounded-[8px] xl:text-[18px] xl:leading-[18px]",
                checkedRules
                  ? "hover-btn-shadow  bg-[rgba(255,214,0,1)] text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                  : "bg-[rgba(255,214,0,1)]/50 text-black/50 shadow-[4px_4px_0px_grey]",
              )}
              onClick={() => {
                if (!checkedRules) return;
                localStorage.setItem("acceptedRules", "true");
                setAcceptedRules(true);
                setRuleDialog(false);
              }}
            >
              {t("confirm")}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* prize Dialog */}
      <Dialog open={prizeDialog} onOpenChange={setPrizeDialog}>
        <DialogContent className="flex flex-col gap-0 rounded-[16px] bg-white p-0 sm:min-w-[740px]">
          <span className="ml-[20px] mt-[20px] text-[24px] font-medium text-black">
            {t("prize")}
          </span>
          <div className="flex flex-col items-center pb-[80px] pt-[80px]">
            <span className="text-[30px] font-normal leading-[30px] text-black">
              {t("congratulation")}
            </span>
            <span className="mt-[15px] text-[48px] font-bold leading-[48px] text-black">
              {t("eth", { prize: prize })}
            </span>
            <span className="mt-[15px] text-[16px] font-normal leading-[16px] text-black">
              {t("record")}
            </span>
            <a
              className="mt-[10px] text-[14px] font-normal leading-[14px] text-blue-700 underline"
              href="https://etherscan.io/tx/0xca4bfb4bb9599c2601827b382f600e3bc0a75c484a3fd466f9a8c1769e10ef5d"
              target="_blank"
            >
              0xca4bfb4bb9599c2601827b382f600e3bc0a75c484a3fd466f9a8c1769e10ef5d
            </a>
          </div>
          <div className="flex flex-col rounded-[16px] bg-gray-100 px-[20px] py-[30px]">
            <div className="flex flex-nowrap space-x-[10px] overflow-scroll">
              {VoteDetails.map((item, index) => (
                <VoteItem
                  key={index}
                  image={item.submission_image}
                  author={item.submission_author}
                  voteCount={item.vote_count}
                />
              ))}
            </div>
            <span className="mt-[30px] text-[16px] font-medium leading-[16px] text-black">
              {t("event")}
            </span>
            <span className="mt-[10px] text-[16px] font-medium leading-[16px] text-black">
              {t.rich("eventPrize", {
                votes: voteSum,
                blue: (chunks) => (
                  <span className="text-[#3B84FF]">{chunks}</span>
                ),
              })}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
