// 投票合约配置
export const VOTING_CONTRACTS = {
  // BSC 测试链配置
  BSC_TESTNET: {
    VOTING_CONTRACT:
      "0x1d40FB307C43613666a8ce1F4b4E66a8D0F99508" as `0x${string}`,
    TOKEN_AICE: "0x0cDDcAC46Cc976Dc67b6433145398Db1Ebe879d2" as `0x${string}`,
    TOKEN_FIR: "0x5e18C2bB57F4f447b1c72f594Bc02Ba20e9F4b74" as `0x${string}`,
    CHAIN_ID: 97, // BSC Testnet
    RPC_URL: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  // ETH Sepolia 测试链配置
  ETH_SEPOLIA: {
    VOTING_CONTRACT:
      "0xBcd510f93114a6370f35D3a9dae77Fdea66Ed2f3" as `0x${string}`,
    NFT_CONTRACT: "0xA9a1f1ec46819B99f8fb569452c6b0FE5CC235bc" as `0x${string}`,
    CHAIN_ID: 11155111, // Sepolia
    RPC_URL: "https://ethereum-sepolia-rpc.publicnode.com/",
  },
} as const;

// 投票合约 ABI
export const VOTING_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
    ],
    name: "voteByNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "voteByToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ERC20 代币 ABI (用于代币投票)
export const ERC20_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC721 NFT ABI (用于NFT投票)
export const ERC721_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// 投票类型枚举
export type VoteType = "nobody" | "aice" | "fir";

// 投票配置
export const VOTE_CONFIG = {
  nobody: {
    chain: "ETH_SEPOLIA" as const,
    type: "nft" as const,
    contract: VOTING_CONTRACTS.ETH_SEPOLIA.VOTING_CONTRACT,
    tokenContract: VOTING_CONTRACTS.ETH_SEPOLIA.NFT_CONTRACT,
  },
  aice: {
    chain: "BSC_TESTNET" as const,
    type: "token" as const,
    contract: VOTING_CONTRACTS.BSC_TESTNET.VOTING_CONTRACT,
    tokenContract: VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE,
  },
  fir: {
    chain: "BSC_TESTNET" as const,
    type: "token" as const,
    contract: VOTING_CONTRACTS.BSC_TESTNET.VOTING_CONTRACT,
    tokenContract: VOTING_CONTRACTS.BSC_TESTNET.TOKEN_FIR,
  },
} as const;
