<template>
  <el-dialog v-model="_dialogVisible" title="Tips" width="30%" :before-close="handleClose">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox } from "element-plus";
import { ref, watchEffect } from "vue";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});

let _dialogVisible = ref(false);
watchEffect(() => {
  _dialogVisible.value = Boolean(props.dialogVisible);
});

const emits = defineEmits(["close", "confirm"]);

const handleClose = () => {
  emits("close", false);
};

const handleConfirm = () => {
  ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
    emits("confirm", true);
  });
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
