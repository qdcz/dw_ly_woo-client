// @ts-ignore
import Leaflet160 from "../view/Leaflet160.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { UserStore, LayoutStore } from "../store/index";

const routes = [
    {
        path: "/login",
        component: () => import("../view/login.vue"),
        meta: { title: "login", layout: "foreground" },
    },
    {
        path: "/componentTest",
        component: () => import("../view/componentTest.vue"),
        meta: { title: "componentTest", layout: "backstage" },
    },
    {
        path: "/ProjectManager",
        component: () => import("../view/ProjectManager.vue"),
        meta: { title: "ProjectManager", layout: "backstage" },
    },
    {
        path: "/APIManager",
        component: () => import("../view/API-manager/APIManager.vue"),
        meta: { title: "APIManager", layout: "backstage" },
    },
    {
        path: "/SqlDataUnit",
        component: () => import("../view/dataUnit-sql.vue"),
        meta: { title: "SqlDataUnit", layout: "backstage" },
    },
    {
        path: "/DataSource",
        component: () => import("../view/dataSource.vue"),
        meta: { title: "DataSource", layout: "backstage" },
    },
    {
        path: "/FunctionManager",
        component: () => import("../view/FunctionManager.vue"),
        meta: { title: "FunctionManager", layout: "backstage" },
    },
    {
        path: "/Leaflet160",
        component: () => import("../view/Leaflet160.vue"),
        meta: { title: "Leaflet160", layout: "backstage" },
    },
    {
        path: "/ExcelToJson",
        component: () => import("../view/excelToJson.vue"),
        meta: { title: "ExcelToJson", layout: "backstage" },
    },
    {
        path: "/MockManager",
        component: () => import("../view/dataUnit-mock.vue"),
        meta: { title: "MockManager", layout: "backstage" },
    },
    {
        path: "/logManager",
        component: () => import("../view/logManager.vue"),
        meta: { title: "logManager", layout: "backstage" },
    },
    {
        path: "/roleManager",
        component: () => import("../view/roleManager.vue"),
        meta: { title: "roleManager", layout: "backstage" },
    },
    {
        path: "/userManager",
        component: () => import("../view/userManager.vue"),
        meta: { title: "userManager", layout: "backstage" },
    },
    {
        path: "/TacticsManager",
        component: () => import("../view/TacticsManager.vue"),
        meta: { title: "TacticsManager", layout: "backstage" },
    },
    {
        path: "/SystemAPIManager",
        component: () => import("../view/SystemAPIManager.vue"),
        meta: { title: "SystemAPIManager", layout: "backstage" },
    },
    {
        path: "/dvtmp",
        component: () => import("../view/dvtmp/dvtmp.vue"),
        meta: { title: "dvtmp", layout: "backstage" },
    },

    {
        path: "/makeTable",
        component: () => import("../view/makeTable.vue"),
        meta: { title: "makeTable", layout: "backstage" },
    },
    {
        path: "/ActiveKeyManager",
        component: () => import("../view/activeKeyManager.vue"),
        meta: { title: "ActiveKeyManager", layout: "backstage" },
    },
    {
        path: "/API",
        component: () => import("../components/foreground/pages/API/API.tsx"),
        meta: { title: "API", layout: "backstage" },
    },
    {
        path: "/APIEditor",
        component: () => import("../components/foreground/pages/API/APIEditor/APIEditor.tsx"),
        meta: { title: "APIEditor", layout: "backstage" },
    },
    {
        path: "/",
        component: () => import("../components/foreground/pages/Home/Home.tsx"),
        meta: { title: "Home", layout: "backstage" },
    },
];

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const layoutStore = LayoutStore();
    document.title = to.meta.title as string || "system manager";

    if (to.meta.layout) {
        layoutStore.changeLayout(to.meta.layout as any);
    } else {
        layoutStore.changeLayout("backstage");
    }

    const userStore = UserStore();
    const userInfo = await userStore.isLogin();

    if (to.path === "/login") {
        if (userInfo) {
            next("/main");
        }
        next();
    }
    if (!userInfo) {
        if (to.fullPath.startsWith("/blog")) {
            next();
        }
        next("/login");
    } else {
        // 只要刷新一次啊   这个每次都刷新  可以用pinia缓存起来
        // if(userInfo){
        //     let res = await userStore.getUserInfo(JSON.parse(userInfo).id);
        //     console.log(6666,res)
        // }
    }
    next();
});

export default router;
