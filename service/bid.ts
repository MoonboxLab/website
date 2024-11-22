import {
  erc20ABI,
  getNetwork,
  mainnet,
  readContract,
  sepolia,
  writeContract,
  waitForTransaction,
  getAccount,
  watchNetwork,
  watchAccount,
} from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const list = {
  bid: [
    {
      id: 1,
      name: "card1",
      img: "/bid/card1.png",
      price: "100",
      coin: "USDT",
      desc: "desc1",
    },
    {
      id: 2,
      name: "card2",
      img: "/bid/card2.png",
      price: "100",
      coin: "USDT",
      desc: "desc2",
    },
    {
      id: 3,
      name: "card3",
      img: "/bid/card3.png",
      price: "100",
      coin: "USDT",
      desc: "desc3",
    },
    {
      id: 4,
      name: "card4",
      img: "/bid/card4.png",
      price: "100",
      coin: "USDT",
      desc: "desc4",
    },
    {
      id: 5,
      name: "card5",
      img: "/bid/card5.png",
      price: "100",
      coin: "USDT",
      desc: "desc5",
    },
    {
      id: 6,
      name: "card6",
      img: "/bid/card6.png",
      price: "100",
      coin: "USDT",
      desc: "desc6",
    },
    {
      id: 7,
      name: "card7",
      img: "/bid/card7.png",
      price: "100",
      coin: "USDT",
      desc: "desc7",
    },
    {
      id: 8,
      name: "card8",
      img: "/bid/card8.png",
      price: "100",
      coin: "USDT",
      desc: "desc8",
    },
    {
      id: 9,
      name: "card9",
      img: "/bid/card9.png",
      price: "100",
      coin: "USDT",
      desc: "desc9",
    },
    {
      id: 10,
      name: "card10",
      img: "/bid/card10.png",
      price: "100",
      coin: "USDT",
      desc: "desc10",
    },
    {
      id: 11,
      name: "card11",
      img: "/bid/card11.png",
      price: "100",
      coin: "USDT",
      desc: "desc11",
    },
  ],
  impact: [
    {
      id: 1,
      name: "card1",
      img: "/impact/card1.png",
      price: "100",
      coin: "USDT",
      desc: "desc1",
    },
    {
      id: 2,
      name: "card2",
      img: "/impact/card2.png",
      price: "100",
      coin: "USDT",
      desc: "desc2",
    },
    {
      id: 3,
      name: "card3",
      img: "/impact/card3.png",
      price: "100",
      coin: "USDT",
      desc: "desc3",
    },
    {
      id: 4,
      name: "card4",
      img: "/impact/card4.png",
      price: "100",
      coin: "USDT",
      desc: "desc4",
    },
    {
      id: 5,
      name: "card5",
      img: "/impact/card5.png",
      price: "100",
      coin: "USDT",
      desc: "desc5",
    },
  ],
};

const messageKey = [
  {
    find: "owner query for nonexistent token",
    msgKey: "nftNonexistentToken",
  },
  {
    find: "you are not the nft owner",
    msgKey: "notOwnerNFT",
  },
  {
    find: "Auction item is not exists",
    msgKey: "auctionItemNotExists",
  },
  {
    find: "This auction item was expired",
    msgKey: "auctionItemExpired",
  },
  {
    find: "Bid price must be an integer",
    msgKey: "bidPriceMustBeInteger",
  },
  {
    find: "Starting price is 10USDT",
    msgKey: "startingPriceTenUSDT",
  },
  {
    find: "The Min Bid Increment is 1USDT",
    msgKey: "minBidIncrementOneUSDT",
  },
  {
    find: "your NFT have bidden one role",
    msgKey: "nftBiddenOneRole",
  },
];

const addressByType = {
  bid: {
    sepolia: "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2",
    mainnet: "0xae65729956b60e0ddc2973db0cc8d04cf947880e",
  },
  impact: {
    sepolia: "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2",
    mainnet: "0xae65729956b60e0ddc2973db0cc8d04cf947880e",
  },
} as Record<
  "bid" | "impact",
  { sepolia: `0x${string}`; mainnet: `0x${string}` }
>;

export type AuctionItem = {
  id: number;
  name: string;
  img: string;
  price: string;
  coin: string;
  desc: string;
  expireTime: number;
  startTime: number;
  count: number;
  tokenId: number;
};
const date = {
  bid: {
    startTime: new Date("2024-10-10T10:00:00.000Z").getTime() / 1000,
  },
  impact: {
    startTime: new Date("2024-11-26T15:59:59.000Z").getTime() / 1000,
  },
};

