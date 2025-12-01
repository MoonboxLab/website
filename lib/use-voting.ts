"use client";

import {
  readContract,
  writeContract,
  waitForTransaction,
  getAccount,
  getNetwork,
  watchNetwork,
  watchAccount,
  erc20ABI,
  erc721ABI,
} from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import {
  VOTING_CONTRACTS,
  VOTING_CONTRACT_ABI,
  ERC721_ABI,
  VOTE_CONFIG,
  type VoteType,
} from "@/constants/voting-contract";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

// 使用 @wagmi/core 的 React hooks

// 检查钱包连接状态
export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const checkConnection = useCallback(() => {
    const account = getAccount();
    setIsConnected(!!account.address);
    setAddress(account.address || null);
  }, []);

  useEffect(() => {
    checkConnection();

    const unwatchAccount = watchAccount((account) => {
      setIsConnected(!!account.address);
      setAddress(account.address || null);
    });

    return () => {
      unwatchAccount();
    };
  }, [checkConnection]);

  return { isConnected, address, checkConnection };
}

// 获取代币余额
export function useTokenBalance(
  tokenAddress: string,
  chainId: number,
  enabled: boolean = true,
) {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const { address } = useWalletConnection();

  const fetchBalance = useCallback(async () => {
    if (!address || !enabled) return;

    setLoading(true);
    try {
      const { chain } = getNetwork();
      const currentChainId = chain?.id || chainId;

      const balanceData = await readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        chainId: currentChainId,
      });

      setBalance(formatUnits(balanceData, 18));
    } catch (error) {
      console.error("获取代币余额失败:", error);
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [address, tokenAddress, chainId, enabled]);

  useEffect(() => {
    fetchBalance();

    const unwatchAccount = watchAccount(() => {
      fetchBalance();
    });

    const unwatchNetwork = watchNetwork(() => {
      fetchBalance();
    });

    return () => {
      unwatchAccount();
      unwatchNetwork();
    };
  }, [fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
}

// 获取NFT余额和ID列表
export function useNftBalance(
  nftAddress: string,
  chainId: number,
  enabled: boolean = true,
) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { address } = useWalletConnection();

  const fetchBalance = useCallback(async () => {
    if (!address || !enabled) return;

    setLoading(true);
    try {
      const { chain } = getNetwork();
      const currentChainId = chain?.id || chainId;

      const balanceData = await readContract({
        address: nftAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        chainId: currentChainId,
      });

      const balanceNum = Number(balanceData);
      setBalance(balanceNum);
    } catch (error) {
      console.error("获取NFT余额失败:", error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [address, nftAddress, chainId, enabled]);

  useEffect(() => {
    fetchBalance();

    const unwatchAccount = watchAccount(() => {
      fetchBalance();
    });

    const unwatchNetwork = watchNetwork(() => {
      fetchBalance();
    });

    return () => {
      unwatchAccount();
      unwatchNetwork();
    };
  }, [fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
}

// 代币投票hook
export function useTokenVote() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Music");

  const vote = useCallback(
    async (musicId: number, voteType: VoteType, amount: number) => {
      const account = getAccount();
      if (!account.address) {
        throw new Error("请连接钱包");
      }

      setLoading(true);
      try {
        const config = VOTE_CONFIG[voteType];
        const chainId = VOTING_CONTRACTS[config.chain].CHAIN_ID;
        const { chain } = getNetwork();
        const currentChainId = chain?.id || chainId;

        // 检查代币余额
        const balance = await readContract({
          address: config.tokenContract as `0x${string}`,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [account.address],
          chainId: currentChainId,
        });

        const amountWei = parseUnits(amount.toString(), 18);

        if (balance < amountWei) {
          throw new Error(
            `代币余额不足，当前余额: ${formatUnits(balance, 18)}`,
          );
        }

        // 检查授权额度
        const allowance = await readContract({
          address: config.tokenContract as `0x${string}`,
          abi: erc20ABI,
          functionName: "allowance",
          args: [account.address, config.contract],
          chainId: currentChainId,
        });

        if (allowance < amountWei) {
          // 需要授权
          const { hash: approveHash } = await writeContract({
            address: config.tokenContract as `0x${string}`,
            abi: erc20ABI,
            functionName: "approve",
            args: [config.contract, amountWei],
            chainId: currentChainId,
          });
          await waitForTransaction({ hash: approveHash });
        }

        // 执行投票
        const { hash } = await writeContract({
          address: config.contract,
          abi: VOTING_CONTRACT_ABI,
          functionName: "voteByToken",
          args: [BigInt(musicId), config.tokenContract, amountWei],
          chainId: currentChainId,
        });

        await waitForTransaction({ hash });
        toast.success(t("voteSuccess") || "投票成功!");

        return hash;
      } catch (error: any) {
        console.error("投票失败:", error);
        toast.error(error.message || t("voteFailed") || "投票失败");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  return { vote, loading };
}

// NFT投票hook
export function useNftVote() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Music");

  const vote = useCallback(
    async (musicId: number, nftId: number) => {
      const account = getAccount();
      if (!account.address) {
        throw new Error("请连接钱包");
      }

      setLoading(true);
      try {
        const config = VOTE_CONFIG.nobody;

        // 执行投票
        const { hash } = await writeContract({
          address: config.contract,
          abi: VOTING_CONTRACT_ABI,
          functionName: "voteByNft",
          args: [BigInt(musicId), BigInt(nftId)],
        });

        await waitForTransaction({ hash });
        toast.success(t("voteSuccess") || "投票成功!");

        return hash;
      } catch (error: any) {
        console.error("投票失败:", error);

        // 检查是否包含 "no nft" 错误
        const errorMessage = error.message || error.toString() || "";
        if (errorMessage.toLowerCase().includes("no nft")) {
          toast.error(t("noNft") || "當前錢包沒有Nobody NFT");
        } else {
          toast.error(errorMessage || t("voteFailed") || "投票失敗");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  return { vote, loading };
}

// 网络切换hook
export function useNetworkSwitch() {
  const [switching, setSwitching] = useState(false);

  const switchToChain = useCallback(async (chainId: number) => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("请安装并连接钱包");
    }

    setSwitching(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // 如果网络不存在，尝试添加网络
      if (error.code === 4902) {
        await addNetwork(chainId);
      } else {
        throw new Error(`网络切换失败: ${error.message}`);
      }
    } finally {
      setSwitching(false);
    }
  }, []);

  const addNetwork = useCallback(async (chainId: number) => {
    const networkConfig =
      chainId === 56
        ? {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "BNB Smart Chain",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: [VOTING_CONTRACTS.BSC_MAINNET.RPC_URL],
            blockExplorerUrls: ["https://bscscan.com"],
          }
        : {
            chainId: `0x${chainId.toString(16)}`,
            chainName: "Ethereum Mainnet",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [VOTING_CONTRACTS.ETH_MAINNET.RPC_URL],
            blockExplorerUrls: ["https://etherscan.io"],
          };

    await (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkConfig],
    });
  }, []);

  return { switchToChain, switching };
}
