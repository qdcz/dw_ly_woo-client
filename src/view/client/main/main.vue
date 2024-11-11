<template>
    <div class="container">
        <!-- <mainHeader class="header"></mainHeader>
        <mainFooter class="footer"></mainFooter> -->
        <!-- <mainLeftMenu></mainLeftMenu> -->
        <!-- <SidebarProvider>
            <SidebarMenu>
                <SidebarItem></SidebarItem>
            </SidebarMenu>
        </SidebarProvider> -->
        <app></app>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { Lock, UserFilled } from '@element-plus/icons-vue'
import type { FormInstance } from "element-plus";

import mainHeader from '../../../components/foreground-header/main-header.vue';
import mainFooter from '../../../components/foreground-footer/main-footer.vue';
import mainLeftMenu from '../../../components/foreground-left/main-left.vue';
import { SidebarMenu, SidebarItem } from '../../../components/foreground/sideBar.tsx';
import SidebarProvider from "../../../components/foreground/SidebarProvider.tsx";
import app from "../../../components/foreground/app.tsx";


export default {
    components: {
        mainHeader,
        mainFooter,
        mainLeftMenu,
        SidebarMenu,
        SidebarItem,
        SidebarProvider,
        app
    },
    setup() {
        return {
        };
    },
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;

    & .header {
        height: 20px;
    }

    & .footer {
        height: 20px;
        align-items: flex-end;
    }

}
</style>
