export default {
  development: {
    NAME: "wallpaper",
    API: 'http://localhost:9099',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  },
  prod: {
    NAME: "wallpaper",
    API: 'https://cloud-server.gpg123.vip',
    PATH: "/api",
    CDN: '',
    changeOrigin: true
  },
};
