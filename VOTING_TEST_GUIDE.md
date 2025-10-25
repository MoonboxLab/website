# 投票功能测试指南

## 🎯 Mock数据测试

为了测试合约投票功能，我们添加了mock数据支持。

### 📁 新增文件

1. **Mock API路由**：
   - `/app/api/music/creation/vote/list/mock/route.ts` - Mock音乐投票列表
   - `/app/api/music/creation/month/list/mock/route.ts` - Mock月份列表

2. **修改的文件**：
   - `/app/[locale]/music/voting/page.tsx` - 添加了mock数据切换功能

### 🎵 Mock音乐数据

包含8首测试音乐，每首都有：
- **ID**: 1-8
- **标题**: 不同的音乐名称
- **投票数**: 不同的scope值 (67-203)
- **用户信息**: 包含nickname和avatar
- **音频URL**: 使用测试音频文件
- **创建时间**: 不同的时间戳

### 🔧 使用方法

1. **访问投票页面**：
   ```
   http://localhost:3000/[locale]/music/voting
   ```

2. **切换测试模式**：
   - 页面顶部有"测试模式"切换按钮
   - 默认使用Mock数据（绿色按钮）
   - 点击可切换到真实API（灰色按钮）

3. **测试投票功能**：
   - 点击任意音乐的"投票"按钮
   - 选择投票方式（Nobody NFT / AICE代币 / FIR代币）
   - 测试不同的投票场景

### 🎮 测试场景

#### 1. **Nobody NFT投票**
- 输入NFT ID或选择拥有的NFT
- 测试NFT余额显示
- 测试投票流程

#### 2. **代币投票 (AICE/FIR)**
- 输入投票数量
- 测试代币余额显示
- 测试授权流程
- 测试投票流程

#### 3. **钱包连接**
- 测试未连接钱包时的"连接钱包"按钮
- 测试网络错误时的"网络错误"按钮
- 测试已连接时的正常投票按钮

### 📊 Mock数据详情

```json
{
  "id": 1,
  "title": "Dream Music Superstar",
  "url": "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  "scope": 150,
  "status": 1,
  "singer": "Nobody Artist #1",
  "createTm": 1704067200000,
  "user": {
    "id": 1,
    "nickname": "MusicCreator1",
    "avator": "/music/covers/artist1.jpg"
  }
}
```

### 🔍 调试信息

控制台会输出详细的调试信息：
- API调用URL
- 响应数据
- 数据转换过程
- 投票操作日志

### ⚠️ 注意事项

1. **Mock数据特点**：
   - 所有音乐都有相同的音频URL（测试用）
   - 用户头像路径可能不存在（会显示默认图片）
   - 投票数据是静态的，不会实时更新

2. **合约测试**：
   - 确保钱包连接到正确的网络（BSC Testnet / ETH Sepolia）
   - 确保有足够的测试代币和NFT
   - 测试授权和投票的完整流程

3. **切换模式**：
   - Mock模式：快速测试UI和基本功能
   - 真实模式：测试完整的API集成

### 🚀 下一步

测试完成后，可以：
1. 移除Mock数据切换按钮
2. 删除Mock API路由
3. 部署到测试环境进行真实合约测试
