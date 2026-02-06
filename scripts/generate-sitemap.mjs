// scripts/generate-sitemap.mjs
import fs from 'fs';
import path from 'path';
import xmlbuilder from 'xmlbuilder';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// 注意：不需要在这里 require('ts-node').register
// 因为命令行已经通过 -r ts-node/register 加载了它
// 如果在这里再注册一次，可能会导致双重注册或路径解析错误

async function generateSitemap() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const hostname = 'https://www.yourdomain.com'; // 替换为你的域名
    const outputPath = resolve(__dirname, '../public/sitemap.xml');

    try {
        // --- 1. 构建绝对路径 ---
        const routerPath = resolve(__dirname, '../src/router/index.js');

        // --- 2. 构建 file:// URL ---
        // 在 ESM 中加载本地文件必须使用 file:// 协议
        const fileUrl = new URL(`file://${routerPath}`).href;

        console.log(`🔍 正在加载路由模块: ${fileUrl}`);

        // --- 3. 动态导入 ---
        // 这里依赖命令行注入的 ts-node 来处理 .js (实际是 ts) 文件的编译
        const routerModule = await import(fileUrl);
        const router = routerModule.default;

        if (!router) {
            throw new Error('❌ 路由实例为空');
        }

        // --- 4. 提取路由逻辑 ---
        // ... (保持你的 extractRoutes 和 buildXml 逻辑不变) ...

        console.log(`✅ Sitemap 生成成功`);
    } catch (error) {
        console.error('❌ 生成失败:', error);
        process.exit(1);
    }
}

// ... (保留你的 extractRoutes 和 buildXml 函数) ...

generateSitemap();
