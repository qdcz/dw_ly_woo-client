import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
// import App from "./App.vue";
import App from "./components/foreground/app.tsx";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "./components/index.scss";
import { initTheme } from "@/utils";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}


// // 预先加载monaco-editor的js文件（文件过大，跳转页面的时候第一次加载会卡住）
// const modules = import.meta.glob('/assets/monaco-*.js');
// Object.keys(modules).forEach((path) => {
//     const preload = document.createElement('link');
//     preload.rel = 'preload';
//     preload.href = path;
//     preload.as = 'script';
//     document.head.appendChild(preload);
// });


initTheme();


app.config.warnHandler = (msg, vm, trace) => {
    if (msg.includes('injection "Symbol(form)" not found')) {
        return;
    }
    console.warn(msg, vm, trace);
};

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
