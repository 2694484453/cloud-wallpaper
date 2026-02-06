// scripts/generate-sitemap.cjs
const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

// --- ⚠️ 核心修复：必须在文件顶部、任何逻辑前注册 ts-node ---
// 这一步必须在 import() 之前执行，否则 Node.js 会直接报错
require('ts-node').register({
    // 指向配置文件
    project: path.resolve(__dirname, '../tsconfig.json'),
    // 关键：允许 ts-node 处理 .js 文件（因为我们的源码是 .js 但内容是 TS/ESM）
    allowJs: true,
    // 关键：即使没有 "type": "module" 也尝试作为 ESM 处理
    esm: true,
    // 跳过类型检查以加快速度
    transpileOnly: true
});

async function generateSitemap() {
    const hostname = 'https://www.yourdomain.com'; // 替换为你的域名
    const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

    try {
        // --- 1. 构建绝对路径 ---
        // 注意：这里指向的是 .js 文件，不是 .ts
        const routerPath = path.resolve(__dirname, '../src/router/index.js');

        // --- 2. 使用 file:// URL 格式 ---
        // 这是让 ts-node 在 ESM 模式下生效的关键
        const fileUrl = `file://${routerPath}`;

        console.log(`🔍 正在加载路由模块: ${fileUrl}`);

        // --- 3. 动态导入 ---
        // 这一步会触发 ts-node 的编译
        const routerModule = await import(fileUrl);
        const router = routerModule.default;

        if (!router) {
            throw new Error('❌ 路由实例为空');
        }

        const routes = router.options?.routes;
        if (!Array.isArray(routes)) {
            throw new Error('❌ 路由配置不是数组');
        }

        console.log(`✅ 成功加载 ${routes.length} 个路由`);

        // --- 4. 生成逻辑 ---
        const excludePaths = ['/404', '/404.html', '/private'];
        const urls = [];
        extractRoutes(routes, urls, excludePaths);

        const xml = buildXml(urls, hostname);
        fs.writeFileSync(outputPath, xml, 'utf-8');

        console.log(`✅ Sitemap 生成成功: ${outputPath}`);
        console.log(`📊 包含 ${urls.length} 个页面`);

    } catch (error) {
        console.error('❌ 生成失败:', error);
        process.exit(1);
    }
}

function extractRoutes(routeArray, accumulator, excludePaths) {
    routeArray.forEach(route => {
        const path = route.path;
        if (path &&
            !path.includes(':') &&
            !path.includes('*') &&
            !excludePaths.includes(path) &&
            !accumulator.includes(path)) {
            accumulator.push(path);
        }
        if (route.children) {
            extractRoutes(route.children, accumulator, excludePaths);
        }
    });
}

function buildXml(urls, hostname) {
    const root = xmlbuilder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
    root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    urls.forEach(url => {
        const page = root.ele('url');
        page.ele('loc', {}, `${hostname}${url === '/' ? '' : url}`);
        page.ele('changefreq', {}, 'daily');
        page.ele('priority', {}, '0.8');
    });
    return root.end({ pretty: true });
}

generateSitemap();
