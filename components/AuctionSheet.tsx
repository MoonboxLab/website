import Image from "next/image";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger} from "@/components/ui/sheet"; //prettier-ignore
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuctionSheetProps = {
  image: string;
  name: string;
  catchphrase: string;
  owned: string;
};

export default function AuctionSheet(props: AuctionSheetProps) {
  const { image, name, catchphrase, owned } = props;

  const t = useTranslations("Home");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute right-0 top-1/2 flex h-[290px] w-[100px] -translate-y-1/2 transform flex-col items-center justify-center">
          <Image
            className="z-10"
            src={"/home_auction.png"}
            alt="acution"
            width={77}
            height={43}
          />
          <span className="z-10 ml-[10px] mt-[15px] text-center text-[18px] font-semibold leading-[21px]">
            {t("participate_auction")}
          </span>

          <Image
            src={"/home_participate_auction_bg.svg"}
            alt="participate auction"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </SheetTrigger>
      <SheetContent className="z-[300] min-w-[525px] p-[40px]">
        <div className="relative flex h-full w-full flex-col">
          <div className="z-10 flex w-full justify-between">
            <span className="text-[18px] font-semibold leading-[30px]">
              MY AUCTION
            </span>
            <SheetClose>
              <X
                className="h-[30px] w-[30px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                color="#979797"
              />
            </SheetClose>
          </div>
          <Separator className="mt-[20px] bg-gray-300" />

          <div className="absolute left-0 top-0 flex hidden h-full w-full items-center justify-center">
            <div className="hover-btn-shadow relative ml-[10px] inline-flex h-[64px] w-[240px] items-center justify-center rounded-[10px] border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <span className="text-[18px] font-semibold leading-[30px]">
                Connect Wallet
              </span>
            </div>
          </div>

          {/* 拍卖前-登录未输入邀请码 */}
          <div className="flex hidden flex-col">
            <span className="mt-[60px] text-[24px] font-semibold leading-[24px]">
              0xC6…02K5
            </span>
            <span className="mt-[20px] text-[16px] leading-[24px]">
              You are currently not qualified to participate in the auction.
              Please follow the official social media to learn how to obtain the
              auction invitation code. The subsequent Nobody series will also be
              released, so please pay attention.
            </span>
            <div className="mt-[60px] flex flex-col items-start">
              <span className="text-[16px]">Invitation code</span>
              <Input
                placeholder={t("type_or_paster")}
                className="mt-[10px] h-[56px] w-full rounded-lg text-[18px] font-normal leading-[18px] outline-none placeholder:text-[18px] placeholder:font-normal placeholder:text-black/20 focus:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none active:ring-0"
                // ref={inputRef}
              />
              <span className="mt-[10px] hidden w-full text-left text-[14px] leading-[14px] text-red-500">
                *邀請碼輸入錯誤，請重新輸入
              </span>
              <span className="mt-[20px] text-[16px]">E-mail</span>
              <Input
                placeholder={t("email_modal_input_placeholder")}
                className="mt-[10px] h-[56px] w-full rounded-lg  text-[18px] font-normal leading-[18px] outline-none placeholder:text-[18px] placeholder:font-normal placeholder:text-black/20 focus:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none active:ring-0"
                // ref={inputRef}
              />
              <span className="mt-[10px] w-full text-left text-[14px] leading-[14px] text-red-500">
                *郵箱格式輸入錯誤，請核對
              </span>
            </div>
            <Button className="mt-[60px] h-[56px] w-full rounded-lg text-[18px]">
              {t("sure")}
            </Button>
            <span className="mt-[20px] w-full px-[50px] text-center text-[16px] leading-[24px]">
              If you win the bid in the auction, a card signed by Star Master
              for your winning bid will be sent to your mailbox
            </span>
          </div>

          {/* 拍卖前-登录已绑定邀请码 */}
          <div className="flex flex-col">
            <span className="mt-[60px] text-[24px] font-semibold leading-[24px]">
              0xC6…02K5
            </span>
            <span className="mt-[20px] text-[16px] leading-[24px]">
              Welcome to participate in the auction, please bid your price
              during the bidding time. You have 2 invitation codes. Share the
              invitation codes with your friends to participate in the auction
              together.
            </span>
            <div className="mt-[60px] flex flex-col items-start">
              
            </div>
          </div>

          <SheetClose>
            <div className="absolute -left-[140px] top-1/2 flex h-[290px] w-[100px] -translate-y-1/2 transform flex-col items-center justify-center">
              <Image
                className="z-10"
                src={"/home_auction.png"}
                alt="acution"
                width={77}
                height={43}
              />
              <span className="z-10 ml-[10px] mt-[15px] text-center text-[18px] font-semibold leading-[21px]">
                {t("participate_auction")}
              </span>

              <Image
                src={"/home_participate_auction_bg.svg"}
                alt="participate auction"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
