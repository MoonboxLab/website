
import { parseEther } from "viem"

const CONTRACT_ADDRESS_PRODUCTION = "0x"
const CONTRACT_ADDRESS_TEST = "0x1C18c3f8E923C057edc8113B19bC88852e607352"
export const NOBODY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEST_ENV === "true" ? CONTRACT_ADDRESS_TEST as `0x${string}` : CONTRACT_ADDRESS_PRODUCTION as `0x${string}`;

export const NFT_SALE_PRICE = parseEther("0.19527");

export const MAX_NFT_COUNT = 10000;
export const MAX_AMOUNT_PRE_ADDRESS = 1;

export const NO_WHITELIST_STOP_MINT = false;

export const MINT_START_TIME = "2024-02-01 20:00:00";
export const MINT_END_TIME = "2024-02-03 20:00:00";
export const MINT_FIRST_HOUR = "2024-02-01 21:00:00"

export const RAFFLE_START_TIME = "2024-02-03 20:00:00";
export const RAFFLE_END_TIME = "2024-02-04 20:00:00"

export const REFUND_START_TIME = "2024-02-04 20:00:00";
export const REFUND_END_TIME = "2024-02-08 20:00:00";