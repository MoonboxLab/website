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
        const currentChainId = chain?.id || chainId;

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
            address: tokenAddress as `0x${string}`,
            abi: erc20ABI,
            functionName: "name",
            chainId: currentChainId,
          });
          console.log("代币名称:", contractInfo);
        } catch (nameError) {
          console.warn("无法读取代币名称:", nameError);
        }

        const { hash } = await writeContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20ABI,
          functionName: "approve",
          args: [spenderAddress as `0x${string}`, amountWei],
          chainId: currentChainId,
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
    [address, tokenAddress, spenderAddress, chainId, t, fetchAllowance],
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
