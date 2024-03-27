import Image from "next/image";
import { useTranslations } from "next-intl";

type VoteItemProps = {
  image: string;
  author: string;
  voteCount: number;
};

export default function VoteItem(props: VoteItemProps) {
  const { image, author, voteCount } = props;

  const t = useTranslations("Show");

  return (
    <div className="flex h-[150px] w-[140px] flex-shrink-0 flex-col rounded-[8px] bg-white pb-[20px] pl-[10px] pr-[10px] pt-[10px]">
      <Image
        alt="submission"
        className="h-auto w-full rounded-lg"
        height="70"
        width="120"
        src={image}
        style={{
          aspectRatio: "16/9",
          objectFit: "cover",
        }}
      />
      <span className="mt-[10px] truncate text-[14px] font-medium leading-[14px] text-gray-400">
        {author}
      </span>
      <span className="mt-[10px] text-[14px] font-medium leading-[14px] ">
        {t("voted", { voteCount })}
      </span>
    </div>
  );
}
