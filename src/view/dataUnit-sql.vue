<template>
    <div>
        <p>sqlDataUnit</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增sql单元</el-button>
        </div>


        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="Serial" width="65">
                <template #default="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="Name" width="120"></el-table-column>
            <el-table-column prop="sql" label="SQL" width="200"></el-table-column>
            <el-table-column prop="description" label="Description" width="120">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.description">
                        <span class="text-cell">{{ scope.row.description }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" :formatter="formatStatus" width="70"></el-table-column>
            <el-table-column prop="dataSourceId" label="Data Source ID"></el-table-column>

            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column label="Operate" width="110" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm.title" width="60%"
            :before-close="handleEditDialogClose">
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
                <el-form-item label="sql" prop="sql">
                    <MonacoEditor :initialValue=editForm.sql initialLanguage="sql" ref="MonacoEditor"
                        class="MonacoEditor">
                    </MonacoEditor>
                </el-form-item>
                <el-button type="primary" @click="handlePreviewSQLData">预览数据</el-button>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editForm.status" class="ml-4">
                        <el-radio label="0" size="small">启用</el-radio>
                        <el-radio label="1" size="small">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="DataSource" prop="dataSourceId">
                    <el-select v-model="editForm.dataSourceId" class="m-2" placeholder="请选择数据源类型"
                        @focus="focus_selectDataBase">
                        <el-option v-for="item in dataSources" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-drawer v-model="drawerVisible" direction="rtl" width="500">
            <template #header>
                <h4>预览结果</h4>
            </template>
            <template #default>
                <el-form-item v-if="IsShowBackBtn">
                    <el-button @click="handleBack">返回上一级</el-button>
                </el-form-item>
                <div v-if="IsDynamicParams">
                    <el-form-item v-for="item in SQLDynamicParams" :label="item.key" :prop="item.key">
                        <el-input v-model="item.value" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                </div>
                <MonacoEditor v-else :initialValue="DataEditorValue" initialLanguage="json" readOnly="true"
                    ref="DataEditor" class="DataEditor"></MonacoEditor>
            </template>
            <template #footer>
                <div style="flex: auto" v-if="!IsDynamicParams">
                    <el-button type="primary" @click="copyDataClipboard">复制数据</el-button>
                </div>
            </template>
        </el-drawer>

        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" :total="total" :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper" style="margin-top: 10px;">
        </el-pagination>
    </div>
</template>


<script>
import { onMounted, ref, defineAsyncComponent } from "vue";
import {
    SqlDataUnitList,
    AddSqlDataUnit,
    DeleteSqlDataUnit,
    UpdateSqlDataUnit,
    SQLResult,
    DataSourceList
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import MonacoEditor from "../components/monaco.vue";
import { publicKeyStr, extractKeyValuePairs, formatDateTime, encryptAES, decryptAES } from "../utils";
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
        const drawerVisible = ref(false); // sql预览数据 侧边栏

        const DataEditorValue = ref("");
        const IsDynamicParams = ref(false); // 是否显示动态参数配置
        const IsShowBackBtn = ref(false); // 是否显示 返回至动态参数配置按钮

        // 编辑表单数据
        const editForm = ref({
            title: "", // 标题
            type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            name: "",
            description: "",
            status: "",
            sql: "",
            dataSourceId: "",
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
            SqlDataUnitList(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询成功！");
                        res.data.data.forEach(item => item.sql = decryptAES(item.sql))
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
            AddSqlDataUnit(params)
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
            DeleteSqlDataUnit(params)
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
            const { code } = await UpdateSqlDataUnit(id, params);
            if (code == 200) {
                ElMessage.success("删除成功！");
                sqlDataUnitList();
            }
            showLoading.value = false;
        };

        const sqlResult = async (params = {}) => {
            const { code, data } = await SQLResult(params);
            if (code == 200) {
                DataEditor.value.setContentValue(
                    "[" +
                    data
                        .map((obj) => JSON.stringify(obj, null, 2))
                        .join(",\n") +
                    "]"
                );
            }
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
            editForm.value.title = "查看/修改 sql数据单元";
            editForm.value.type = "update";
            editForm.value.id = rowData.id;
            editForm.value.sql = rowData.sql;
            editForm.value.name = rowData.name;
            editForm.value.description = rowData.description;
            editForm.value.status = rowData.status + "";
            editForm.value.dataSourceId = rowData.dataSourceId;
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteSqlDataUnit(rowData.id);
            }).catch(() => {

            });
        };

        const handleAdd = () => {
            editForm.value.title = "新增sql数据单元";
            editForm.value.type = "add";
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
            // editFormRef.value.resetFields();
            Object.keys(editForm.value).forEach(
                (element) => (editForm.value[element] = "")
            );
            editFormRef.value.clearValidate();
        };

        const saveEditChanges = async () => {
            // 执行保存修改逻辑
            editDialogVisible.value = false;
            editForm.value.status = Number(editForm.value.status);
            // 加密长短文本使用aes
            editForm.value.sql = encryptAES(MonacoEditor.value.getContentValue());
            if (editForm.value.type == "add") {
                addSqlDataUnit(editForm.value);
            } else if (editForm.value.type == "update") {
                await updateSqlDataUnit(editForm.value.id, editForm.value);
            }
            console.log("save cf", editForm.value);
        };

        const handlePreviewSQLData = async () => {
            drawerVisible.value = true;
            const sql = MonacoEditor.value.getContentValue();

            if (sql.includes("=:")) {
                IsDynamicParams.value = true;
                let deletedItem = SQLDynamicParams.value.pop();
                while (deletedItem) {
                    deletedItem = SQLDynamicParams.value.pop();
                }
                const params = extractKeyValuePairs(sql);
                params.forEach((i) => {
                    SQLDynamicParams.value.push({
                        key: i.value,
                        value: "",
                    });
                });
                return;
            }
            IsDynamicParams.value = false;
            // 加密长短文本使用aes
            const sqlEncrypt = encryptAES(sql);
            await sqlResult({
                dataSourceId: editForm.value.dataSourceId,
                sql: sqlEncrypt,
            });
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
            IsDynamicParams.value = false;
            IsShowBackBtn.value = false;
        };

        const copyDataClipboard = async () => {
            const val = DataEditor.value.getContentValue();
            await navigator.clipboard.writeText(val);
            ElMessage.success("已复制到剪贴板");
        };

        const handleBack = async () => {
            IsDynamicParams.value = true;
            IsShowBackBtn.value = false;
        };

        const handleSearch = async () => {
            IsDynamicParams.value = false;
            IsShowBackBtn.value = true;
            let sql = MonacoEditor.value.getContentValue();
            SQLDynamicParams.value.forEach((element) => {
                sql = sql.replace(
                    ":" + element.key,
                    `'${element.value}'` || `''`
                );
            });
            const sqlEncrypt = encryptAES(sql);
            await sqlResult({
                dataSourceId: editForm.value.dataSourceId,
                sql: sqlEncrypt,
            });
        };

        const focus_selectDataBase = async () => {
            await dataSourceList();
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
            drawerVisible,
            DataEditorValue,
            IsDynamicParams,
            IsShowBackBtn,
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
            handleAdd,
            handlePreviewSQLData,
            handleEditConfirm,
            handleEditDialogClose,
            copyDataClipboard,
            handleBack,
            handleSearch,
            focus_selectDataBase,
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

:deep(.el-input__inner) {
    border: none !important;
}
</style>
