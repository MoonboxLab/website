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
import { checkApiResponse } from "@/lib/api-interceptor";

// 使用 @wagmi/core 的 React hooks

// 根据 chainId 获取对应的合约配置
function getContractByChainId(
  chainId: number | undefined,
  contractType: "BSC_MAINNET" | "ETH_MAINNET",
):
  | typeof VOTING_CONTRACTS.BSC_MAINNET
  | typeof VOTING_CONTRACTS.ETH_MAINNET
  | typeof VOTING_CONTRACTS.BSC_TESTNET
  | typeof VOTING_CONTRACTS.ETH_SEPOLIA {
  // 如果 chainId 匹配，返回对应配置
  if (chainId === VOTING_CONTRACTS.BSC_MAINNET.CHAIN_ID) {
    return VOTING_CONTRACTS.BSC_MAINNET;
  }
  if (chainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID) {
    return VOTING_CONTRACTS.BSC_TESTNET;
  }
  if (chainId === VOTING_CONTRACTS.ETH_MAINNET.CHAIN_ID) {
    return VOTING_CONTRACTS.ETH_MAINNET;
  }
  if (chainId === VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID) {
    return VOTING_CONTRACTS.ETH_SEPOLIA;
  }
  // 如果 chainId 不匹配，返回默认链
  return contractType === "BSC_MAINNET"
    ? VOTING_CONTRACTS.BSC_MAINNET
    : VOTING_CONTRACTS.ETH_MAINNET;
}

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
      const currentChainId = chain?.id;

      // 代币都在 BSC 主网，根据当前链选择配置，如果链ID不对，使用默认链（BSC）
      const contractConfig = getContractByChainId(
        currentChainId,
        "BSC_MAINNET",
      );
      const targetChainId = contractConfig.CHAIN_ID;

      // 使用传入的代币地址（应该都是 BSC 的代币地址）
      const balanceData = await readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        chainId: targetChainId,
      });

      setBalance(formatUnits(balanceData, 18));
    } catch (error) {
      console.error("获取代币余额失败:", error);
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [address, tokenAddress, enabled]);

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
      const currentChainId = chain?.id;

      // 根据当前链选择配置，如果链ID不对，使用默认链（ETH）
      const contractConfig = getContractByChainId(
        currentChainId,
        "ETH_MAINNET",
      );
      const targetChainId = contractConfig.CHAIN_ID;

      // 使用传入的 NFT 地址
      const balanceData = await readContract({
        address: nftAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        chainId: targetChainId,
      });

      const balanceNum = Number(balanceData);

      // 获取已投票数
      let votedCount = 0;
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (token && user?.id) {
          const response = await fetch("/api/music/vote/nft", {
            headers: {
              Authorization: `Bearer ${token}`,
              uid: user.id,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && typeof data.data === "number") {
              votedCount = data.data;
            }
          }
        }
      } catch (error) {
        // 如果获取已投票数失败，只记录错误，不影响余额显示
        console.error("获取已投票数失败:", error);
      }

      // 减去已投票数，确保不为负数
      const finalBalance = Math.max(0, balanceNum - votedCount);
      setBalance(finalBalance);
    } catch (error) {
      console.error("获取NFT余额失败:", error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [address, nftAddress, enabled]);

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

// 根据 voteType 和当前链获取对应的代币地址和链ID
function getTokenAddressByVoteType(
  voteType: VoteType,
  currentChainId: number | undefined,
): { tokenAddress: string; chainId: number } {
  const config = VOTE_CONFIG[voteType];
  const defaultChainType: "BSC_MAINNET" | "ETH_MAINNET" =
    config.chain === "BSC_MAINNET" ? "BSC_MAINNET" : "ETH_MAINNET";

  // 根据当前链选择配置
  const contractConfig = getContractByChainId(currentChainId, defaultChainType);
  const targetChainId = contractConfig.CHAIN_ID;

  // 根据当前链选择对应的代币地址
  let targetTokenAddress = config.tokenContract;
  if (config.chain === "BSC_MAINNET") {
    // BSC 代币：根据当前链选择主网或测试网地址
    if (currentChainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID) {
      // 当前是测试链，使用测试链的代币地址
      if (voteType === "aice") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE;
      } else if (voteType === "fir") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_FIR;
      } else if (voteType === "usdt") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_USDT;
      }
    }
    // 否则使用主网地址（config.tokenContract 已经是主网地址）
  }

  return { tokenAddress: targetTokenAddress, chainId: targetChainId };
}

