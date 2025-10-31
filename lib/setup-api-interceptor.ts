/**
 * 设置全局API拦截器
 * 在应用初始化时调用此函数来启用自动登录处理
 */

import { checkApiResponse } from "./api-interceptor";

/**
 * 设置全局fetch拦截器
 * 自动检测所有API响应中的code 104并触发登录
 */
export function setupApiInterceptor() {
  if (typeof window === "undefined") {
    return; // 只在浏览器环境中运行
  }

  // 保存原始的fetch函数
  const originalFetch = window.fetch;

  // 替换全局fetch函数
  window.fetch = async function(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    // 调用原始的fetch
    const response = await originalFetch(input, init);

    // 只拦截我们自己的API路由
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (url?.startsWith("/api/")) {
      // 对于非成功的响应，检查是否需要登录
      if (!response.ok && response.status === 401) {
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
    }

    return response;
  };
}

