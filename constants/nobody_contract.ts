
import { parseEther } from "viem"

export type ADDRESS = `0x${string}`

// Production Contract Address
const CONTRACT_ADDRESS_PRODUCTION = "0x129d453253dbCE5CF6997DB8Fb461B2A20Fd275F"
// Development Contract Address
const CONTRACT_ADDRESS_TEST = "0x833e32D61A4a64413583DA854bE86C5206A64df8"
export const NOBODY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEST_ENV === "true" ? CONTRACT_ADDRESS_TEST as `0x${string}` : CONTRACT_ADDRESS_PRODUCTION as `0x${string}`;

export const NFT_SALE_PRICE = process.env.NEXT_PUBLIC_TEST_ENV === "true" ? parseEther("0.19527") : parseEther("0.19527");

export const MAX_NFT_COUNT = 10000;
export const MAX_AMOUNT_PRE_ADDRESS = 1;
export const MAX_MINTABLE_COUNT = 9500;

export enum MintPeriod {
  Ready,
  Mint,
  MintEnd,
  Raffle,
  Refund,
  End,
}

// Production Time
export const MINT_START_TIME = 1706788800000; // "2024-02-01 20:00:00"
export const MINT_END_TIME = 1706961600000; // "2024-02-03 20:00:00"

export const MINT_FIRST_HOUR = 1706792400000 // "2024-02-01 21:00:00"

export const RAFFLE_START_TIME = 1706961600000; // "2024-02-03 20:00:00"
export const RAFFLE_END_TIME = 1707048000000 // "2024-02-04 20:00:00"

export const REFUND_START_TIME = 1707048000000; // "2024-02-04 20:00:00"
export const REFUND_END_TIME = 1721044800000; // "2024-07-15 20:00:00"


// Development Test Time
// export const MINT_START_TIME = 1705903200000; // "2024-01-22 14:00:00"
// export const MINT_END_TIME = 1705910400000; // "2024-01-22 16:00:00"

// export const MINT_FIRST_HOUR = 1705906800000 // "2024-01-22 15:00:00"

// export const RAFFLE_START_TIME = 1705910400000; // "2024-01-22 16:00:00"
// export const RAFFLE_END_TIME = 1705914600000 // "2024-01-22 18:00:00"

// export const REFUND_START_TIME = 1705914600000; // "2024-01-22 18:00:00"
// export const REFUND_END_TIME = 1705924800000; // "2024-01-22 20:00:00"


export const NOBODY_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"VRFCoordinator_","type":"address"},{"internalType":"uint64","name":"VRFSubscriptionId_","type":"uint64"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyRefund","type":"error"},{"inputs":[],"name":"AlreadyReserved","type":"error"},{"inputs":[],"name":"InsufficientBalance","type":"error"},{"inputs":[],"name":"InvalidAddress","type":"error"},{"inputs":[],"name":"InvalidRaffle","type":"error"},{"inputs":[],"name":"InvalidValue","type":"error"},{"inputs":[],"name":"NotRefundable","type":"error"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyCoordinatorCanFulfill","type":"error"},{"inputs":[],"name":"OnlyEOA","type":"error"},{"inputs":[],"name":"RefundNotActive","type":"error"},{"inputs":[],"name":"RserveNotActive","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserver","type":"address"}],"name":"PublicReserved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserver","type":"address"}],"name":"RaffleWon","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"RandomWordsFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"RandomWordsRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserver","type":"address"}],"name":"Refunded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"reserver","type":"address"}],"name":"WhitelistReserved","type":"event"},{"inputs":[],"name":"NORMAL_WEIGHT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRIORITY_WEIGHT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"raffleRound","type":"uint256"},{"internalType":"uint256","name":"raffleCount","type":"uint256"}],"name":"executeRaffle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isPublicReserveActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isRefundActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isWhitelistReserveActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priorityTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicReserve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"raffleWon","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"refunded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"keyHash","type":"bytes32"},{"internalType":"uint16","name":"requestConfirmations","type":"uint16"},{"internalType":"uint32","name":"callbackGasLimit","type":"uint32"},{"internalType":"uint32","name":"numWords","type":"uint32"}],"name":"requestRaffleRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"reserved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_isPublicReserveActive","type":"bool"}],"name":"setIsPublicReserveActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isRefundActive","type":"bool"}],"name":"setIsRefundActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isWhitelistReserveActive","type":"bool"}],"name":"setIsWhitelistReserveActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_priorityTime","type":"uint256"}],"name":"setPriorityTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"}],"name":"setReservePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"VRFSubscriptionId_","type":"uint64"}],"name":"setVRFSubscriptionId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalReserved","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whitelistReserve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}] as const


export const NOBODY_CONTRACT_INFO = {
  address: NOBODY_CONTRACT_ADDRESS,
  abi: NOBODY_CONTRACT_ABI,
}