// 根据 voteType 获取代币余额
export function useTokenBalanceByVoteType(
  voteType: VoteType,
  enabled: boolean = true,
) {
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    undefined,
  );

  // 获取当前链ID
  useEffect(() => {
    const updateChainId = () => {
      const { chain } = getNetwork();
      setCurrentChainId(chain?.id);
    };

    updateChainId();
    const unwatchNetwork = watchNetwork(() => {
      updateChainId();
    });

    return () => {
      unwatchNetwork();
    };
  }, []);

  // 对于 nobody 类型，使用无效地址和 disabled
  const dummyAddress = "0x0000000000000000000000000000000000000000";
  const dummyChainId = VOTING_CONTRACTS.BSC_MAINNET.CHAIN_ID;
  const isNobody = voteType === "nobody";

  // 根据 voteType 和当前链获取对应的代币地址和链ID
  const { tokenAddress, chainId } = isNobody
    ? { tokenAddress: dummyAddress, chainId: dummyChainId }
    : getTokenAddressByVoteType(voteType, currentChainId);

  // 直接调用 useTokenBalance
  return useTokenBalance(tokenAddress, chainId, !isNobody && enabled);
}

// 根据 voteType 获取 NFT 余额
export function useNftBalanceByVoteType(enabled: boolean = true) {
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(
    undefined,
  );

  // 获取当前链ID
  useEffect(() => {
    const updateChainId = () => {
      const { chain } = getNetwork();
      setCurrentChainId(chain?.id);
    };

    updateChainId();
    const unwatchNetwork = watchNetwork(() => {
      updateChainId();
    });

    return () => {
      unwatchNetwork();
    };
  }, []);

  // 根据当前链选择对应的 NFT 合约配置（NFT 只在 ETH 链上）
  let nftAddress: string;
  let chainId: number;

  if (currentChainId === VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID) {
    // 当前是 ETH Sepolia 测试链
    nftAddress = VOTING_CONTRACTS.ETH_SEPOLIA.NFT_CONTRACT;
    chainId = VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID;
  } else {
    // 默认使用 ETH 主网
    nftAddress = VOTING_CONTRACTS.ETH_MAINNET.NFT_CONTRACT;
    chainId = VOTING_CONTRACTS.ETH_MAINNET.CHAIN_ID;
  }

  return useNftBalance(nftAddress, chainId, enabled);
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
    async (musicId: number, count: number) => {
      const account = getAccount();
      if (!account.address) {
        throw new Error("请连接钱包");
      }

      setLoading(true);
      try {
        // 获取认证信息
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (!token || !user?.id) {
          throw new Error("请先登录");
        }

        // 调用中心化接口进行NFT投票
        const response = await fetch("/api/music/vote/nft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            uid: user.id,
          },
          body: JSON.stringify({
            creationId: musicId,
            count: count,
          }),
        });

        const data = await response.json();

        // 检查是否需要登录（会自动触发登录弹窗并清除登录状态）
        const needsLogin = checkApiResponse(response, data);

        // 如果 checkApiResponse 没有触发，但数据中明确表示需要登录，也手动触发
        if ((data.code === 104 || data.requiresLogin) && !needsLogin) {
          // 手动触发登录弹窗
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("showLoginModal"));
          }
        }

        if (needsLogin || data.code === 104 || data.requiresLogin) {
          throw new Error("请先登录");
        }

        if (!response.ok) {
          throw new Error(data.error || data.msg || "投票失败");
        }

        if (!data.success) {
          throw new Error(data.error || data.msg || "投票失败");
        }

        toast.success(t("voteSuccess") || "投票成功!");

        // 返回一个模拟的hash（因为不再使用链上交易）
        return `nft-vote-${musicId}-${count}-${Date.now()}`;
      } catch (error: any) {
        console.error("投票失败:", error);

        // 检查是否包含 "no nft" 错误
        const errorMessage = error.message || error.toString() || "";
        if (errorMessage.toLowerCase().includes("no nft")) {
          toast.error(t("noNft") || "當前錢包沒有Nobody NFT");
        } else if (errorMessage.includes("请先登录")) {
          toast.error(t("pleaseLogin") || "請先登錄");
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
