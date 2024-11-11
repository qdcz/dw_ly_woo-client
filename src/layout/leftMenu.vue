<template>
    <div class="leftMenu" v-show="da_isShow">
        <el-menu :collapse="collapse" active-text-color="#ffd04b" background-color="#545c64"
            class="el-menu-vertical-demo" default-active="2" text-color="#fff" @open="handleOpen" @close="handleClose"
            @select="handleSelect">
            <el-menu-item index="home">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>首页</template>
            </el-menu-item>
            <el-menu-item index="project">
                <el-icon>
                    <Avatar />
                </el-icon>
                <template #title>项目管理</template>
            </el-menu-item>
            <el-menu-item index="activeKey">
                <el-icon>
                    <Key />
                </el-icon>
                <template #title>密钥管理</template>
            </el-menu-item>
            <el-menu-item index="interface">
                <el-icon>
                    <MagicStick />
                </el-icon>
                <template #title>接口管理</template>
            </el-menu-item>
            <el-menu-item index="logger">
                <el-icon>
                    <Files />
                </el-icon>
                <template #title>日志管理</template>
            </el-menu-item>
            <el-menu-item index="componentTest">
                <el-icon>
                    <Files />
                </el-icon>
                <template #title>测试、其他</template>
            </el-menu-item>

            <el-sub-menu index="dataSource">
                <template #title>
                    <el-icon>
                        <Coin />
                    </el-icon>
                    <span>数据源管理</span>
                </template>
                <el-menu-item index="dataSource-dataBase">数据库</el-menu-item>
                <el-sub-menu index="dataSource-dataUnit">
                    <template #title><span>数据单元</span></template>
                    <el-menu-item index="dataSource-dataUnit-sql">sql数据单元</el-menu-item>
                    <el-menu-item index="dataSource-dataUnit-mock">mock数据单元</el-menu-item>
                    <el-menu-item index="dataSource-dataUnit-gis">gis数据单元</el-menu-item>
                    <el-menu-item index="dataSource-dataUnit-proxy">proxy数据单元</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="dataSource-makeTable">
                    <template #title><span>业务建表</span></template>
                    <el-menu-item index="dataSource-makeTable-flow">建表流</el-menu-item>
                    <el-menu-item index="dataSource-makeTable-tabList">表列表</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="controller">
                <template #title>
                    <el-icon>
                        <SetUp />
                    </el-icon>
                    <span>权限控制</span>
                </template>
                <el-menu-item index="controller-role">角色管理</el-menu-item>
                <el-menu-item index="controller-user">用户管理</el-menu-item>
                <el-menu-item index="controller-tactics">策略管理</el-menu-item>
                <el-menu-item index="controller-system-API">系统接口管理</el-menu-item>
                <el-menu-item index="controller-menu-permission">菜单管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="other">
                <template #title>
                    <el-icon>
                        <Coin />
                    </el-icon>
                    <span>工具管理</span>
                </template>
                <el-menu-item index="other-toolFunction">工具函数</el-menu-item>
                <el-menu-item index="other-gisDev">GIS地图</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { UserStore } from "../store";
import { watch, ref, onMounted } from "vue";
import router from "../router";

defineProps({
    collapse: Boolean,
});

const da_isShow = ref(false);

const userStore = UserStore();

watch(
    () => {
        userStore.$state.userInfo;
    },
    async () => {
        da_isShow.value = Boolean(userStore.$state.userInfo);
    },
    { deep: true, immediate: true }
);
onMounted(async () => {
    const isLogin = await userStore.isLogin();
    da_isShow.value = isLogin ? true : false;
});

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};

const handleSelect = (index: string, indexPath: string[], item: any) => {
    const routerName = {
        home: "/",
        project: "ProjectManager",
        interface: "APIManager",
        activeKey:"ActiveKeyManager",
        logger: "logManager",
        componentTest: "componentTest",
        "dataSource-dataBase": "DataSource",
        "dataSource-dataUnit-sql": "SqlDataUnit",
        "dataSource-dataUnit-mock": "MockManager",
        "dataSource-dataUnit-gis": "Leaflet160",
        // "dataSource-dataUnit-proxy": "",
        "controller-role": "roleManager",
        "controller-user": "userManager",
        "controller-tactics": "TacticsManager",
        "controller-system-API": "SystemAPIManager",
        "other-toolFunction": "FunctionManager",
        "other-gisDev": "ExcelToJson",
        "dataSource-makeTable-flow": "makeTable",

    };
    routerName[index] ? router.push(routerName[index]) : "";
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.leftMenu {
    background-color: rgb(84 92 100);
    /* margin-right: 10px; */
}

/deep/ .el-menu {
    border-right: none;
}
</style>
