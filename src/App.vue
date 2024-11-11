<script setup lang="ts">
import Navigation from "./layout/navigation.vue";
import leftMenu from "./layout/leftMenu.vue";
import { reactive } from "vue";

import { LayoutStore } from "./store";
const layoutStore = LayoutStore();
const data = reactive({
    collapse: false,
});
const onCollapse = (status: boolean) => (data.collapse = status);
</script>

<template>
    <div class="container">
        <router-view v-if="layoutStore.GETLAYOUTTYPE() == 'foreground'"></router-view>
        <template v-if="layoutStore.GETLAYOUTTYPE() == 'backstage'">
            <div class="leftMenu">
                <leftMenu :collapse="data.collapse"></leftMenu>
            </div>
            <div class="rightContent" :class="{
                isFullWidth: data.collapse,
            }">
                <Navigation @onCollapse="onCollapse"></Navigation>
                <div style="padding: 0 10px;">
                    <router-view></router-view>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    display: flex;
    // width: 100%;
    // height: 100vh;

    .leftMenu {
        // width: 200px;
        height: 100%;
    }

    .rightContent {
        min-height: 100%;
        min-width: calc(100% - 200px);
        overflow-y: scroll;
    }

    .isFullWidth {
        min-width: calc(100% - 64px);
    }
}
</style>
