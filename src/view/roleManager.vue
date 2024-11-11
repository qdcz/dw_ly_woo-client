<template>
    <div>
        <p>roleManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleRoleAdd">新增角色</el-button>
        </div>

        <!-- 表格 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="name" label="名字" width="300"></el-table-column>
            <el-table-column prop="describe" label="描述">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.describe">
                        <span class="text-cell">{{ scope.row.describe }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus" width="60"></el-table-column>
            <el-table-column prop="parentId" label="父级id" width="200"></el-table-column>
            <el-table-column label="Operate" width="300" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <!-- <el-button link type="primary" @click="handleBindSystemAPI(scope.row)">绑定系统接口</el-button> -->
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog v-model="editDialogVisible" :title="editForm.title" width="60%" :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="名字" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="editForm.describe" placeholder="请输入角色描述" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editForm.status" class="ml-4">
                        <el-radio label="0" size="small">启用</el-radio>
                        <el-radio label="1" size="small">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="父角色" prop="parentId">
                    <el-input v-model="editForm.parentId" placeholder="请选择父级角色" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 选择绑定系统内部接口 -->
        <el-dialog v-model="systemAPIDialogVisible" :title="systemAPIForm.title" width="60%" style="overflow: scroll; height: 80%;"
            :before-close="systemAPIDialogClose">
            <el-form :model="systemAPIForm" :rules="systemAPIRules" ref="systemAPIRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="systemAPIForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item>
                    <el-checkbox-group v-model="systemAPIForm.APIS">
                        <el-checkbox style="width: 100%;" size="small" v-for="item in systemAPIsData" :key="item.operationId" :label="item.operationId"
                            @change="handleAPISelectChange">{{
                                `${item.path}(${item.summary})` }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="systemAPIConfirm">确定</el-button>
                    <el-button @click="systemAPIDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

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
    RoleList,
    AddRole,
    DeleteRole,
    UpdateRole,
    SystemAPIs
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

        const systemAPIsData = ref(0); // 全部系统apis

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const editDialogVisible = ref(false); // 编辑对话框可见性
        const systemAPIDialogVisible = ref(false); // 绑定系统内部api接口对话框可见性


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

        const systemAPIForm = reactive({
            title: "",
            id:"",
            APIS:[]
        })
        const systemAPIRules = ref({});

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);
        const systemAPIRef = ref(null);

        // 工具函数
        const formatStatus = function (row, column) {
            return row[column.property] === 0 ? "启用" : "禁用";
        };

        /**
         * api接口请求
         */
        const roleList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            RoleList(params)
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

        const deleteRole = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteRole(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        roleList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const addRole = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddRole(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data);
                        roleList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                    editDialogVisible.value = false;
                });
        };

        const updateRole = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            UpdateRole(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data);
                        roleList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                    editDialogVisible.value = false;
                });
        };


        const systemAPIs = (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 9999999,
                };
            }
            SystemAPIs(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询成功！");
                        systemAPIsData.value = res.data.data
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
            roleList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            roleList(); // 发起新的请求
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

        const handleRoleAdd = () => {
            editForm.title = "新增角色信息";
            editForm.type = "add";
            editDialogVisible.value = true;
        }

        const handleBindSystemAPI = (rowData) => {
            systemAPIForm.id = rowData.id;
            systemAPIDialogVisible.value = true;
        }

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteRole(rowData.id);
            }).catch(() => {

            });
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

        const handleEditConfirm = () => {
            editForm.status = Number(editForm.status);
            if (editForm.type == "add") {
                addRole(editForm);
            } else if (editForm.type == "update") {
                updateRole(editForm)
            }
        }

        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            editDialogVisible.value = false;
        };

        const systemAPIConfirm = () => {
            systemAPIDialogVisible.value = false;
        }

        const systemAPIDialogClose = () => {
            systemAPIDialogVisible.value = false;
        }

        const handleAPISelectChange = ()=>{

        }

        /**
         * 生命周期
         */
        onMounted(async () => {
            roleList();
            systemAPIs();
        });

        return {

            tableData,
            currentPage,
            pageSize,
            total,

            systemAPIsData,

            showLoading,
            editDialogVisible,
            systemAPIDialogVisible,
            filterForm,
            editForm,
            systemAPIForm,
            editFormRef,
            systemAPIRef,


            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatStatus,
            handleEdit,
            handleBindSystemAPI,
            handleRoleAdd,
            handleDelete,
            handleEditConfirm,
            handleEditDialogClose,
            systemAPIConfirm,
            systemAPIDialogClose,

            handleAPISelectChange,

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
