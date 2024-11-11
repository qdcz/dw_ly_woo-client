<template>
    <div>
        <p>APIAccessControlManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleUserAdd">新增策略</el-button>
        </div>

        <!-- 表格 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime" width="180"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime" width="180"></el-table-column>
            <!-- <el-table-column prop="status" label="Status" :formatter="formatStatus" width="70"></el-table-column> -->
            <el-table-column prop="effect" label="Effect" :formatter="formatEffect" width="70"></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <!-- <el-table-column prop="services" label="services"></el-table-column> -->
            <!-- <el-table-column prop="modules" label="modules"></el-table-column> -->
            <!-- <el-table-column prop="apis" label="apis"></el-table-column> -->
            <el-table-column prop="condition" label="Condition"></el-table-column>

            <el-table-column label="Operate" width="200" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="primary" @click="handleAccreditUser(scope.row)">授权用户</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑页面弹窗 -->
        <el-dialog v-model="editDialogVisible" :title="editForm.title" width="60%" :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id" v-show="disabledAccount">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="策略名称" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入策略名称" />
                </el-form-item>
                <el-form-item label="效果(Effect)" prop="effect">
                    <el-radio-group v-model="editForm.effect" class="ml-4">
                        <el-radio label="1" size="small">允许</el-radio>
                        <el-radio label="0" size="small">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择服务(项目)" prop="services">
                    <el-radio-group v-model="editForm.services" @change="handleServiceSelectChange">
                        <el-radio size="small" v-for="item in projectData" :key="item.id" :label="item.id">{{
                            `${item.cName}(${item.eName})` }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择操作(模块---后续补上)" prop="modules">
                    <el-radio-group v-model="editForm.modules">
                        <el-radio size="small" v-for="item in moduleData" :key="item.id" :label="item.id">{{
                            `${item.cName}(${item.eName})` }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择资源(API接口)" prop="apis">
                    <el-checkbox-group v-model="editForm.apis">
                        <el-checkbox size="small" v-for="item in apiData" :key="item.id" :label="item.id"
                            @change="handleAPISelectChange">{{
                                `${item.name}(${item.path})` }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="简介" prop="introduction">
                    <el-input v-model="editForm.introduction" placeholder="请输入策略简介" />
                </el-form-item>
                <el-form-item label="条件(暂时不做后续补上)" prop="introduction">
                    <el-input v-model="editForm.introduction" placeholder="请添加策略条件" disabled />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm(editFormRef)">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 绑定用户页面弹窗 -->
        <el-dialog v-model="bindingUserDialogVisible" :title="editForm.title" width="50%"
            :before-close="bindingUserDialogClose">
            <div style="text-align: center">
                <el-transfer v-model="AccreditUserForm.bindUserList" filterable :filter-method="bindingUserFilter"
                    filter-placeholder="搜索需要的用户" :data="AccreditUserForm.data" :titles="['未授用户', '已授用户']" />
            </div>
            <el-form-item style="margin-top: 8px;">
                <el-button type="primary" @click="bindingUserDialogConfirm">确定</el-button>
                <el-button @click="bindingUserDialogClose">取消</el-button>
            </el-form-item>
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
    APIAccessControlList,
    ProjectList,
    APIModuleList,
    AddAPIAccessControl,
    DeleteAPIAccessControl,
    GetAssociatedSubject,
    AuthorizedSubject,
    UserList,
    TacticsDetail,
    UpdateTactics,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone, fuzzyQuery, formatDateTime } from "../utils";

export default {
    setup() {
        /**
         * 变量数据
         */
        const tableData = ref([]);
        const projectData = ref([]);
        const moduleData = ref([]);
        const apiData = ref([]);


        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const editDialogVisible = ref(false); // 编辑对话框可见性
        const bindingUserDialogVisible = ref(false); // 分配角色对话框可见性
        const disabledAccount = ref(false); // 是否禁用账号输入框

        // 过滤查询表单数据
        const filterForm = reactive({
            name: "",
            describe: "",
            status: "",
            parentId: "",
        })

        // 编辑表单数据
        const editForm = reactive({
            id: "",
            name: "",
            effect: "",
            services: "",
            modules: "",
            apis: [],
            introduction: "",
        });
        // 编辑表单验证规则
        const editFormRules = ref({
            name: [
                {
                    required: true,
                    message: "请输入策略名称！",
                    trigger: "change",
                },
            ],
            services: [
                {
                    required: true,
                    message: "请选择对应的服务！",
                    trigger: "change",
                },
            ],
            apis: [
                {
                    required: true,
                    message: "请选择对应的资源！",
                    trigger: "change",
                },
            ],
        });

        // 分配用户弹窗数据
        const AccreditUserForm = reactive({
            data: [], // 穿梭框可选择列表
            bindUserList: [] // 穿梭框选中值
        })


        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);

        // 工具函数
        const formatStatus = function (row, column) {
            return row[column.property] === 0 ? "启用" : "禁用";
        };
        const formatEffect = function (row, column) {
            return row[column.property] === 0 ? "拒绝" : "允许";
        };

        /**
         * api接口请求
         */
        const apiAccessControlList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            APIAccessControlList(params)
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

        const projectList = (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 999999999,
                };
            }
            ProjectList(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询项目列表成功！");
                        projectData.value = res.data.data
                    }
                })
        };


        const apiModuleList = (params) => {
            APIModuleList(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询接口列表成功！");
                        apiData.value = [{ name: "全选", id: "all", path: "不包含全部" }].concat(res.data.data)
                    }
                })
        };

        const deleteAPIAccessControl = (params) => {
            showLoading.value = true;
            DeleteAPIAccessControl(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        apiAccessControlList();
                    }
                })
                .finally(() => {
                    showLoading.value = false;
                });
        };

        const addAPIAccessControl = (params) => {
            AddAPIAccessControl(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(typeof res.data == "string" ? res.data : "新增策略成功！");
                        apiAccessControlList();
                    }
                })
                .finally(() => {
                    editDialogVisible.value = false;
                    apiData.value = [];
                    resetEditForm();
                });
        };

        const getAssociatedSubject = (params) => {
            GetAssociatedSubject(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(typeof res.data == "string" ? res.data : "查询策略关联用户列表成功！");
                        AccreditUserForm.bindUserList = res.data.map(i => i.id)
                    }
                })
        };

        const authorizedSubject = (params) => {
            AuthorizedSubject(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(typeof res.data == "string" ? res.data : "授权给用户成功！");
                    }
                })
        }

        const userList = (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 99999999
                };
            }
            UserList(params)
                .then((res) => {
                    if (res.code === 200) {
                        AccreditUserForm.data = res.data.data.map(i => {
                            return {
                                key: i.id,
                                label: i.account,
                            }
                        });
                        ElMessage.success("角色信息列表查询成功！");
                    }
                })
        };

        const tacticsDetail = (id) => {
            TacticsDetail(id)
                .then((res) => {
                    if (res.code === 200) {
                        editForm.modules = res.data.modules;
                        editForm.apis = res.data.apis.split(",");
                        editForm.introduction = res.data.introduction;
                        editForm.name = res.data.name;
                        editForm.services = res.data.services;
                        editForm.effect = res.data.effect + "";
                        apiModuleList({
                            page: 1,
                            take: 999999,
                            exact: JSON.stringify({ projectId: res.data.services })
                        })
                        ElMessage.success("策略详细信息查询成功！");
                    }
                })
        };

        const updateTactics = (params) => {
            UpdateTactics(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("更新成功！");
                        apiAccessControlList();
                    }
                }).finally(()=>{
                    editDialogVisible.value = false;
                    apiData.value = [];
                    resetEditForm();
                })
        };
        

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            apiAccessControlList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            apiAccessControlList(); // 发起新的请求
        };


        /**
         * 查看单条详细信息
         * @param {*} rowData 
         */
        const handleEdit = async (rowData) => {
            editForm.title = "查看/修改 策略信息";
            editForm.type = "update";
            editForm.id = rowData.id;
            projectList();
            const res = await tacticsDetail(editForm.id);

            // 设置其他字段的初始值
            disabledAccount.value = true;
            editDialogVisible.value = true;
        };



        /**
         * 给将策略授权给用户
         * @param {*} rowData 
         */
        const handleAccreditUser = async (rowData) => {
            bindingUserDialogVisible.value = true;
            editForm.id = rowData.id;
            getAssociatedSubject({
                id: rowData.id,
                subjectType: 1
            });
        }


        /**
         * 策略授权给用户-关闭事件
         */
        const bindingUserDialogClose = () => {
            bindingUserDialogVisible.value = false;
        }

        /**
         * 策略授权给用户-确认事件
         */
        const bindingUserDialogConfirm = () => {
            bindingUserDialogClose();
            authorizedSubject({
                tacticsId: editForm.id,
                subjectType: 1,
                subjectIds: AccreditUserForm.bindUserList
            })
        }

        /**
         * 穿梭框分配角色远程搜索事件
         */
        const bindingUserFilter = (query, item) => {
            if (!query) return item
            return fuzzyQuery(query, [item.label]).length > 0 ? item : ""
        }


        /**
         * 新增策略
         */
        const handleUserAdd = () => {
            editForm.title = "新增策略信息";
            editForm.type = "add";
            editDialogVisible.value = true;
            projectList();
        }

        /**
         * 删除策略
         * @param {*} rowData 
         */
        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteAPIAccessControl(rowData.id);
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
                (element) => {
                    if (element == 'apis') return editForm[element] = []
                    editForm[element] = "";
                }
            );
            editFormRef.value.clearValidate();
        };




        /**
         * 查看/编辑弹窗 关闭按钮
         */
        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            disabledAccount.value = false;
            editDialogVisible.value = false;
            apiData.value = [];
        };

        /**
         * 查看/编辑弹窗 确定按钮
         */
        const handleEditConfirm = async (formEl) => {
            if (!formEl) return
            await formEl.validate((valid, fields) => {
                if (valid) {
                    editForm.effect = Number(editForm.effect);
                    editForm.apis = editForm.apis.filter(i => i !== "all").join(",");
                    editForm.condition = "暂无";
                    if (editForm.type == "add") {
                        addAPIAccessControl(editForm);
                    } else if (editForm.type == "update") {
                        updateTactics(editForm)
                    }
                } else {
                    console.log('error submit!', fields)
                }
            })

        }

        /**
         * 服务(项目选中值改变事件)
         */
        const handleServiceSelectChange = (e) => {
            apiData.value = [];
            editForm.apis = [];
            apiModuleList({
                page: 1,
                take: 999999,
                exact: JSON.stringify({ projectId: e })
            })
        }

        /**
         * API选项选中值变化
         * @param {*} e 
         */
        const handleAPISelectChange = (bool, e) => {
            if (bool && e.target._value == "all") {
                editForm.apis = apiData.value.map(i => i.id)
            } else if (!bool && e.target._value == "all") {
                editForm.apis = []
            }
        }

        /**
         * 生命周期
         */
        onMounted(async () => {
            apiAccessControlList();
            userList();
        });

        return {

            tableData,
            projectData,
            moduleData,
            apiData,
            currentPage,
            pageSize,
            total,
            showLoading,
            editDialogVisible,
            bindingUserDialogVisible,
            disabledAccount,
            filterForm,
            editForm,
            editFormRules,
            AccreditUserForm,

            editFormRef,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatStatus,
            formatEffect,
            handleEdit,
            handleAccreditUser,
            bindingUserDialogConfirm,
            bindingUserDialogClose,
            bindingUserFilter,
            handleUserAdd,
            handleDelete,
            handleEditConfirm,
            handleEditDialogClose,
            handleServiceSelectChange,
            handleAPISelectChange
        };
    },
};
</script>

<style scoped lang="scss">
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
