<template>
    <div>
        <p>DataSource</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增数据源</el-button>
        </div>


        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="Serial" width="65">
                <template #default="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime" width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime" width="110"></el-table-column>
            <el-table-column prop="name" label="Name" width="150"></el-table-column>
            <el-table-column prop="type" label="Type" width="100"></el-table-column>
            <el-table-column prop="host" label="Host" width="150"></el-table-column>
            <el-table-column prop="port" label="Port" width="80"></el-table-column>
            <el-table-column prop="username" label="Username"></el-table-column>
            <el-table-column prop="password" label="Password"></el-table-column>
            <el-table-column prop="database" label="Database"></el-table-column>

            <el-table-column label="Operate" width="110" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm._title" width="60%" :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="名字" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入数据源名称" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="editForm.type" class="m-2" placeholder="请选择数据源类型">
                        <el-option v-for="item in databaseType" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="主机" prop="host">
                    <el-input v-model="editForm.host" placeholder="请输入数据源主机信息" />
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="editForm.port" placeholder="请输入数据源端口信息" />
                </el-form-item>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="editForm.username" placeholder="请输入数据源账号" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" placeholder="请输入数据源密码" />
                </el-form-item>
                <el-form-item label="数据库" prop="database">
                    <el-select v-model="editForm.database" class="m-2" placeholder="请选择数据库" @focus="focus_selectDataBase">
                        <el-option v-for="item in selectDataBase" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
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
    DataSourceList,
    AddDataSource,
    DeleteDataSource,
    UpdateDataSource,
    TestDataBaseConn,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { extractKeyValuePairs, formatDateTime } from "../utils/index";

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
        const databaseType = ref([
            { label: "mysql", value: "mysql" },
            { label: "postgres", value: "postgres" },
            { label: "mongodb", value: "mongodb" },
            { label: "SQLserver", value: "SQLserver" },
            { label: "oracle", value: "oracle" },
            { label: "SQLite", value: "SQLite" },
            { label: "redis", value: "redis" },
        ]); // 数据库类型选择
        const selectDataBase = ref([]) // 数据库选库

        const editDialogVisible = ref(false); // 编辑对话框可见性

        // 编辑表单数据
        const editForm = ref({
            _title: "", // 标题
            _type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            name: "",
            type: "",
            host: "",
            port: "",
            username: "",
            password: "",
            database: "",
        });
        // 编辑表单验证规则
        const editFormRules = ref({
            name: [
                {
                    required: true,
                    message: "请输入数据源的名称",
                    trigger: "change",
                },
            ],
            type: [
                {
                    required: true,
                    message: "请选择数据库类型",
                    trigger: "change",
                },
            ],
            // 其他字段的验证规则
        });

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);

        // 工具函数
        const formatStatus = function (row, column) {
            return row[column.property] === 0 ? "启用" : "禁用";
        };

        /**
         * api接口请求
         */
        const dataSourceList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            DataSourceList(params)
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

        const addDataSource = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddDataSource(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("新增成功！");
                        dataSourceList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                    resetEditForm(); // 重置编辑表单的数据和验证状态
                });
        };

        const deleteDataSource = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteDataSource(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        dataSourceList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateDataSource = async (id = "", params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateDataSource(id, params);
            if (code == 200) {
                ElMessage.success("更新成功！");
                dataSourceList();
            }
            showLoading.value = false;
        };

        const testDataBaseConn = async (params) => {
            const { code, data } = await TestDataBaseConn(params);
            if (code == 200) {
                let deletedItem = selectDataBase.value.pop();
                while (deletedItem) {
                    deletedItem = selectDataBase.value.pop();
                }
                selectDataBase.value = data.map((i) => {
                    i.label = i.Database;
                    i.value = i.Database;
                    return i;
                });
            }
        }

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            dataSourceList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            dataSourceList(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.value._title = "查看/修改 数据源";
            editForm.value._type = "update";
            editForm.value.id = rowData.id;
            editForm.value.name = rowData.name;
            editForm.value.type = rowData.type;
            editForm.value.host = rowData.host;
            editForm.value.port = rowData.port;
            editForm.value.username = rowData.username;
            editForm.value.password = rowData.password;
            editForm.value.database = rowData.database;
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteDataSource(rowData.id);
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
            editForm.value.port = Number(editForm.value.port);

            // 新增
            if (editForm.value._type == "add") {
                addDataSource(editForm.value);
            } else if (editForm.value._type == "update") {
                // 更新
                await updateDataSource(editForm.value.id, editForm.value);
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

        const focus_selectDataBase = async () => {
            editForm.value.port = Number(editForm.value.port)
            await testDataBaseConn(editForm.value)
        }

        /**
         * 生命周期
         */
        onMounted(() => {
            dataSourceList();
        });

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            databaseType,
            selectDataBase,
            editDialogVisible,
            editForm,

            editFormRef,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatStatus,
            handleEdit,
            handleDelete,
            handleAdd,
            handleEditConfirm,
            handleEditDialogClose,

            focus_selectDataBase
        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner)  {
    border: none !important;
}
</style>
