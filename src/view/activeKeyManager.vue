<template>
    <div>
        <p>ActiveKeyManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增激活设备</el-button>
        </div>

        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="marchingCode" label="marchingCode" width="560"></el-table-column>
            <el-table-column prop="accreditTime" label="accreditTime" width="150"
                :formatter="formatAccreditTime"></el-table-column>
            <el-table-column prop="description" label="description" width="400"></el-table-column>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column label="Operate" width="200" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleDownLoad(scope.row)">下载</el-button>
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm._title" width="60%"
            :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="机器码" prop="marchingCode">
                    <el-input v-model="editForm.marchingCode" placeholder="请输入机器码" />
                </el-form-item>
                <el-form-item label="授权时间" prop="accreditTime">
                    <el-select v-model="editForm.accreditTime" class="m-2" placeholder="请输选择设备授权时间">
                        <el-option v-for="key in Object.keys(accreditTimeMap)" :key="key" :label="accreditTimeMap[key]"
                            :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="授权码" prop="accreditCode">
                    <el-input v-model="editForm.accreditCode" placeholder="" disabled="true" type="textarea" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" placeholder="" type="textarea" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" :total="total" :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper" style="margin-top: 10px;">
        </el-pagination>
    </div>
</template>
<script>
import { onMounted, ref, defineAsyncComponent } from "vue";
import {
    ActiveKeyList,
    AddActiveKey,
    DeleteActiveKey,
    UpdateActiveKey,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateTime, formatAccreditTime, getAccreditTimeMap } from "../utils";


export default {
    setup() {
        /**
         * 变量数据
         */
        const accreditTimeMap = getAccreditTimeMap;

        const tableData = ref([]);

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const editDialogVisible = ref(false); // 编辑对话框可见性

        // 编辑表单数据
        const editForm = ref({
            _title: "", // 标题
            _type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            marchingCode: "",
            accreditTime: "",
            description: "",
        });
        // 编辑表单验证规则
        const editFormRules = ref({
            marchingCode: [
                {
                    required: true,
                    message: "请输入机器码",
                    trigger: "change",
                },
            ],
            accreditTime: [
                {
                    required: true,
                    message: "请选择授权时间",
                    trigger: "change",
                },
            ],
            // 其他字段的验证规则
        });

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);

        /**
         * api接口请求
         */
        const activeKeyList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            ActiveKeyList(params)
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

        const addActiveKey = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddActiveKey(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("新增成功！");
                        activeKeyList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const deleteActiveKey = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteActiveKey(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        activeKeyList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateActiveKey = async (id = "", params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateActiveKey(id, params);
            if (code == 200) {
                ElMessage.success("更新成功！");
                activeKeyList();
            }
            showLoading.value = false;
        };

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            activeKeyList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            activeKeyList(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.value._title = "查看/修改 数据源";
            editForm.value._type = "update";
            editForm.value.id = rowData.id;
            editForm.value.marchingCode = rowData.marchingCode;
            editForm.value.accreditTime = rowData.accreditTime;
            editForm.value.accreditCode = rowData.accreditCode;
            editForm.value.description = rowData.description;
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDownLoad = (rowData) => {
            let content = rowData.accreditCode;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Activation.key';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteActiveKey(rowData.id);
            }).catch(() => {

            });
        };

        const handleAdd = () => {
            editForm.value._title = "新增 数据源";
            editForm.value._type = "add";
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
            Object.keys(editForm.value).forEach(
                (element) => (editForm.value[element] = "")
            );
            editFormRef.value.clearValidate();
        };

        const saveEditChanges = async () => {
            // 执行保存修改逻辑
            // ...
            editDialogVisible.value = false;
            editForm.value.order = Number(editForm.value.order);
            editForm.value.status = Number(editForm.value.status);
            editForm.value.type = Number(editForm.value.type);

            // 新增
            if (editForm.value._type == "add") {
                addActiveKey(editForm.value);
            } else if (editForm.value._type == "update") {
                // 更新
                await updateActiveKey(editForm.value.id, editForm.value);
            }
            console.log("save cf", editForm.value);
        };

        const handleEditConfirm = async () => {
            const isValid = validateEditForm(); // 验证编辑表单的数据
            if (isValid) {
                // 执行保存修改操作
                await saveEditChanges();
            }
        };

        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            editDialogVisible.value = false;
        };

        /**
         * 生命周期
         */
        onMounted(() => {
            activeKeyList();
        });

        return {
            accreditTimeMap,
            tableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            editDialogVisible,
            editForm,

            editFormRef,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatAccreditTime,
            handleEdit,
            handleDownLoad,
            handleDelete,
            handleAdd,
            handleEditConfirm,
            handleEditDialogClose,

        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner) {
    border: none !important;
}
</style>
