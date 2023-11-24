import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type AuctionItemProps = {
  image: string;
  name: string;
  catchphrase: string;
  owned: string;
};

export default function AuctionItem(props: AuctionItemProps) {
  const { image, name, catchphrase, owned } = props;

  return (
    <div className="relative">
      <div className="flex h-full w-full flex-col rounded-xl bg-white">
        <Image
          className="w-full"
          src={image}
          alt="aution item image"
          width={320}
          height={320}
          priority
        />
        <div className="flex flex-col px-[10px] py-[10px] sm:px-[16px] sm:py-[20px]">
          <span className="text-[16px] font-semibold leading-[16px] sm:text-[18px] sm:leading-[18px]">
            {name}
          </span>
          <span className="mt-[10px] text-[12px] leading-[12px] sm:mt-[15px] sm:text-[14px] sm:leading-[14px]">
            <i>{catchphrase}</i>
          </span>
          <Separator className="mt-[10px] bg-gray-200 sm:mt-[15px]" />
          {owned ? (
            <span className="mt-[10px] text-[12px] leading-[12px] sm:mt-[15px] sm:text-[14px] sm:leading-[14px]">
              <b>Owned</b> {owned}
            </span>
          ) : (
            <span className="mt-[10px] text-[12px] leading-[12px] text-gray-300 sm:mt-[15px] sm:text-[14px] sm:leading-[14px]">
              Owned Wait!
            </span>
          )}
        </div>
      </div>
      {owned && (
        <Image
          className="absolute bottom-[5px] right-[5px] sm:bottom-[25px] sm:right-[25px]"
          src={"/item_auctioned.png"}
          alt="item autioned"
          width={64}
          height={64}
          priority
        />
      )}
    </div>
  );
}
