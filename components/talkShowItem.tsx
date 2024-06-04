import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

import clsx from "clsx";
import Cookies from "js-cookie";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { Minus, Plus, HelpCircle } from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { formatAddress } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"; //prettier-ignore

import { GetVoteQuato, PostVote } from "@/service/talkshow";

type ShowItemProps = {
  id: string;
  image: string;
  author: string;
  description: string;
  duration: string;
  embed: string;
  voteCount: number;
};

export default function ShowItem(props: ShowItemProps) {
  const { id, image, author, description, duration, embed, voteCount } = props;

  const t = useTranslations("TalkShow");

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [votes, setVotes] = useState(1);
  const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
  const [avaliableVotes, setAvaliableVotes] = useState(0);

  const [connectDialog, setConnectDialog] = useState<boolean>(false);
  const [noNFTDialog, setNoNFTDialog] = useState<boolean>(false);

  const [voteCompleteDialog, setVoteCompleteDialog] = useState<boolean>(false);
  const [votingDialog, setVotingDialog] = useState<boolean>(false);
  const [voteTooltip, setVoteTooltip] = useState<boolean>(false);

  const getAvaliableVotes = async (jwt: string) => {
    const result = await GetVoteQuato(jwt);
    if (result["code"] !== 0) {
      toast.error(result["message"]);
    } else {
      setAvaliableVotes(result["data"]["vote_quota"]);
    }
  };

  const submitVotes = async (jwt: string) => {
    const result = await PostVote(jwt, {
      submission_id: id,
      vote_count: votes,
    });
    if (result["code"] !== 0) {
      toast.error(result["message"]);
    } else {
      setCurrentVoteCount(currentVoteCount + votes);
      setVotingDialog(false);
      setVoteCompleteDialog(true);
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-white p-[10px] sm:p-[20px] shadow">
      <Dialog>
        <DialogTrigger className="flex items-start">
          <div className="relative w-full">
            <Image
              alt="submission"
              className="h-auto w-full rounded-lg"
              height="203"
              width="345"
              src={image}
              style={{
                aspectRatio: "16/9",
                objectFit: "cover",
              }}
            />
            <span className="absolute bottom-[10px] left-[10px] z-10 text-[14px] text-white">
              {duration}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="flex min-w-[960px] flex-col gap-0 rounded-[16px] bg-white p-[30px]">
          <div className="flex">
            <span className="text-[18px] font-medium text-black">
              {t("author", { author })}
            </span>
            <span className="ml-[16px] text-[18px] font-medium text-[#3B84FF]">
              {currentVoteCount}
            </span>
            <span className="ml-[5px] text-[18px] font-medium text-black">
              {t("votes")}
            </span>
          </div>
          <iframe
            className="mt-[20px] h-[506px] w-[900px] rounded-xl"
            src={embed}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <span className="mt-[20px] text-[16px] font-medium text-black">
            {description}
          </span>
        </DialogContent>
      </Dialog>
      <span className="mt-[20px] text-[16px] font-semibold 4xl:text-[18px]">
        {author}
      </span>
      <p className="mt-[10px] truncate text-[14px] text-gray-600 4xl:text-[16px]">
        {description}
      </p>
      <div className="mt-[30px] flex h-[40px] items-center justify-between">
        <Button
          className="flex-shrink-0 h-[30px] w-[100px] bg-[#FFD600] text-[16px] text-black hover:bg-[#FFD600] sm:h-[40px] sm:w-[120px]"
          onClick={() => {
            if (address) {
              const jwt = Cookies.get(`${address}_jwt`) as string;
              if (jwt) {
                setVotes(1);
                getAvaliableVotes(jwt);
                setVotingDialog(true);
              } else {
                setNoNFTDialog(true);
              }
            } else {
              setConnectDialog(true);
            }
          }}
        >
          {t("vote")}
        </Button>
        <div>
          <span className="text-[18px] font-medium sm:text-[24px] 4xl:text-[36px]">
            {currentVoteCount}
          </span>
          <span className="ml-[5px] text-[16px] font-medium 4xl:text-[18px]">
            {t("votes")}
          </span>
        </div>
      </div>

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

      {/* voting Dialog */}
      <Dialog open={votingDialog} onOpenChange={setVotingDialog}>
        <DialogContent className="flex w-[385px] max-w-[385px] flex-col gap-0 rounded-[16px] bg-white px-0 py-[24px]">
          <span className="px-[20px] text-[24px] font-medium leading-[24px] text-black">
            {t("vote")}
          </span>
          <div className="mt-[20px] flex flex-col bg-gray-100 p-[20px]">
            <Image
              alt="submission"
              className="h-auto w-full rounded-lg"
              height="203"
              width="345"
              src={image}
              style={{
                aspectRatio: "16/9",
                objectFit: "cover",
              }}
            />
            <div className="mt-[10px] flex justify-between">
              <span className="text-[18px] font-medium text-black">
                {t("author", { author })}
              </span>
              <div>
                <span className="ml-[16px] text-[18px] font-medium text-[#3B84FF]">
                  {currentVoteCount}
                </span>
                <span className="ml-[5px] text-[18px] font-medium text-black">
                  {t("votes")}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-[40px] flex justify-between px-[20px]">
            <span className="text-[18px] font-medium leading-[24px] text-black">
              {t("address")}
            </span>
            <span className="text-[18px] font-normal leading-[24px] text-black">
              {formatAddress(address, 4)}
            </span>
          </div>
          <div className="mt-[20px] flex justify-between px-[20px]">
            <div className="flex items-center">
              <span className="text-[18px] font-medium leading-[24px] text-black">
                {t("available")}
              </span>
              <TooltipProvider delayDuration={200}>
                <Tooltip
                  defaultOpen={false}
                  open={voteTooltip}
                  onOpenChange={setVoteTooltip}
                >
                  <TooltipTrigger asChild>
                    <HelpCircle
                      className="ml-[5px] h-[20px] w-[20px]"
                      color="gray"
                      onClick={() => {
                        setVoteTooltip(true);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="ml-[180px] bg-black py-[10px]">
                    <p className="text-[14px] font-medium leading-[18px] text-white">
                      {t.rich("availableDescription", { br: () => <br /> })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-[18px] font-medium leading-[24px] text-black">
              {avaliableVotes}
            </span>
          </div>
          <div className="mt-[20px] flex justify-between px-[20px]">
            <span className="text-[18px] font-medium leading-[24px] text-black">
              {t("voteCount")}
            </span>
            <div className="flex items-center">
              <Button className="bg-white px-1 py-1 text-lg font-semibold text-gray-600 hover:bg-white">
                <Minus
                  className="h-5 w-5"
                  onClick={() => {
                    if (votes <= 1) return;
                    setVotes((prev) => prev - 1);
                  }}
                />
              </Button>
              <Input
                readOnly={true}
                value={votes}
                defaultValue={1}
                className="h-[32px] w-[48px] bg-gray-200 text-center text-[18px] font-normal outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-white px-1 py-1 text-lg font-semibold text-gray-600 hover:bg-white">
                <Plus
                  className="h-5 w-5"
                  onClick={() => {
                    if (votes >= avaliableVotes) return;
                    setVotes((prev) => prev + 1);
                  }}
                />
              </Button>
            </div>
          </div>
          <div
            className={clsx(
              "mx-[20px] mt-[40px] flex h-[48px] w-[340px] items-center justify-center rounded-[8px] border-[2px] border-black text-[18px] font-medium leading-[18px]",
              votes <= avaliableVotes
                ? "hover-btn-shadow  bg-[rgba(255,214,0,1)] text-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                : "bg-[rgba(255,214,0,1)]/50 text-black/50 shadow-[4px_4px_0px_grey]",
            )}
            onClick={() => {
              if (votes > avaliableVotes) {
                return;
              }
              const jwt = Cookies.get(`${address}_jwt`) as string;
              if (jwt) {
                submitVotes(jwt);
              }
            }}
          >
            {t("confirmVote")}
          </div>
        </DialogContent>
      </Dialog>

      {/* vote complete Dialog */}
      <Dialog open={voteCompleteDialog} onOpenChange={setVoteCompleteDialog}>
        <DialogContent className="flex flex-col items-center gap-0 p-[80px]">
          <Image
            alt="complete"
            height="120"
            width="120"
            src={"/vote_complete.svg"}
          />
          <span className="mt-[40px] text-[30px] font-medium">
            {t("complete")}
          </span>
          <span className="mt-[20px] text-center text-[18px] font-medium">
            {t.rich("completeDescription", {
              voteCount: votes,
              author: author,
              blue: (chunks) => (
                <span className="text-[#3B84FF]">{chunks}</span>
              ),
            })}
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
}
