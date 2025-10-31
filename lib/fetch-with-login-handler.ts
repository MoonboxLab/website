/**
 * 全局fetch拦截器
 * 自动检测需要登录的API响应并触发登录弹窗
 */

import { checkApiResponse } from "./api-interceptor";

// 保存原始的fetch函数
const originalFetch = typeof window !== "undefined" ? window.fetch : global.fetch;

/**
 * 增强的fetch函数，自动处理登录需求
 */
export async function fetchWithLoginHandler(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await originalFetch(input, init);

  // 对于非成功的响应，尝试解析JSON来检查是否需要登录
  if (!response.ok) {
    try {
      // 克隆响应以便读取而不消耗原始响应
      const clone = response.clone();
      const data = await clone.json();
      
      // 检查是否需要登录
      checkApiResponse(response, data);
    } catch (e) {
      // 如果不是JSON响应或解析失败，忽略错误
    }
  }

  return response;
}

// 在浏览器环境中，可以替换全局fetch（可选）
if (typeof window !== "undefined") {
  // 注意：不建议直接替换全局fetch，因为这可能影响其他库
  // 更好的方式是让开发者显式使用fetchWithLoginHandler
  // window.fetch = fetchWithLoginHandler as any;
}

