import { NextResponse } from 'next/server';

type ResponseData<T = any> = {
  code: string;
  msg: string;
  data?: T;
};

export class ApiResponse {
  static success<T>(data?: T, msg: string = '操作成功'): NextResponse {
    return NextResponse.json({
      code: '200',
      msg,
      data,
    });
  }

  static error(msg: string = '操作失败', code: number = 400): NextResponse {
    return NextResponse.json({
      code,
      msg,
      data: null,
    });
  }

  static unauthorized(msg: string = '未授权'): NextResponse {
    return NextResponse.json({
      code: '401',
      msg,
      data: null,
    });
  }
}
