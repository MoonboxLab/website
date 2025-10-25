# 投票合约集成说明

## 概述

本项目已成功集成投票合约功能，支持三种投票方式：
- **Nobody NFT投票** (ETH Sepolia测试网)
- **AICE代币投票** (BSC测试网)
- **FIR代币投票** (BSC测试网)

## 合约地址

### BSC测试网
- 投票合约: `0x1d40FB307C43613666a8ce1F4b4E66a8D0F99508`
- AICE代币: `0x0cDDcAC46Cc976Dc67b6433145398Db1Ebe879d2`
- FIR代币: `0x5e18C2bB57F4f447b1c72f594Bc02Ba20e9F4b74`

### ETH Sepolia测试网
- 投票合约: `0xBcd510f93114a6370f35D3a9dae77Fdea66Ed2f3`
- Nobody NFT: `0xA9a1f1ec46819B99f8fb569452c6b0FE5CC235bc`

## 功能特性

### 1. 自动钱包连接
- 自动检测用户钱包连接状态
- 支持MetaMask等主流钱包
- 自动切换网络到正确的测试网

### 2. 余额检查
- 实时显示用户代币/NFT余额
- 投票前验证余额是否充足
- 防止余额不足的投票操作

### 3. NFT选择
- 显示用户拥有的所有Nobody NFT
- 支持选择特定NFT进行投票
- 验证NFT所有权

### 4. 代币授权管理
- 自动检测授权额度
- 按需授权（只授权投票所需金额）
- 授权状态实时显示
- 手动授权按钮

## 使用方法

### 1. 在VoteModal中使用

```tsx
import VoteModal from "@/components/VoteModal";

<VoteModal
  isOpen={isVoteModalOpen}
  onClose={() => setIsVoteModalOpen(false)}
  music={selectedMusic}
  onVote={async (voteData) => {
    console.log("投票数据:", voteData);
    // voteData包含: musicId, voteType, amount, txHash
  }}
/>
```

### 2. 使用React Hooks（推荐）

```tsx
import {
  useWalletConnection,
  useTokenBalance,
  useNftBalance,
  useTokenVote,
  useNftVote,
} from "@/lib/use-voting";

function VotingComponent() {
  const { isConnected, address } = useWalletConnection();
  const { balance: aiceBalance } = useTokenBalance(
    VOTING_CONTRACTS.BSC_TESTNET.TOKEN_AICE,
    VOTING_CONTRACTS.BSC_TESTNET.CHAIN_ID
  );
  const { balance: nftBalance, nftIds } = useNftBalance(
    VOTING_CONTRACTS.ETH_SEPOLIA.NFT_CONTRACT,
    VOTING_CONTRACTS.ETH_SEPOLIA.CHAIN_ID
  );
  
  const { vote: voteByToken, loading: tokenLoading } = useTokenVote();
  const { vote: voteByNft, loading: nftLoading } = useNftVote();

  const handleTokenVote = async () => {
    await voteByToken(musicId, "aice", amount);
  };

  const handleNftVote = async () => {
    await voteByNft(musicId, nftId);
  };

  return (
    <div>
      <p>AICE余额: {aiceBalance}</p>
      <p>NFT余额: {nftBalance}</p>
      <button onClick={handleTokenVote} disabled={tokenLoading}>
        代币投票
      </button>
      <button onClick={handleNftVote} disabled={nftLoading}>
        NFT投票
      </button>
    </div>
  );
}
```

### 3. 直接使用 @wagmi/core

```tsx
import { readContract, writeContract, waitForTransaction } from "@wagmi/core";
import { VOTING_CONTRACTS, VOTING_CONTRACT_ABI } from "@/constants/voting-contract";

// 代币投票
const { hash } = await writeContract({
  address: VOTING_CONTRACTS.BSC_TESTNET.VOTING_CONTRACT,
  abi: VOTING_CONTRACT_ABI,
  functionName: "voteByToken",
  args: [BigInt(musicId), tokenAddress, amountWei],
});

// NFT投票
const { hash } = await writeContract({
  address: VOTING_CONTRACTS.ETH_SEPOLIA.VOTING_CONTRACT,
  abi: VOTING_CONTRACT_ABI,
  functionName: "voteByNft",
  args: [BigInt(musicId), BigInt(nftId)],
});
```

## 测试

### 1. 浏览器控制台测试

在浏览器控制台中运行以下命令：

```javascript
// 测试合约集成
await testVotingIntegration();

// 测试网络切换
await testNetworkSwitch();
```

### 2. 手动测试步骤

1. **连接钱包**
   - 确保钱包已安装并连接
   - 切换到正确的测试网络

2. **获取测试代币**
   - BSC测试网: 从BSC测试网水龙头获取BNB
   - ETH Sepolia: 从Sepolia水龙头获取ETH

3. **获取测试代币/NFT**
   - 联系项目方获取测试代币
   - 或使用测试合约铸造NFT

4. **测试投票**
   - 选择投票方式
   - 输入投票数量
   - 确认交易

## 注意事项

### 1. 网络要求
- BSC测试网需要BNB作为gas费
- ETH Sepolia需要ETH作为gas费
- 确保钱包中有足够的gas费

### 2. 代币授权
- **自动授权**：投票时自动检查并处理授权
- **手动授权**：可以单独进行授权操作
- **精确授权**：只授权投票所需的金额
- **授权状态**：实时显示当前授权额度

### 3. 交易确认
- 所有投票交易都需要等待区块链确认
- 确认时间取决于网络拥堵情况

### 4. 错误处理
- 余额不足时会显示错误提示
- 网络错误会自动重试
- 交易失败会显示具体错误信息

## 技术实现

### 1. 依赖库
- `@wagmi/core`: 以太坊交互库（与项目现有架构一致）
- `viem`: 底层以太坊工具库
- `next-intl`: 国际化支持

### 2. 核心文件
- `constants/voting-contract.ts`: 合约配置
- `lib/use-voting.ts`: React hooks（推荐使用）
- `lib/use-token-approval.ts`: 代币授权管理hooks
- `components/VoteModal.tsx`: 投票界面
- `lib/test-voting.ts`: 测试工具

### 3. 架构优势
- **与现有代码一致**：使用与`service/hares.ts`相同的`@wagmi/core`
- **React集成**：提供React hooks进行状态管理
- **自动网络切换**：根据投票类型自动切换网络
- **实时状态更新**：使用`watchAccount`和`watchNetwork`监听状态变化

## 故障排除

### 1. 钱包连接失败
- 检查钱包是否已安装
- 确认钱包已解锁
- 尝试刷新页面重新连接

### 2. 网络切换失败
- 手动添加测试网络
- 检查RPC URL是否正确
- 确认Chain ID匹配

### 3. 交易失败
- 检查gas费是否充足
- 确认代币余额是否足够
- 查看具体错误信息

### 4. 余额显示异常
- 刷新页面重新获取余额
- 检查网络连接
- 确认合约地址正确
