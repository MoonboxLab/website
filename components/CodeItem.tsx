import Image from "next/image";
import { useTranslations } from "next-intl";

type CodeItemProps = {
  index: number;
  code: string;
  used: boolean;
};

export default function CodeItem(props: CodeItemProps) {
  const t = useTranslations("Home");
  const { index, code, used } = props;

  return (
    <div className="flex w-full flex-col">
      <span className="text-[16px]">
        {t("invitation_code")} {index}
      </span>
      <div className="mt-[10px] flex h-[80px] w-full items-center justify-center rounded-lg bg-black/5 pl-[28px] pr-[38px]">
        {used ? (
          <span className="text-[24px] text-gray-300">{code}</span>
        ) : (
          <span className="text-[24px]">{code}</span>
        )}
        <Image
          className="ml-[20px]"
          src={"/code_copy.png"}
          alt="copy"
          width={16}
          height={16}
          priority
        />
        {used ? (
          <div className="flex w-full items-center justify-end">
            <Image
              src={"/code_used.svg"}
              alt="copy"
              width={16}
              height={16}
              priority
            />
            <span className="ml-[8px] text-[16px]">{t("used")}</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-end">
            <Image
              src={"/code_unused.svg"}
              alt="copy"
              width={16}
              height={16}
              priority
            />
            <span className="ml-[8px] text-[16px]">{t("unused")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
