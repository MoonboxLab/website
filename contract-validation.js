// 合约地址验证脚本
// 在浏览器控制台中运行此脚本来验证合约地址

async function validateContractAddress(address, chainId) {
  try {
    console.log(`验证合约地址: ${address} (Chain ID: ${chainId})`);

    // 检查地址是否为合约
    const code = await window.ethereum.request({
      method: "eth_getCode",
      params: [address, "latest"],
    });

    if (code === "0x") {
      console.error("❌ 地址不是合约:", address);
      return false;
    }

    console.log("✅ 地址是合约");

    // 尝试调用 balanceOf 函数
    const testAddress = "0x0000000000000000000000000000000000000000";
    const balanceData = await window.ethereum.request({
      method: "eth_call",
      params: [
        {
          to: address,
          data: "0x70a08231000000000000000000000000" + testAddress.slice(2),
        },
        "latest",
      ],
    });

    console.log("✅ balanceOf 函数调用成功");

    // 尝试调用 approve 函数 (只模拟，不执行)
    const approveData =
      "0x095ea7b3000000000000000000000000" +
      "0x1d40FB307C43613666a8ce1F4b4E66a8D0F99508".slice(2) +
      "0000000000000000000000000000000000000000000000000000000000000001";

    try {
      await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: address,
            data: approveData,
          },
          "latest",
        ],
      });
      console.log("✅ approve 函数存在");
    } catch (e) {
      console.warn("⚠️ approve 函数可能不存在或参数错误:", e.message);
    }

    return true;
  } catch (error) {
    console.error("❌ 验证失败:", error);
    return false;
  }
}

// 验证 AICE 代币合约
console.log("=== 验证 AICE 代币合约 ===");
validateContractAddress("0x0cDDcAC46Cc976Dc67b6433145398Db1Ebe879d2", 97);

// 验证 FIR 代币合约
console.log("=== 验证 FIR 代币合约 ===");
validateContractAddress("0x5e18C2bB57F4f447b1c72f594Bc02Ba20e9F4b74", 97);

// 验证投票合约
console.log("=== 验证投票合约 ===");
validateContractAddress("0x1d40FB307C43613666a8ce1F4b4E66a8D0F99508", 97);
