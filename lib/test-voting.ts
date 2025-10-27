// 测试投票合约集成
import { VOTING_CONTRACTS } from "@/constants/voting-contract";
import { getAccount, getNetwork, readContract, erc20ABI, erc721ABI } from "@wagmi/core";

// 测试函数
export async function testVotingIntegration() {
  console.log("开始测试投票合约集成...");

  try {
    // 测试钱包连接
    console.log("1. 测试钱包连接...");
    const account = getAccount();
    console.log("钱包地址:", account.address);

    if (!account.address) {
      console.log("❌ 钱包未连接");
      return;
    }

    // 测试代币余额查询
    console.log("2. 测试代币余额查询...");
    const { chain } = getNetwork();
    const currentChainId = chain?.id || VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID;

    const aiceBalance = await readContract({
      address: VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [account.address],
      chainId: currentChainId,
    });
    console.log("AICE余额:", aiceBalance);

    const firBalance = await readContract({
      address: VOTING_CONTRACTS.BSC_TESTNET.TOKEN_FIR,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [account.address],
      chainId: currentChainId,
    });
    console.log("FIR余额:", firBalance);

    // 测试NFT余额查询
    console.log("3. 测试NFT余额查询...");
    const nftBalance = await readContract({
      address: VOTING_CONTRACTS.ETH_SEPOLIA.NFT_CONTRACT,
      abi: ERC721_ABI,
      functionName: "balanceOf",
      args: [account.address],
      chainId: VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID,
    });
    console.log("NFT余额:", nftBalance);

    console.log("✅ 投票合约集成测试完成");
  } catch (error) {
    console.error("❌ 测试失败:", error);
  }
}

// 测试网络切换
export async function testNetworkSwitch() {
  console.log("测试网络切换...");

  try {
    // 切换到BSC测试网
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: `0x${VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID.toString(16)}` },
      ],
    });
    console.log("✅ 已切换到BSC测试网");

    // 切换到ETH Sepolia
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        { chainId: `0x${VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID.toString(16)}` },
      ],
    });
    console.log("✅ 已切换到ETH Sepolia");
  } catch (error) {
    console.error("❌ 网络切换失败:", error);
  }
}

// 在浏览器控制台中运行测试
if (typeof window !== "undefined") {
  (window as any).testVotingIntegration = testVotingIntegration;
  (window as any).testNetworkSwitch = testNetworkSwitch;
}
