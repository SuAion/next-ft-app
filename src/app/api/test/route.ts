import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 处理 GET 请求
export async function GET(request: NextRequest) {
    // 这里可以处理查询参数 ?xxxx=xxxx
    const { searchParams } = new URL(request.url);
    // console.log(request.nextUrl)
    const name = searchParams.get('name') || 'World';

    return NextResponse.json({ message: `Hello, ${name}!` });
}

// 处理 POST 请求
export async function POST(request: NextRequest) {
    // 解析请求体中的 JSON
    const jsonData = await request.json();
    const name = jsonData.name || 'World';

    return NextResponse.json({ message: `Hello, ${name}!` });
}


// 处理 PUT 请求
export async function PUT(request: NextRequest) {
    // 解析请求体中的 JSON
    const formData = await request.formData();
    const name = formData.get('name') || 'World';

    return NextResponse.json({ message: `Hello, ${name}!` });
}


// 处理 二进制
export async function DELETE(request: NextRequest) {
    // 假设图片存储在项目的 public/images 目录下
    const imagePath = path.join(process.cwd(), 'public', 'images', 'icon.png');

    try {
        // 读取图片文件为二进制数据
        const imageBuffer = await fs.readFile(imagePath);
        // 返回二进制图片数据
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png', // 根据图片类型设置
                'Content-Disposition': 'inline', // 或者 'attachment' 如果你想提示下载
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
}