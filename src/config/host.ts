export default {
  web_dev: {
    // 开发环境接口请求
    NAME: "web_dev",
    API: 'http://localhost:9099',
    PATH: "/api", //"/dev-api/",
    // 开发环境 cdn 路径
    CDN: '',
    changeOrigin: true
  },
  web: {
    // 生产环境接口请求
    NAME: "web_prod",
    API: 'https://cloud-server.gpg123.vip',
    PATH: "/api", //"/prod-api/",
    // 开发环境 cdn 路径
    CDN: '',
    changeOrigin: true
  },
  test: {
    NAME: "test",
    // 测试环境接口地址
    API: 'http://ecs.gpg123.vip:9099',
    // 测试环境 cdn 路径
    PATH: "",
    CDN: '',
    changeOrigin: true
  },
  wallpaper: {
    NAME: "wallpaper",
    API: 'https://cloud-server.gpg123.vip',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  },
  wallpaper_dev: {
    NAME: "wallpaper_dev",
    API: 'http://localhost:9099',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  },
  tools_prod: {
    NAME: "tools_prod",
    API: 'https://cloud-server.gpg123.vip',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  },
  tools_dev: {
    NAME: "tools_dev",
    API: 'http://localhost:9099',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  }
};
