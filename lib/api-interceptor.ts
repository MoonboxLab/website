/**
 * 全局API响应拦截器
 * 检测需要登录的响应（code 104）并触发登录弹窗
 */

let showLoginModalCallback: (() => void) | null = null;

/**
 * 注册显示登录弹窗的回调函数
 */
export function registerLoginModalCallback(callback: () => void) {
  showLoginModalCallback = callback;
}

/**
 * 检查响应是否需要登录，如果需要则触发登录弹窗并清除登录状态
 */
export function checkApiResponse(response: Response, data: any): boolean {
  // 检查HTTP状态码401
  if (response.status === 401) {
    // 检查响应数据中是否包含登录要求
    if (data?.code === 104 || data?.requiresLogin === true) {
      // 清除登录状态
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        
        // 触发storage事件以通知useAuthSync hook
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "authToken",
            newValue: null,
            oldValue: localStorage.getItem("authToken"),
          }),
        );
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "user",
            newValue: null,
            oldValue: localStorage.getItem("user"),
          }),
        );
      }

      // 优先使用回调函数
      if (showLoginModalCallback) {
        showLoginModalCallback();
        return true; // 表示已处理登录需求
      }
      // 如果没有回调，发送全局事件
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("showLoginModal"));
        return true;
      }
    }
  }
  return false; // 未处理
}

/**
 * 包装fetch函数，自动处理登录需求
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);
  
  // 对于非成功的响应，尝试解析JSON来检查是否需要登录
  if (!response.ok) {
    try {
      const clone = response.clone();
      const data = await clone.json();
      checkApiResponse(response, data);
    } catch (e) {
      // 如果不是JSON响应，忽略错误
    }
  }
  
  return response;
}

