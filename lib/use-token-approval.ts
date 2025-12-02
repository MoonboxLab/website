"use client";

import { useState, useEffect, useCallback } from "react";
import {
  readContract,
  writeContract,
  waitForTransaction,
  getAccount,
  getNetwork,
  watchAccount,
  watchNetwork,
  erc20ABI,
} from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useWalletConnection } from "@/lib/use-voting";
import {
  VOTING_CONTRACTS,
  VOTE_CONFIG,
  type VoteType,
} from "@/constants/voting-contract";

// 代币授权管理hook
export function useTokenApproval(
  tokenAddress: string,
  spenderAddress: string,
  chainId: number,
  enabled: boolean = true,
) {
  const [allowance, setAllowance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const { address } = useWalletConnection();
  const t = useTranslations("Music");

  // 获取当前授权额度
  const fetchAllowance = useCallback(async () => {
    if (!address || !enabled) return;

    setLoading(true);
    try {
      const { chain } = getNetwork();
      const currentChainId = chain?.id || chainId;

      const allowanceData = await readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address as `0x${string}`, spenderAddress as `0x${string}`],
        chainId: currentChainId,
      });

      setAllowance(formatUnits(allowanceData, 18));
    } catch (error) {
      console.error("获取授权额度失败:", error);

      // 如果是合约无效的错误，设置一个特殊值
      if (
        error instanceof Error &&
        (error.message.includes("returned no data") ||
          error.message.includes("0x") ||
          error.message.includes("not a contract"))
      ) {
        console.warn("合约地址可能无效:", tokenAddress);
        setAllowance("0");
      } else {
        setAllowance("0");
      }
    } finally {
      setLoading(false);
    }
  }, [address, tokenAddress, spenderAddress, chainId, enabled]);

  // 执行授权
  const approve = useCallback(
    async (amount?: string) => {
      if (!address) {
        throw new Error("请连接钱包");
      }

      setApproving(true);
      try {
        const { chain } = getNetwork();
        const currentChainId = chain?.id;

        // 验证当前链是否匹配
        if (!currentChainId) {
          throw new Error("无法获取当前网络，请确保钱包已连接");
        }

        // 根据当前链重新选择配置，确保地址和链ID匹配
        const defaultChainType: "BSC_MAINNET" | "ETH_MAINNET" =
          currentChainId === VOTING_CONTRACTS.BSC_MAINNET.CHAIN_ID ||
          currentChainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID
            ? "BSC_MAINNET"
            : "ETH_MAINNET";

        const contractConfig = getContractByChainId(
          currentChainId,
          defaultChainType,
        );
        const targetChainId = contractConfig.CHAIN_ID;

        // 根据当前链重新选择代币地址和 spender 地址
        let targetTokenAddress = tokenAddress;
        let targetSpenderAddress = spenderAddress;

        // 如果是 BSC 链，需要根据当前链选择正确的地址
        if (defaultChainType === "BSC_MAINNET") {
          if (currentChainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID) {
            // 当前是测试链，检查 tokenAddress 是否是测试链地址
            // 如果不是，需要找到对应的测试链地址
            if (tokenAddress === VOTING_CONTRACTS.BSC_MAINNET.TOKEN_AICE) {
              targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE;
            } else if (
              tokenAddress === VOTING_CONTRACTS.BSC_MAINNET.TOKEN_FIR
            ) {
              targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_FIR;
            } else if (
              tokenAddress === VOTING_CONTRACTS.BSC_MAINNET.TOKEN_USDT
            ) {
              targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_USDT;
            }
            targetSpenderAddress = VOTING_CONTRACTS.BSC_TESTNET.VOTING_CONTRACT;
          } else {
            // 当前是主网，确保使用主网地址
            targetSpenderAddress = VOTING_CONTRACTS.BSC_MAINNET.VOTING_CONTRACT;
          }
        }

        console.log("授权参数:", {
          tokenAddress,
          spenderAddress,
          currentChainId,
          amount,
          address,
        });

        // 如果没有指定金额，使用最大授权
        const amountWei = amount
          ? parseUnits(amount, 18)
          : parseUnits("1000000", 18); // 默认授权100万个代币

        console.log("授权金额 (Wei):", amountWei.toString());

        // 先尝试读取合约信息
        try {
          const contractInfo = await readContract({
            address: targetTokenAddress as `0x${string}`,
            abi: erc20ABI,
            functionName: "name",
            chainId: targetChainId,
          });
          console.log("代币名称:", contractInfo);
        } catch (nameError) {
          console.warn("无法读取代币名称:", nameError);
        }

        console.log("授权交易参数:", {
          tokenAddress: targetTokenAddress,
          spenderAddress: targetSpenderAddress,
          chainId: targetChainId,
          currentChainId,
        });

        const { hash } = await writeContract({
          address: targetTokenAddress as `0x${string}`,
          abi: erc20ABI,
          functionName: "approve",
          args: [targetSpenderAddress as `0x${string}`, amountWei],
          chainId: targetChainId,
        });

        await waitForTransaction({ hash });
        toast.success(t("approveSuccess") || "授权成功!");

        // 重新获取授权额度
        await fetchAllowance();

        return hash;
      } catch (error: any) {
        console.error("授权失败:", error);

        // 检查是否是用户拒绝操作
        if (
          error.message &&
          error.message.includes("User rejected the request.")
        ) {
          // 用户拒绝操作，不显示错误提示，直接抛出错误
          setApproving(false);
          throw error;
        }

        // 处理特定的合约错误
        let errorMessage = t("approveFailed") || "授权失败";

        if (error.message) {
          if (
            error.message.includes("returned no data") ||
            error.message.includes("0x")
          ) {
            errorMessage = t("invalidContract") || "合约地址无效或合约未部署";
          } else if (error.message.includes("insufficient funds")) {
            errorMessage = t("insufficientFunds") || "余额不足";
          } else if (error.message.includes("user rejected")) {
            errorMessage = t("userRejected") || "用户取消操作";
          } else if (error.message.includes("network")) {
            errorMessage = t("networkError") || "网络错误，请重试";
          }
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setApproving(false);
      }
    },
    [address, tokenAddress, spenderAddress, t, fetchAllowance],
  );

  // 检查是否需要授权
  const needsApproval = useCallback(
    (amount: string) => {
      const amountWei = parseUnits(amount, 18);
      const currentAllowance = parseUnits(allowance, 18);
      return currentAllowance < amountWei;
    },
    [allowance],
  );

  useEffect(() => {
    fetchAllowance();

    const unwatchAccount = watchAccount(() => {
      fetchAllowance();
    });

    const unwatchNetwork = watchNetwork(() => {
      fetchAllowance();
    });

    return () => {
      unwatchAccount();
      unwatchNetwork();
    };
  }, [fetchAllowance]);

  return {
    allowance,
    loading,
    approving,
    approve,
    needsApproval,
    refetch: fetchAllowance,
  };
}

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

