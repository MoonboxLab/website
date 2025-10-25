// 简化的合约测试脚本
// 在浏览器控制台中运行

async function testContractConnection() {
  try {
    console.log("=== 测试 AICE 代币合约连接 ===");

    const tokenAddress = "0x0cDDcAC46Cc976Dc67b6433145398Db1Ebe879d2";
    const spenderAddress = "0x1d40FB307C43613666a8ce1F4b4E66a8D0F99508";

    // 1. 检查合约代码
    const code = await window.ethereum.request({
      method: "eth_getCode",
      params: [tokenAddress, "latest"],
    });

    console.log("合约代码长度:", code.length);
    if (code === "0x") {
      console.error("❌ 合约不存在");
      return;
    }
    console.log("✅ 合约存在");

    // 2. 测试 name() 函数
    try {
      const nameData = await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: tokenAddress,
            data: "0x06fdde03", // name() 函数选择器
          },
          "latest",
        ],
      });
      console.log("✅ name() 函数调用成功");
      console.log("name() 返回数据:", nameData);
    } catch (e) {
      console.warn("⚠️ name() 函数调用失败:", e.message);
    }

    // 3. 测试 balanceOf() 函数
    const testAddress = "0x0000000000000000000000000000000000000000";
    try {
      const balanceData = await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: tokenAddress,
            data: "0x70a08231000000000000000000000000" + testAddress.slice(2),
          },
          "latest",
        ],
      });
      console.log("✅ balanceOf() 函数调用成功");
      console.log("balanceOf() 返回数据:", balanceData);
    } catch (e) {
      console.warn("⚠️ balanceOf() 函数调用失败:", e.message);
    }

    // 4. 测试 allowance() 函数
    try {
      const allowanceData = await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: tokenAddress,
            data:
              "0xdd62ed3e" + // allowance() 函数选择器
              testAddress.slice(2).padStart(64, "0") + // owner
              spenderAddress.slice(2).padStart(64, "0"), // spender
          },
          "latest",
        ],
      });
      console.log("✅ allowance() 函数调用成功");
      console.log("allowance() 返回数据:", allowanceData);
    } catch (e) {
      console.warn("⚠️ allowance() 函数调用失败:", e.message);
    }

    console.log("=== 测试完成 ===");
  } catch (error) {
    console.error("测试失败:", error);
  }
}

// 运行测试
testContractConnection();
