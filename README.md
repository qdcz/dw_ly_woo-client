# 简介

woo-server 是一个便于用户快速创建API和数据管理的系统，可视化配置操作，支持暗黑模式，支持离线部署部署。

在线地址: https://www.dwly.site:4999/static/admin   账号: admin 密码: admin （第一次进入需要点接口验证跳过 https的不安全请求。）

前端基于 vue3 + tsx + pinia + tailwindcss;编辑器用的微软的monaco。文件上传基于minio（后端做了签证颁发直接传的minio）。

后端基于 NestJs开发的，docker部署各个数据源 ，nginx 代理路由。node服务采用混淆加二进制打包，pm2守护。

接口地址: https://www.dwly.site:4999/documentation;  开源地址:等重构完

编辑器代码执行基于 node的 vm 模块。数据库的对接基于 Typeorm。权限管控基于rbac模型动态路由的控制基于pbac策略模型。socket服务基于ws。token验证基于jwt结合redis做了过期处理。文档基于swagger。日志系统基于log4js文件存储和落库mongodb（后期会解耦出日志分析系统）。

核心部署包 基于express开发。开源地址: 等重构完

# 项目遇到的问题

## vite 使用 需要 node 环境支持的库 比如安装了 minio 报了 process is not defined 错误

原因:

由于 minio 的 sdk 中使用了一些 node 的 api，在浏览器中运行时，由于浏览器不支持这些 api，所以会报错。这个时候需要安装 node 的 polyfill，来模拟 node 的环境。

解决办法：

安装 `vite-plugin-node-polyfills` 库，然后在 vite.config.js 中添加以下代码：

```js
import { nodePolyfills } from "vite-plugin-node-polyfills";
export default defineConfig({
    base: "/static/admin/",
    plugins: [
        vue(),
        vueJsx(),
        nodePolyfills({
            globals: {
                global: true,
                process: true,
            },
        }),
    ],
    optimizeDeps: {
        include: ["monaco-editor", "minio"],
    },
});
```

添加完之后运行当页面出现 GET http://localhost:5174/static/admin/node_modules/.vite/deps/minio.js?v=e7a9ae7e net::ERR_ABORTED 504 (Outdated Optimize Dep) 错误时：

需要在 vite.config.js 中添加

```js
  optimizeDeps: {
    exclude: ['minio'],
  },
```

当页面出现 X [ERROR] Cannot find module 'memfs' from '.' [plugin node-stdlib-browser-alias]

安装 `memfs` 库 并添加

```js
{
    "overrides": {
        // 由于浏览器不支持 `fs`，使用 `memfs` 包对其进行 polyfill。
        "fs": "memfs"
    }
}
```