// 根据 voteType 和当前链获取对应的代币地址和 spender 地址
function getTokenApprovalAddressesByVoteType(
  voteType: VoteType,
  currentChainId: number | undefined,
): { tokenAddress: string; spenderAddress: string; chainId: number } {
  const config = VOTE_CONFIG[voteType];
  const defaultChainType: "BSC_MAINNET" | "ETH_MAINNET" =
    config.chain === "BSC_MAINNET" ? "BSC_MAINNET" : "ETH_MAINNET";

  // 根据当前链选择配置
  const contractConfig = getContractByChainId(currentChainId, defaultChainType);
  const targetChainId = contractConfig.CHAIN_ID;

  // 根据当前链选择对应的代币地址和 spender 地址
  let targetTokenAddress = config.tokenContract;
  let targetSpenderAddress = config.contract;

  if (config.chain === "BSC_MAINNET") {
    // BSC 代币：根据当前链选择主网或测试网地址
    if (currentChainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID) {
      // 当前是测试链，使用测试链的地址
      if (voteType === "aice") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE;
      } else if (voteType === "fir") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_FIR;
      } else if (voteType === "usdt") {
        targetTokenAddress = VOTING_CONTRACTS.BSC_TESTNET.TOKEN_USDT;
      }
      targetSpenderAddress = VOTING_CONTRACTS.BSC_TESTNET.VOTING_CONTRACT;
    } else {
      // 当前是主网，使用主网的地址（config 中已经是主网地址）
      targetTokenAddress = config.tokenContract;
      targetSpenderAddress = config.contract;
    }
  }

  return {
    tokenAddress: targetTokenAddress,
    spenderAddress: targetSpenderAddress,
    chainId: targetChainId,
  };
}

// 根据 voteType 获取代币授权状态
export function useTokenApprovalByVoteType(
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

  // 根据 voteType 和当前链获取对应的代币地址和 spender 地址
  const { tokenAddress, spenderAddress, chainId } = isNobody
    ? {
        tokenAddress: dummyAddress,
        spenderAddress: dummyAddress,
        chainId: dummyChainId,
      }
    : getTokenApprovalAddressesByVoteType(voteType, currentChainId);

  // 直接调用 useTokenApproval
  return useTokenApproval(
    tokenAddress,
    spenderAddress,
    chainId,
    !isNobody && enabled,
  );
}
