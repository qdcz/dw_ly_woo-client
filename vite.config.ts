import { defineConfig } from "vite";
import * as monaco from "monaco-editor";
import { resolve } from "path";
import process from "process";
import alias from "@rollup/plugin-alias";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
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
            // 覆盖特定模块的默认 polyfill。
            overrides: {
                // 由于浏览器不支持 `fs`，我们可以使用 `memfs` 包对其进行 polyfill。
                fs: "memfs",
            },
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(process.cwd(), 'src')
        }
    },
    optimizeDeps: {
        include: ["monaco-editor", "minio"],
    },
});
