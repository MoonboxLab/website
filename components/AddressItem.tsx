import Image from "next/image";

type AddressItemProps = {
  address: string;
  value: string;
  index: number;
  all: boolean;
};

export default function AddressItem(props: AddressItemProps) {
  const { address, value, index, all } = props;

  return (
    <div className="relative my-[10px] h-[40px] w-full">
      <div className="left-0 top-0 flex h-full w-full items-center">
        <span className="z-10 w-[32px] text-center text-[16px] font-semibold leading-[16px] text-white sm:text-[18px] sm:leading-[18px]">
          {index}
        </span>
        <div className="grid h-full grid-cols-1 sm:grid-cols-[auto,1fr]">
          {all ? (
            <span className="ml-[10px] text-left text-[21px] font-semibold leading-[21px] text-black sm:ml-[20px] sm:text-center sm:text-[24px] sm:leading-[40px]">
              {value}
            </span>
          ) : (
            <span className="ml-[10px] text-left text-[21px] font-semibold leading-[21px] text-white sm:ml-[20px] sm:text-center sm:text-[24px] sm:leading-[40px]">
              {value}
            </span>
          )}
          <span className="ml-[10px] text-center text-[12px] leading-[12px] text-gray-400 sm:ml-[20px] sm:text-[16px] sm:leading-[40px]">
            {address}
          </span>
        </div>
      </div>
      {index === 1 && (
        <Image
          className="absolute left-0 top-[2px]"
          src={"/auction_address_1.svg"}
          alt="auction_address_1"
          width={32}
          height={40}
          priority
        />
      )}
      {index === 2 && (
        <Image
          className="absolute left-0 top-[2px]"
          src={"/auction_address_2.svg"}
          alt="auction_address_2"
          width={32}
          height={40}
          priority
        />
      )}
      {index === 3 && (
        <Image
          className="absolute left-0 top-[2px]"
          src={"/auction_address_3.svg"}
          alt="auction_address_3"
          width={32}
          height={40}
          priority
        />
      )}
      {index !== 1 && index !== 2 && index !== 3 && (
        <Image
          className="absolute left-0 top-[2px]"
          src={"/auction_address_other.png"}
          alt="auction_address_other"
          width={32}
          height={40}
          priority
        />
      )}
    </div>
  );
}