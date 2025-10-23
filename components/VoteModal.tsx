"use client";

import { useState } from "react";
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
import { Crown, Coins, Zap } from "lucide-react";

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
    voteType: "nobody" | "aice" | "fir";
    amount: number;
  }) => void;
}

type VoteType = "nobody" | "aice" | "fir";

export default function VoteModal({
  isOpen,
  onClose,
  music,
  onVote,
}: VoteModalProps) {
  const t = useTranslations("Music");
  const [voteType, setVoteType] = useState<VoteType>("nobody");
  const [voteAmount, setVoteAmount] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (!music || !voteAmount) return;

    setIsSubmitting(true);
    try {
      await onVote({
        musicId: music.id,
        voteType,
        amount: parseInt(voteAmount),
      });
      onClose();
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVoteTypeInfo = (type: VoteType) => {
    switch (type) {
      case "nobody":
        return {
          icon: Crown,
          label: "Nobody NFT",
          description: "一月只能投一票",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "aice":
        return {
          icon: Coins,
          label: "$AICE",
          description: "使用 $AICE 代币投票",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "fir":
        return {
          icon: Zap,
          label: "$FIR",
          description: "使用 $FIR 代币投票",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
    }
  };

  const currentVoteInfo = getVoteTypeInfo(voteType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t("vote")}
          </DialogTitle>
        </DialogHeader>

        {music && (
          <div className="space-y-6">
            {/* 音乐信息 */}
            <div className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={music.coverUrl}
                  alt={music.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">{music.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{t("artist")}</p>
                  <p className="text-lg font-bold text-primary">
                    {music.artist || music.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 投票方式选择 */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                {t("votingMethod")}
              </Label>
              <RadioGroup
                value={voteType}
                onValueChange={(value: string) =>
                  setVoteType(value as VoteType)
                }
                className="space-y-3"
              >
                {(["nobody", "aice", "fir"] as VoteType[]).map((type) => {
                  const info = getVoteTypeInfo(type);
                  const Icon = info.icon;
                  const isSelected = voteType === type;

                  return (
                    <div
                      key={type}
                      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                        isSelected
                          ? `${info.borderColor} ${info.bgColor} shadow-[3px_3px_0_0px_rgba(0,0,0,1)]`
                          : "border-gray-200 bg-white/20 hover:border-gray-300 hover:bg-white/30 hover:shadow-[3px_3px_0_0px_rgba(0,0,0,1)]"
                      }`}
                      onClick={() => setVoteType(type)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className={`${
                            isSelected ? info.color : "text-gray-400"
                          }`}
                        />
                        <div className="flex flex-1 items-center space-x-3">
                          <div
                            className={`rounded-lg p-2 transition-all duration-300 ${
                              isSelected
                                ? `${info.bgColor} ${info.color}`
                                : "bg-white/20 text-gray-500"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={type}
                              className={`cursor-pointer text-base font-semibold ${
                                isSelected ? info.color : "text-gray-700"
                              }`}
                            >
                              {info.label}
                            </Label>
                            <p
                              className={`mt-1 text-sm ${
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
              </RadioGroup>
            </div>

            {/* 投票数量 */}
            <div className="space-y-3">
              <Label htmlFor="voteAmount" className="text-base font-semibold">
                {t("voteCount")}
              </Label>
              <Input
                id="voteAmount"
                type="number"
                min="1"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="border-2 text-center text-lg font-semibold focus:border-primary"
                placeholder="1"
              />
              {voteType === "nobody" && (
                <div className="flex items-center space-x-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-700">
                    {t("nobodyVoteLimit")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-12 flex-1 border-2 border-black bg-white text-base font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-gray-50"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleVote}
            disabled={isSubmitting || !voteAmount || parseInt(voteAmount) < 1}
            className="h-12 flex-1 border-2 border-black bg-yellow-400 text-base font-bold text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                <span>{t("submitting")}</span>
              </div>
            ) : (
              t("confirmVote")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
