import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type CodeItemProps = {
  index: number;
  code: string;
  used: boolean;
};

export default function CodeItem(props: CodeItemProps) {
  const { index, code, used } = props;

  return (
    <div className="flex flex-col">
      <span className="text-[16px]">Invitation code {index}</span>
      <div className="flex">
      <span className="text-[16px]">{code}</span>
      </div>
    </div>
  );
}
