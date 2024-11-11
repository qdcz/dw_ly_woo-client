<template>
    <div class="container">
        <h1 class="text-3xl font-bold underline">
            Hello world!
        </h1>
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
}
</style>
