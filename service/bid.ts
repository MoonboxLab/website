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

const list = [
  {
    id: 1,
    name: "card1",
    img: "/bid/bid-card.webp",
    price: "100",
    coin: "USDT",
    desc: "desc1",
  },
  {
    id: 2,
    name: "card2",
    img: "/bid/bid-card.webp",
    price: "100",
    coin: "USDT",
    desc: "desc2",
  },
  {
    id: 3,
    name: "card3",
    img: "/bid/bid-card.webp",
    price: "100",
    coin: "USDT",
    desc: "desc3",
  },
  {
    id: 4,
    name: "card4",
    img: "/bid/bid-card.webp",
    price: "100",
    coin: "USDT",
    desc: "desc4",
  },
  {
    id: 5,
    name: "card5",
    img: "/bid/bid-card.webp",
    price: "100",
    coin: "USDT",
    desc: "desc5",
  },
];

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

export function useBigList(): [typeof dataset, boolean, typeof fetchData] {
  const [dataset, setDataset] = useState<
    {
      id: number;
      name: string;
      img: string;
      price: string;
      coin: string;
      desc: string;
      expireTime: number;
      count: number;
      tokenId: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const { chain } = getNetwork();
      const data = (await readContract({
        chainId: chain?.id
          ? chain?.id
          : process.env.NEXT_PUBLIC_TEST_ENV === "true"
          ? sepolia.id
          : mainnet.id,
        address:
          chain?.id === sepolia.id ||
          process.env.NEXT_PUBLIC_TEST_ENV === "true"
            ? "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2"
            : "0x000",
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
      const idByGroup = list.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<number, (typeof list)[number]>,
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
          })),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
): [typeof details, boolean, typeof fetchBigItem] {
  const [dataset, loading, fetchData] = useBigList();
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

  const fetchBidData = async () => {
    await fetchData();
    const item = dataset.find((item) => item.id === id);
    setDetails(item);
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

export function useApprove(): [
  string | null,
  boolean,
  () => Promise<void>,
  () => Promise<void>,
] {
  const [allowance, setAllowance] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  async function approveToken() {
    setApproveLoading(true);

    const { chain } = getNetwork();
    const contractAddress =
      chain?.id === sepolia.id || process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2"
        : "0x000";
    const tokenAddress =
      chain?.id === sepolia.id || process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0xe4160b3b50806053fdE6e17a47799674eB56481e"
        : "0x000";
    try {
      const { hash } = await writeContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "approve",
        args: [
          contractAddress,
          BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"),
        ],
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
      chain?.id === sepolia.id || process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2"
        : "0x000";
    const tokenAddress =
      chain?.id === sepolia.id || process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0xe4160b3b50806053fdE6e17a47799674eB56481e"
        : "0x000";
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

export function useBidSubmit(): [boolean, typeof submit] {
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
      chain?.id === sepolia.id || process.env.NEXT_PUBLIC_TEST_ENV === "true"
        ? "0x8efe9236647047Fb2D5a5b43D653b69F1A7677d2"
        : "0x000";
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