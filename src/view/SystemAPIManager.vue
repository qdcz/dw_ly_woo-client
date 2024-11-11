<template>
    <div>
        <p>systemAPIManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <!-- <el-button type="primary" @click="handleRoleAdd">重新查询</el-button> -->
        </div>

        <!-- 表格 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="operationId" label="operationId" width="400"></el-table-column>
            <el-table-column prop="path" label="path" width="400"></el-table-column>
            <el-table-column prop="summary" label="summary" width="200"></el-table-column>
            <el-table-column prop="description" label="description" width="300">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.description">
                        <span class="text-cell">{{ scope.row.description }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="method" label="method" width="80"></el-table-column>
            <el-table-column label="Operate" width="110" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" :total="total" :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper" style="margin-top: 10px;">
        </el-pagination>
    </div>
</template>


<script>
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import {
    SystemAPIs,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone, formatDateTime } from "../utils";

export default {
    setup() {
        /**
         * 变量数据
         */
        const tableData = ref([]);

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const editDialogVisible = ref(false); // 编辑对话框可见性

        // 过滤查询表单数据
        const filterForm = reactive({
            name: "",
            describe: "",
            status: "",
            parentId: "",
        })

        // 编辑表单数据
        const editForm = reactive({
            name: "",
            describe: "",
            status: "",
            parentId: "",
        });


        // 编辑表单验证规则
        const editFormRules = ref({});


        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);

        /**
         * api接口请求
         */
        const systemAPIs = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            SystemAPIs(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询成功！");
                        tableData.value = res.data.data; // 更新表格数据
                        total.value = res.data.meta.itemCount; // 更新总记录数
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            systemAPIs(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            systemAPIs(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.title = "查看/修改 角色信息";
            editForm.type = "update";
            editForm.id = rowData.id;
            editForm.name = rowData.name;
            editForm.describe = rowData.describe;
            editForm.status = rowData.status + "";
            editForm.parentId = rowData.parentId;
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };


        const validateEditForm = () => {
            return new Promise((resolve) => {
                editFormRef.value.validate((valid) => {
                    resolve(valid);
                });
            });
        };

        const resetEditForm = () => {
            Object.keys(editForm).forEach(
                (element) => (editForm[element] = "")
            );
            editFormRef.value.clearValidate();
        };

        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            editDialogVisible.value = false;
        };

        /**
         * 生命周期
         */
        onMounted(async () => {
            systemAPIs();
        });

        return {

            tableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            editDialogVisible,
            filterForm,
            editForm,
            editFormRef,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            handleEdit,
            handleEditDialogClose,

        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner) {
    border: none !important;
}

.text-cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}
</style>
