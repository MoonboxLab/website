import { NextResponse } from "next/server";

/**
 * 处理外部API响应，检测code 104并返回统一的401响应
 * 当code为104时，表示需要重新登录
 */
export function handleApiResponse(data: any, defaultErrorMsg: string) {
  // 检查是否为登录错误码
  if (data.code === 104) {
    return NextResponse.json(
      { 
        code: 104, 
        msg: data.msg || "请登录后再操作",
        requiresLogin: true 
      },
      { status: 401 }
    );
  }

  // 其他错误处理
  if (data.code !== 0) {
    return NextResponse.json(
      { error: data.msg || defaultErrorMsg },
      { status: 400 }
    );
  }

  return null; // 表示成功，继续处理
}

