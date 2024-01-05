
import { parseEther } from "viem"

export const NOBODY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEST_ENV === "true" ? "0x1C18c3f8E923C057edc8113B19bC88852e607352" as `0x${string}` : "0x" as `0x${string}`;

export const NFT_SALE_PRICE = parseEther("0.001");

export const MAX_NFT_COUNT = 10000;



export const PRESALE_START_TIME = "2024-01-03 12:00:00";
export const PRESALE_END_TIME = "2024-01-05 12:00:00";

export const REFUND_START_TIME = "2024-01-07 12:00:00";
export const REFUND_END_TIME = "2024-01-09 12:00:00";