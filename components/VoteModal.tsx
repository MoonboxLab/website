"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Crown,
  Coins,
  Zap,
  AlertCircle,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useWalletConnection,
  useTokenVote,
  useNftVote,
  useNetworkSwitch,
  useTokenBalanceByVoteType,
  useNftBalanceByVoteType,
} from "@/lib/use-voting";
import { getNetwork } from "@wagmi/core";
import { useTokenApprovalByVoteType } from "@/lib/use-token-approval";
import { useAuthSync } from "@/lib/useAuthSync";
import { VOTING_CONTRACTS } from "@/constants/voting-contract";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  music: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    artist?: string;
  } | null;
  onVote: (voteData: {
    musicId: string;
    voteType: "nobody" | "aice" | "fir" | "usdt";
    amount: number;
    txHash?: string;
  }) => void;
}

type VoteType = "nobody" | "aice" | "fir" | "usdt";

export default function VoteModal({
  isOpen,
  onClose,
  music,
  onVote,
}: VoteModalProps) {
  const t = useTranslations("Music");
  const [voteType, setVoteType] = useState<VoteType>("nobody");
  const [voteAmount, setVoteAmount] = useState<string>("1");
  const [nftIdInput, setNftIdInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txStatus, setTxStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // 使用hooks
  const { isConnected, address } = useWalletConnection();
  const { switchToChain, switching } = useNetworkSwitch();
  const { isLoggedIn } = useAuthSync();

  // 根据 voteType 获取代币余额
  const { balance: aiceBalance } = useTokenBalanceByVoteType(
    "aice",
    voteType === "aice" && isConnected,
  );

  const { balance: firBalance } = useTokenBalanceByVoteType(
    "fir",
    voteType === "fir" && isConnected,
  );

  const { balance: usdtBalance } = useTokenBalanceByVoteType(
    "usdt",
    voteType === "usdt" && isConnected,
  );

  // NFT余额hook
  const { balance: nftBalance, refetch: refetchNftBalance } =
    useNftBalanceByVoteType(voteType === "nobody" && isConnected);

  // 投票hooks
  const { vote: voteByToken, loading: tokenVoteLoading } = useTokenVote();
  const { vote: voteByNft, loading: nftVoteLoading } = useNftVote();

  // 根据 voteType 获取授权状态
  const {
    needsApproval: needsAiceApproval,
    approve: approveAice,
    approving: aiceApproving,
  } = useTokenApprovalByVoteType("aice", voteType === "aice" && isConnected);

  const {
    needsApproval: needsFirApproval,
    approve: approveFir,
    approving: firApproving,
  } = useTokenApprovalByVoteType("fir", voteType === "fir" && isConnected);

  const {
    needsApproval: needsUsdtApproval,
    approve: approveUsdt,
    approving: usdtApproving,
  } = useTokenApprovalByVoteType("usdt", voteType === "usdt" && isConnected);

  const isSubmitting =
    tokenVoteLoading ||
    nftVoteLoading ||
    switching ||
    aiceApproving ||
    firApproving ||
    usdtApproving;

  // 计算投票按钮是否应该禁用
  const isVoteButtonDisabled = useMemo(() => {
    // 如果正在提交，禁用
    if (isSubmitting || txStatus === "pending") {
      return true;
    }

    // NFT投票验证
    if (voteType === "nobody") {
      // 没有输入
      if (!nftIdInput) {
        return true;
      }

      const nftAmount = parseInt(nftIdInput);
      // 输入无效（不是数字或小于1）
      if (isNaN(nftAmount) || nftAmount < 1) {
        return true;
      }

      // NFT数量不足（nftBalance 是 number 类型，初始值为 0，直接比较即可）
      if (nftBalance < nftAmount) {
        return true;
      }

      return false;
    }

    // 代币投票验证
    if (!voteAmount || parseInt(voteAmount) < 1) {
      return true;
    }

    return false;
  }, [isSubmitting, txStatus, voteType, nftIdInput, nftBalance, voteAmount]);

  const getVoteTypeInfo = (type: VoteType) => {
    switch (type) {
      case "nobody":
        return {
          icon: Crown,
          label: "Nobody NFT",
          description: t("nobodyVoteLimit"),
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "aice":
        return {
          icon: Coins,
          label: "$AICE",
          description: t("aiceVoteDescription"),
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "fir":
        return {
          icon: Zap,
          label: "$FIR",
          description: t("firVoteDescription"),
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
      case "usdt":
        return {
          icon: DollarSign,
          label: "$USDT",
          description: t("usdtVoteDescription"),
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
    }
  };

  const handleVote = async () => {
    if (!music || !address) return;

    // 验证输入
    if (voteType === "nobody") {
      // NFT投票：输入的是数量（虽然变量名叫nftId，但实际是数量）
      const nftAmount = nftIdInput ? parseInt(nftIdInput) : null;
      if (nftAmount === null || isNaN(nftAmount) || nftAmount < 1) {
        setError(t("invalidVoteAmount") || "请输入有效的投票数量");
        return;
      }
      // 验证数量是否超过拥有的NFT数量
      if (nftBalance && nftBalance < nftAmount) {
        setError(t("insufficientNftBalance") || "NFT数量不足");
        return;
      }
    } else {
      // 代币投票：检查投票数量
      if (!voteAmount || parseInt(voteAmount) < 1) {
        setError(t("invalidVoteAmount"));
        return;
      }
    }

    setError("");
    setTxStatus("pending");

    try {
      // 检查当前网络是否正确，只在需要时切换
      const targetChainId = getTargetChainId();
      const { chain } = getNetwork();

      if (chain?.id !== targetChainId) {
        await switchToChain(targetChainId);
      }

      // 对于代币投票，先检查是否需要授权
      if (voteType === "aice" && needsAiceApproval(voteAmount)) {
        setTxStatus("pending");
        await approveAice(voteAmount);
        // 授权成功后继续投票
      } else if (voteType === "fir" && needsFirApproval(voteAmount)) {
        setTxStatus("pending");
        await approveFir(voteAmount);
        // 授权成功后继续投票
      } else if (voteType === "usdt" && needsUsdtApproval(voteAmount)) {
        setTxStatus("pending");
        await approveUsdt(voteAmount);
        // 授权成功后继续投票
      }

      let hash: string;

      if (voteType === "nobody") {
        // 虽然参数名叫nftId，但实际传入的是数量
        const nftAmount = parseInt(nftIdInput);
        hash = await voteByNft(parseInt(music.id), nftAmount);
      } else {
        hash = await voteByToken(
          parseInt(music.id),
          voteType,
          parseInt(voteAmount),
        );
      }

      setTxHash(hash);
      setTxStatus("success");

      // 刷新 NFT balance（如果是 NFT 投票）
      if (voteType === "nobody") {
        refetchNftBalance();
      }

      // 调用回调函数
      await onVote({
        musicId: music.id,
        voteType,
        amount: voteType === "nobody" ? 1 : parseInt(voteAmount),
        txHash: hash,
      });

      // 延迟关闭弹窗
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error: any) {
      console.error("Vote failed:", error);

      // 检查是否是用户拒绝操作
      if (
        error.message &&
        error.message.includes("User rejected the request.")
      ) {
        // 用户拒绝操作，不显示错误提示，直接返回
        setTxStatus("failed");
        return;
      }

      // 检查是否是登录相关错误
      if (
        error.message &&
        (error.message.includes("请先登录") ||
          error.message.includes("请先登錄") ||
          error.message.includes("login") ||
          error.message.toLowerCase().includes("unauthorized"))
      ) {
        // 触发登录弹窗
        window.dispatchEvent(new CustomEvent("showLoginModal"));
        setTxStatus("failed");
        return;
      }

      // 提供简洁的用户友好错误信息
      let errorMessage = t("voteFailedGeneric");

      if (error.message) {
        // 处理常见的合约错误
        if (error.message.includes("insufficient funds")) {
          errorMessage = t("insufficientFunds") || "余额不足";
        } else if (error.message.includes("user rejected")) {
          errorMessage = t("userRejected") || "用户取消操作";
        } else if (error.message.includes("network")) {
          errorMessage = t("networkError") || "网络错误，请重试";
        } else if (error.message.includes("allowance")) {
          errorMessage = t("insufficientAllowance") || "授权额度不足";
        } else if (error.message.includes("not owner")) {
          errorMessage = t("notOwner") || "您不是该NFT的所有者";
        } else {
          // 对于其他错误，只显示简短信息
          errorMessage = t("operationFailed") || "操作失败，请重试";
        }
      }

      setError(errorMessage);
      setTxStatus("failed");
    }
  };

  const resetForm = () => {
    setVoteType("nobody");
    setVoteAmount("1");
    setNftIdInput("");
    setError("");
    setTxStatus("idle");
    setTxHash("");
  };

  // 获取当前余额
  const getCurrentBalance = () => {
    switch (voteType) {
      case "aice":
        return aiceBalance;
      case "fir":
        return firBalance;
      case "usdt":
        return usdtBalance;
      case "nobody":
        return "0";
      default:
        return "0";
    }
  };

  // 根据当前链类型和 voteType 获取目标链ID
  const getTargetChainId = useCallback(() => {
    const { chain } = getNetwork();
    const currentChainId = chain?.id;

    // 判断当前链是否是测试链
    const isTestnet =
      currentChainId === VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID ||
      currentChainId === VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID;

    if (voteType === "nobody") {
      // NFT投票：ETH链
      return isTestnet
        ? VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID
        : VOTING_CONTRACTS.ETH_MAINNET.CHAIN_ID;
    } else {
      // 代币投票：BSC链
      return isTestnet
        ? VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID
        : VOTING_CONTRACTS.BSC_MAINNET.CHAIN_ID;
    }
  }, [voteType]);

  // 自动切换网络
  useEffect(() => {
    if (!address) return; // 只有连接钱包后才切换网络

    const switchNetwork = async () => {
      try {
        const targetChainId = getTargetChainId();
        await switchToChain(targetChainId);
      } catch (error) {
        console.log("Network switch failed:", error);
        // 网络切换失败不影响用户体验，静默处理
      }
    };

    switchNetwork();
  }, [voteType, address, switchToChain, getTargetChainId]);

  // 当弹窗打开时刷新 NFT balance
  useEffect(() => {
    if (isOpen && isConnected && address) {
      // 延迟一下，确保钱包连接状态已更新
      setTimeout(() => {
        refetchNftBalance();
      }, 300);
    }
  }, [isOpen, isConnected, address, refetchNftBalance]);

  // 监听钱包连接状态，连接成功后恢复 Dialog 关闭行为
  useEffect(() => {
    if (isConnected && address) {
      setIsConnectingWallet(false);
    }
  }, [isConnected, address]);

  // 当 Dialog 关闭时重置连接状态
  useEffect(() => {
    if (!isOpen) {
      setIsConnectingWallet(false);
    }
  }, [isOpen]);

  // 监听 RainbowKit modal 关闭（用户取消连接时）
  useEffect(() => {
    if (!isConnectingWallet || !isOpen) return;

    const checkRainbowKitModal = () => {
      const modal =
        document.querySelector("[data-rk]") ||
        document.querySelector('[id*="rk"]') ||
        document.querySelector('[class*="rk"]') ||
        document.querySelector('[class*="rainbow"]');

      // 如果 RainbowKit modal 关闭了但钱包未连接，恢复 Dialog 关闭行为
      if (!modal && !isConnected) {
        setIsConnectingWallet(false);
      }
    };

    const interval = setInterval(checkRainbowKitModal, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isConnectingWallet, isOpen, isConnected]);

  const currentVoteInfo = getVoteTypeInfo(voteType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(event) => {
          // 当正在连接钱包时，阻止 Dialog 关闭
          if (isConnectingWallet) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          // 当正在连接钱包时，阻止 Dialog 关闭
          if (isConnectingWallet) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t("vote")}
          </DialogTitle>
        </DialogHeader>

        {music && (
          <div className="space-y-4">
            {/* 音乐信息 - 更紧凑 */}
            <div className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={music.coverUrl}
                  alt={music.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-semibold">{music.name}</h3>
                <p className="text-sm text-gray-600">{t("artist")}</p>
                <p className="text-sm font-bold text-primary">
                  {music.artist || music.description}
                </p>
              </div>
            </div>

            {/* 投票方式选择 */}
            <div>
              <Label className="text-xs font-semibold">
                {t("votingMethodTitle")}
              </Label>
              <RadioGroup
                value={voteType}
                onValueChange={(value: string) =>
                  setVoteType(value as VoteType)
                }
                className="gap-2"
              >
                {/* NFT投票 - 单独一行 */}
                {(() => {
                  const type = "nobody" as VoteType;
                  const info = getVoteTypeInfo(type);
                  const Icon = info.icon;
                  const isSelected = voteType === type;

                  return (
                    <div
                      key={type}
                      className={`relative cursor-pointer rounded-md border-2 p-2 transition-all duration-300 ${
                        isSelected
                          ? `${info.borderColor} ${info.bgColor} shadow-[3px_3px_0_0px_rgba(0,0,0,1)]`
                          : "border-gray-200 bg-white/20 hover:border-gray-300 hover:bg-white/30 hover:shadow-[3px_3px_0_0px_rgba(0,0,0,1)]"
                      }`}
                      onClick={() => setVoteType(type)}
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className={`${
                            isSelected ? info.color : "text-gray-400"
                          }`}
                        />
                        <div className="flex flex-1 items-center space-x-1">
                          <div
                            className={`rounded-sm p-1 transition-all duration-300 ${
                              isSelected
                                ? `${info.bgColor} ${info.color}`
                                : "bg-white/20 text-gray-500"
                            }`}
                          >
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={type}
                              className={`cursor-pointer text-xs font-semibold ${
                                isSelected ? info.color : "text-gray-700"
                              }`}
                            >
                              {info.label}
                            </Label>
                            <p
                              className={`text-xs ${
                                isSelected ? "text-gray-600" : "text-gray-500"
                              }`}
                            >
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 代币投票 - 一行两个 */}
                <div className="grid grid-cols-2 gap-2">
                  {(["aice", "fir"] as VoteType[]).map((type) => {
                    const info = getVoteTypeInfo(type);
                    const Icon = info.icon;
                    const isSelected = voteType === type;

                    return (
                      <div
                        key={type}
                        className={`relative cursor-pointer rounded-md border-2 p-2 transition-all duration-300 ${
                          isSelected
                            ? `${info.borderColor} ${info.bgColor} shadow-[3px_3px_0_0px_rgba(0,0,0,1)]`
                            : "border-gray-200 bg-white/20 hover:border-gray-300 hover:bg-white/30 hover:shadow-[3px_3px_0_0px_rgba(0,0,0,1)]"
                        }`}
                        onClick={() => setVoteType(type)}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem
                            value={type}
                            id={type}
                            className={`${
                              isSelected ? info.color : "text-gray-400"
                            }`}
                          />
                          <div className="flex flex-1 items-center space-x-1">
                            <div
                              className={`rounded-sm p-1 transition-all duration-300 ${
                                isSelected
                                  ? `${info.bgColor} ${info.color}`
                                  : "bg-white/20 text-gray-500"
                              }`}
                            >
                              <Icon className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <Label
                                htmlFor={type}
                                className={`cursor-pointer text-xs font-semibold ${
                                  isSelected ? info.color : "text-gray-700"
                                }`}
                              >
                                {info.label}
                              </Label>
                              <p
                                className={`text-xs ${
                                  isSelected ? "text-gray-600" : "text-gray-500"
                                }`}
                              >
                                {info.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* USDT投票 - 单独一行 */}
                {(() => {
                  const type = "usdt" as VoteType;
                  const info = getVoteTypeInfo(type);
                  const Icon = info.icon;
                  const isSelected = voteType === type;

                  return (
                    <div
                      key={type}
                      className={`relative cursor-pointer rounded-md border-2 p-2 transition-all duration-300 ${
                        isSelected
                          ? `${info.borderColor} ${info.bgColor} shadow-[3px_3px_0_0px_rgba(0,0,0,1)]`
                          : "border-gray-200 bg-white/20 hover:border-gray-300 hover:bg-white/30 hover:shadow-[3px_3px_0_0px_rgba(0,0,0,1)]"
                      }`}
                      onClick={() => setVoteType(type)}
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className={`${
                            isSelected ? info.color : "text-gray-400"
                          }`}
                        />
                        <div className="flex flex-1 items-center space-x-1">
                          <div
                            className={`rounded-sm p-1 transition-all duration-300 ${
                              isSelected
                                ? `${info.bgColor} ${info.color}`
                                : "bg-white/20 text-gray-500"
                            }`}
                          >
                            <Icon className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={type}
                              className={`cursor-pointer text-xs font-semibold ${
                                isSelected ? info.color : "text-gray-700"
                              }`}
                            >
                              {info.label}
                            </Label>
                            <p
                              className={`text-xs ${
                                isSelected ? "text-gray-600" : "text-gray-500"
                              }`}
                            >
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </RadioGroup>

              {/* 网络提示 */}
              <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-2">
                <div className="flex items-center space-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-xs font-medium text-blue-700">
                    {voteType === "nobody"
                      ? t("networkHintEth")
                      : t("networkHintBsc")}
                  </p>
                </div>
              </div>
            </div>

            {/* 投票输入 */}
            <div className="space-y-2">
              {voteType === "nobody" ? (
                <>
                  <Label htmlFor="nftId" className="text-xs font-semibold">
                    {t("voteCount")}
                  </Label>
                  <Input
                    id="nftId"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={nftIdInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 只允许纯数字（整数），过滤掉小数点和其他非数字字符
                      const numericValue = value.replace(/[^\d]/g, "");
                      setNftIdInput(numericValue);
                      setError(""); // 清除之前的错误
                    }}
                    onKeyDown={(e) => {
                      // 阻止输入小数点、负号、e、E等字符
                      if (
                        e.key === "." ||
                        e.key === "-" ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="border-2 text-center text-sm font-semibold focus:border-primary"
                    placeholder={t("voteAmountPlaceholder")}
                  />
                  {/* NFT数量显示 */}
                  {address && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        {t("nftBalance") || "NFT数量"}:
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {nftBalance}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Label htmlFor="voteAmount" className="text-xs font-semibold">
                    {t("voteCount")}
                  </Label>
                  <Input
                    id="voteAmount"
                    type="number"
                    min="1"
                    value={voteAmount}
                    onChange={(e) => setVoteAmount(e.target.value)}
                    className="border-2 text-center text-sm font-semibold focus:border-primary"
                    placeholder="1"
                  />
                </>
              )}

              {/* 余额显示 */}
              {address && voteType !== "nobody" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    {t("tokenBalance")}:
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {getCurrentBalance()} {voteType.toUpperCase()}
                  </span>
                </div>
              )}

              {/* NFT选择 - 隐藏，使用输入框 */}
              {/* {voteType === "nobody" && nftIds.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {t("selectNft")}:
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {nftIds.map((nftId) => (
                      <button
                        key={nftId}
                        onClick={() => setSelectedNftId(nftId)}
                        className={`rounded-lg border-2 p-2 text-sm font-medium transition-all ${
                          selectedNftId === nftId
                            ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        #{nftId}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}

              {/* NFT选择 - 隐藏，使用输入框 */}
              {/* {voteType === "nobody" && nftIds.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {t("selectNft")}:
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {nftIds.map((nftId) => (
                      <button
                        key={nftId}
                        onClick={() => setSelectedNftId(nftId)}
                        className={`rounded-lg border-2 p-2 text-sm font-medium transition-all ${
                          selectedNftId === nftId
                            ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        #{nftId}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-gray-500">
          {t("voteHint")}
        </div>
        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-12 flex-1 border-2 border-black bg-white text-base font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-gray-50"
          >
            {t("cancel")}
          </Button>

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              if (!connected) {
                return (
                  <Button
                    onClick={() => {
                      setIsConnectingWallet(true);
                      openConnectModal();
                    }}
                    className="h-12 flex-1 border-2 border-black bg-blue-400 text-base font-bold text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-blue-500"
                  >
                    {t("connectWallet")}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className="h-12 flex-1 border-2 border-black bg-red-400 text-base font-bold text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-red-500"
                  >
                    {t("wrongNetwork")}
                  </Button>
                );
              }

              // NFT投票需要登录
              if (voteType === "nobody" && !isLoggedIn) {
                return (
                  <Button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("showLoginModal"));
                    }}
                    className="h-12 flex-1 border-2 border-black bg-blue-400 text-base font-bold text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-blue-500"
                  >
                    {t("login")}
                  </Button>
                );
              }

              return (
                <Button
                  onClick={handleVote}
                  disabled={isVoteButtonDisabled}
                  className="h-12 flex-1 border-2 border-black bg-yellow-400 text-base font-bold text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                      <span>
                        {(voteType === "aice" &&
                          needsAiceApproval(voteAmount)) ||
                        (voteType === "fir" && needsFirApproval(voteAmount)) ||
                        (voteType === "usdt" && needsUsdtApproval(voteAmount))
                          ? t("approving")
                          : t("submitting")}
                      </span>
                    </div>
                  ) : (voteType === "aice" && needsAiceApproval(voteAmount)) ||
                    (voteType === "fir" && needsFirApproval(voteAmount)) ||
                    (voteType === "usdt" && needsUsdtApproval(voteAmount)) ? (
                    t("approveAndVote")
                  ) : (
                    t("confirmVote")
                  )}
                </Button>
              );
            }}
          </ConnectButton.Custom>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
