<template>
    <div class="container">
        <div class="container-l">
            <el-icon class="icon">
                <Operation />
            </el-icon>
            <div>find and replace</div>
        </div>
        <div class="container-c">hello world</div>
        <div class="container-r">
            <el-icon class="icon">
                <ArrowUpBold />
            </el-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { Operation, ArrowUpBold } from '@element-plus/icons-vue'

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
