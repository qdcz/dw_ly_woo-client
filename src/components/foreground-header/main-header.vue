<template>
    <div class="container">
        <div class="container-l">
            <el-icon class="icon">
                <Operation />
            </el-icon>
            <div>apitools</div>
        </div>
        <div class="container-c">hello world</div>
        <div class="container-r">头像</div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { UserStore } from "../../../store";
import { Operation } from '@element-plus/icons-vue'

export default {
    setup() {
        return {

        };
    },
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: #000;
    color: #fff;
    user-select: none;
    padding: 10px;
    height: 40px;

    &-l {
        display: flex;
        align-items: center;

        & .icon {
            font-size: 18px;
            padding: 0 10px;
        }
    }
}
</style>