export function useBigList(
  type: "bid" | "impact" = "bid",
): [typeof dataset, boolean, typeof fetchData] {
  const [dataset, setDataset] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData(changeLoading = true) {
    if (changeLoading) {
      setLoading(true);
    }
    try {
      const { chain } = getNetwork();
      const data = (await readContract({
        chainId: chain?.id
          ? chain?.id
          : process.env.NEXT_PUBLIC_TEST_ENV === "true"
          ? sepolia.id
          : mainnet.id,
        address:
          chain?.id === sepolia.id &&
          process.env.NEXT_PUBLIC_TEST_ENV === "true"
            ? addressByType[type].sepolia
            : addressByType[type].mainnet,
        abi: [
          {
            inputs: [],
            name: "getAllItems",
            outputs: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "expireTm",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "bider",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "count",
                    type: "uint256",
                  },
                ],
                internalType: "struct Auction.BidInfo[]",
                name: "",
                type: "tuple[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "getAllItems",
        args: [],
      })) as any[];
      const idByGroup = list[type].reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<number, (typeof list)[typeof type][number]>,
      );
      setDataset(
        data
          .filter((item) => idByGroup[item.id])
          .map((item) => ({
            ...idByGroup[item.id],
            price: formatUnits(item.price, 6),
            expireTime: item.expireTm.toString(),
            tokenId: item.tokenId.toString(),
            count: item.count.toString(),
            startTime: date[type].startTime,
          })),
      );
    } catch (error) {
      console.log(error);
    } finally {
      if (changeLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  watchNetwork(() => {
    fetchData();
  });
  return [dataset, loading, fetchData];
}

export function useBigItem(
  id: number,
  type: "bid" | "impact" = "bid",
): [typeof details, boolean, typeof fetchBigItem] {
  const [dataset, loading, fetchData] = useBigList(type);
  const [details, setDetails] = useState<{
    id: number;
    name: string;
    img: string;
    price: string;
    coin: string;
    desc: string;
    expireTime: number;
    count: number;
    tokenId: number;
  }>();

  const fetchBidData = async (changeLoading = true) => {
    await fetchData(changeLoading);
  };
  const fetchBigItem = useCallback(fetchBidData, [dataset, id]);

  useEffect(() => {
    const item = dataset.find((item) => item.id === id);
    setDetails(item);
  }, [dataset]);

  watchNetwork(() => {
    fetchBigItem();
  });
  watchAccount(() => {
    fetchBigItem();
  });
  return [details, loading, fetchBigItem];
}

export function useApprove(
  type: "bid" | "impact" = "bid",
): [string | null, boolean, () => Promise<void>, () => Promise<void>] {
  const [allowance, setAllowance] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  async function approveToken() {
    setApproveLoading(true);

    const { chain } = getNetwork();
    const contractAddress =
      chain?.id === sepolia.id && process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2"
        : "0xae65729956b60e0ddc2973db0cc8d04cf947880e";
    const tokenAddress =
      chain?.id === sepolia.id && process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0xe4160b3b50806053fdE6e17a47799674eB56481e"
        : "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    try {
      const { hash } = await writeContract({
        address: tokenAddress,
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "payable",
            inputs: [
              {
                name: "spender",
                type: "address",
              },
              {
                name: "tokenId",
                type: "uint256",
              },
            ],
            outputs: [],
          },
        ],
        functionName: "approve",
        args: [contractAddress, BigInt(100000000 * 1e6)],
        value: BigInt(0),
      });
      await waitForTransaction({ hash });
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setApproveLoading(false);
    }
  }

  async function fetchAllowance() {
    const { chain } = getNetwork();
    const account = getAccount();
    if (!account.address) {
      return;
    }
    const contractAddress =
      chain?.id === sepolia.id && process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? addressByType[type].sepolia
        : addressByType[type].mainnet;
    const tokenAddress =
      chain?.id === sepolia.id && process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0xe4160b3b50806053fdE6e17a47799674eB56481e"
        : "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const data = await readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account.address, contractAddress],
      chainId: chain?.id
        ? chain?.id
        : process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? sepolia.id
        : mainnet.id,
    });
    setAllowance(formatUnits(data, 6));
  }

  useEffect(() => {
    fetchAllowance();
  }, []);
  watchNetwork(() => {
    fetchAllowance();
  });
  watchAccount(() => {
    fetchAllowance();
  });

  return [allowance, approveLoading, approveToken, fetchAllowance];
}

export function useBidSubmit(
  type: "bid" | "impact" = "bid",
): [boolean, typeof submit] {
  const [bidLoading, setBidLoading] = useState(false);
  const t = useTranslations("Bid");

  async function submit(id: number, price: string, tokenId: string) {
    if (!price || !tokenId || !Number(price)) {
      if (!tokenId) {
        toast.error(t("requireNFT"));
      }
      return;
    }
    setBidLoading(true);
    const { chain } = getNetwork();
    const contractAddress =
      chain?.id === sepolia.id && process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? addressByType[type].sepolia
        : addressByType[type].mainnet;
    try {
      const { hash } = await writeContract({
        address: contractAddress,
        value: BigInt(0),
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "_id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "bid",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "bid",
        args: [BigInt(id), BigInt(tokenId), parseUnits(price, 6)],
      });
      await waitForTransaction({ hash });
    } catch (error: any) {
      console.error(error);
      console.table(error);
      const code = error.cause.code;
      if (code === 4001) {
        toast.error(t("userRejected"));
      } else {
        const msgKey = messageKey.find((item) =>
          error.message.includes(item.find),
        );
        toast.error(t("bidFail") + ": " + t(msgKey?.msgKey));
      }
      throw error;
    } finally {
      setBidLoading(false);
    }
  }

  return [bidLoading, submit];
}
