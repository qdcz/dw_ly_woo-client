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
import { initTheme } from "./utils/tailwindcss";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}



initTheme();


app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
