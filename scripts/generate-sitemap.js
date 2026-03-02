import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ================= 配置区域 =================
const DOMAIN = 'https://wallpaper.gpg123.vip';
const MODULES_DIR = './src/router/modules';
const OUTPUT_FILE = './public/sitemap.xml';
const CHANGE_FREQ = 'daily';
const PRIORITY = '0.8';
// ===========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 递归读取目录下所有 .js 文件
function getAllJsFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsFiles(fullPath, arrayOfFiles);
    } else if (path.extname(file) === '.js' || path.extname(file) === '.ts') {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

// 从单个文件中提取路径，并处理父子关系
function extractPathsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const routes = [];

  // 记录当前文件遇到的最后一个“父级路径” (以 / 开头)
  let currentParentPath = '';

  // 匹配所有 path: '...'
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = pathRegex.exec(content)) !== null) {
    let p = match[1];

    // 1. 跳过通配符和动态参数
    if (p === '*' || p.includes(':')) {
      continue;
    }

    // 2. 判断是父路径还是子路径
    if (p.startsWith('/')) {
      // 这是一个新的父路径 (例如 /docker)
      currentParentPath = p;
      routes.push(p); // 添加父路径本身
    } else {
      // 这是一个子路径 (例如 overview)，需要拼接父路径
      if (currentParentPath) {
        // 拼接：确保连接处只有一个 /
        // 父: /docker, 子: overview -> /docker/overview
        const fullPath = `${currentParentPath}/${p}`;
        routes.push(fullPath);
      } else {
        // 极端情况：文件里先出现了子路径，没找到父路径
        // 这种通常是不规范的路由，可以选择跳过或当作根路径处理
        // 这里选择跳过，避免生成错误链接
        console.warn(`⚠️ 警告: 在 ${path.basename(filePath)} 中发现孤立子路径 '${p}'，未找到父路径，已跳过。`);
      }
    }
  }
  return routes;
}

try {
  const modulesPath = path.resolve(projectRoot, MODULES_DIR);

  if (!fs.existsSync(modulesPath)) {
    throw new Error(`找不到路由模块目录: ${modulesPath}`);
  }

  console.log('🔍 正在扫描路由模块目录:', MODULES_DIR);

  const allFiles = getAllJsFiles(modulesPath);
  console.log(`📂 发现 ${allFiles.length} 个路由模块文件`);

  let allRoutes = [];

  allFiles.forEach(file => {
    const paths = extractPathsFromFile(file);
    if (paths.length > 0) {
      allRoutes = [...allRoutes, ...paths];
    }
  });

  // 去重
  const uniqueRoutes = [...new Set(allRoutes)];

  console.log(`✅ 共提取到 ${uniqueRoutes.length} 个有效路由:`);
  uniqueRoutes.sort().forEach(r => console.log(`   - ${r}`));

  // 生成 XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const today = new Date().toISOString().split('T')[0];

  uniqueRoutes.forEach(route => {
    let cleanPath = route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route;
    const fullUrl = `${DOMAIN}${cleanPath}`;

    xml += '  <url>\n';
    xml += `    <loc>${fullUrl}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${CHANGE_FREQ}</changefreq>\n`;
    xml += `    <priority>${PRIORITY}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  const outputDir = path.dirname(path.resolve(projectRoot, OUTPUT_FILE));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.resolve(projectRoot, OUTPUT_FILE), xml, 'utf-8');

  console.log(`\n🎉 Sitemap 生成成功: ${OUTPUT_FILE}`);
  console.log(`🌐 预计收录链接数: ${uniqueRoutes.length}`);

} catch (error) {
  console.error('❌ 生成失败:', error.message);
  console.error(error.stack);
  process.exit(1);
}
