<template>
    <div class="container">
        <div class="hookUI">
            <el-button type="primary" @click="gengrate">生成</el-button>
            <el-input v-model="hookForm.toolId" placeholder="Please input">
                <template #prepend>toolId</template>
            </el-input>
        </div>
        <div class="editor">
            <MonacoEditor :initialValue="logic" initialLanguage="javascript" ref="Editor" style="height:80vh;">
            </MonacoEditor>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MonacoEditor from '../../components/monaco.vue'
import { reactive, ref } from 'vue';
import * as jjj from './index';
const hookForm = reactive({
    toolId: ""
});
const logic = ref("");


/**
 * ref dom
 */
const Editor: any = ref(null)




const gengrate = () => {
    Editor.value.setContentValue(jjj.initDatavHook());
}
</script>

<style lang="scss" scoped>
.container {
    .hookUI {
        display: flex;
        flex-direction: column;
        width: 50%;

        .cte-row {
            display: flex;
            flex-direction: column;
        }
    }

    .editor {
        width: 50%;
    }
}
</style>