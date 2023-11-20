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
      <div className="mx-[15px] my-[15px] flex h-[448px] w-[320px] flex-col rounded-xl bg-white">
        <Image
          src={image}
          alt="aution item image"
          width={320}
          height={320}
          priority
        />
        <div className="flex flex-col px-[16px] py-[20px]">
          <span className="text-[18px] leading-[18px]">{name}</span>
          <span className="mt-[15px]  text-[14px] leading-[14px]">
            {catchphrase}
          </span>
          <Separator className="mt-[15px] bg-gray-200" />
          {owned ? (
            <span className="mt-[15px] text-[14px] leading-[14px]">
              <b>Owned</b> {owned}
            </span>
          ) : (
            <span className="mt-[15px] text-[14px] leading-[14px]  text-gray-300">
              Owned Wait!
            </span>
          )}
        </div>
      </div>
      {owned && (
        <Image
          className="absolute bottom-[25px] right-[25px]"
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
