<template>
    <div>
        <p>mockDataUnit</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增mock单元</el-button>
        </div>

        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="name" label="Name" width="120"></el-table-column>
            <el-table-column prop="description" label="Description">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.description">
                        <span class="text-cell">{{ scope.row.description }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" :formatter="formatStatus" width="70"></el-table-column>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime" width="180"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime" width="180"></el-table-column>
            <el-table-column label="Operate" width="240" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button link type="primary" @click="handleDownload(scope.row)">下载(10M内)</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm.title" width="60%" :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="名字" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入数据单元名称" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" placeholder="请输入数据单元描述" />
                </el-form-item>
                <el-form-item label="schema" prop="schema">
                    <MonacoEditor :initialValue=editForm.schema initialLanguage="json" ref="MonacoEditor"
                        class="MonacoEditor"></MonacoEditor>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editForm.status" class="ml-4">
                        <el-radio label="0" size="small">启用</el-radio>
                        <el-radio label="1" size="small">禁用</el-radio>
                    </el-radio-group>
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
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import {
    MockDataUnitList,
    AddMockDataUnit,
    DeleteMockDataUnit,
    UpdateMockDataUnit,
    DataSourceList
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import MonacoEditor from "../components/monaco.vue";
import { formatDateTime } from "../utils";
export default {
    components: {
        MonacoEditor,
    },
    setup() {
        /**
         * 变量数据
         */
        const tableData = ref([]);

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const dataSources = ref([]); // 数据源列表
        const showLoading = ref(false); // 控制显示加载中遮罩层

        const editDialogVisible = ref(false); // 编辑对话框可见性

        // 编辑表单数据
        const editForm = reactive({
            title: "", // 标题
            type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            name: "",
            description: "",
            status: "",
            schema: "",
        });
        // 编辑表单验证规则
        const editFormRules = ref({
            name: [
                {
                    required: true,
                    message: "请输入数据单元的名称",
                    trigger: "change",
                },
            ],
            status: [
                {
                    required: true,
                    message: "请选择数据单元状态",
                    trigger: "change",
                },
            ],
            // 其他字段的验证规则
        });

        const SQLDynamicParams = ref([]); // sql语句的动态参数

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);
        const MonacoEditor = ref(null);
        const DataEditor = ref(null);

        // 工具函数
        const formatStatus = function (row, column) {
            return row[column.property] === 0 ? "启用" : "禁用";
        };

        /**
         * api接口请求
         */
        const sqlDataUnitList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            MockDataUnitList(params)
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

        const addSqlDataUnit = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddMockDataUnit(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("新增成功！");
                        sqlDataUnitList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const deleteSqlDataUnit = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteMockDataUnit(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        sqlDataUnitList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateSqlDataUnit = async (id = "", params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateMockDataUnit(id, params);
            if (code == 200) {
                ElMessage.success("更新成功！");
                sqlDataUnitList();
            }
            showLoading.value = false;
        };

        const dataSourceList = async (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 99999,
                };
            }
            const { code, data } = await DataSourceList(params);
            if (code == 200) {
                dataSources.value = data.data.map((i) => {
                    i.label = i.name;
                    i.value = i.id;
                    return i;
                });
            }
        };


        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            sqlDataUnitList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            sqlDataUnitList(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.title = "查看/修改 mock数据单元";
            editForm.type = "update";
            editForm.id = rowData.id;
            editForm.schema = rowData.schema;
            // MonacoEditor.value.setContentValue(rowData.schema);
            editForm.name = rowData.name;
            editForm.description = rowData.description;
            editForm.status = rowData.status + "";
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteSqlDataUnit(rowData.id);
            }).catch(() => {

            });
        };

        const handleDownload = (rowData) => {
            const fileName = `${rowData.name}-${rowData.id}.json`;
            const mimeType = 'text/plain';

            const blob = new Blob([rowData.schema], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        }

        const handleAdd = () => {
            editForm.title = "新增mock数据单元";
            editForm.type = "add";
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
            MonacoEditor.value.setContentValue("");
        };

        const saveEditChanges = async () => {
            // 执行保存修改逻辑
            // ...
            editDialogVisible.value = false;
            editForm.status = Number(editForm.status);
            editForm.schema = MonacoEditor.value.getContentValue();
            // 新增
            if (editForm.type == "add") {

                addSqlDataUnit(editForm);
            } else if (editForm.type == "update") {
                // 更新
                await updateSqlDataUnit(editForm.id, editForm);
            }
            console.log("save cf", editForm);
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

        const copyDataClipboard = async () => {
            const val = DataEditor.value.getContentValue();
            await navigator.clipboard.writeText(val);
            ElMessage.success("已复制到剪贴板");
        };

        /**
         * 生命周期
         */
        onMounted(async () => {
            sqlDataUnitList();
            await dataSourceList();
        });

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            dataSources,
            showLoading,
            editDialogVisible,
            editForm,
            SQLDynamicParams,

            editFormRef,
            MonacoEditor,
            DataEditor,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatStatus,
            handleEdit,
            handleDelete,
            handleDownload,
            handleAdd,
            handleEditConfirm,
            handleEditDialogClose,
            copyDataClipboard,
        };
    },
};
</script>

<style scoped>
.MonacoEditor {
    height: 300px;
    border-radius: 4px;
    overflow: hidden;
}

.DataEditor {
    border-radius: 4px;
    overflow: hidden;
}

:deep(.el-input__inner)  {
    border: none !important;
}
</style>
