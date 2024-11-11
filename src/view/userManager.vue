<template>
    <div>
        <p>userManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleUserAdd">新增用户</el-button>
        </div>

        <!-- 表格 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime" width="180"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime" width="180"></el-table-column>
            <el-table-column prop="lastLoginTime" label="lastLogin" :formatter="formatDateTime"
                width="180"></el-table-column>
            <el-table-column prop="account" label="account"></el-table-column>
            <el-table-column label="Operate" width="250" fixed="right">
                <template #default="scope">
                    <div>
                        <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </div>
                    <div>
                        <el-button link type="primary" @click="handleSubjectWeightSet(scope.row)">主体权重设置</el-button>
                        <el-button link type="primary" @click="handleUserTacticsEdit(scope.row)">用户策略管理</el-button>
                    </div>
                    <!-- <el-button type="primary" @click="handleChangePassword(scope.row)">改密码</el-button> -->
                    <div>
                        <el-button link type="primary" @click="handleApportionRole(scope.row)">分配角色</el-button>
                        <el-button link type="primary" @click="">分配组织(开发中)</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑页面弹窗 -->
        <el-dialog v-model="editDialogVisible" :title="editForm.title" width="60%" :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id" v-show="disabledAccount">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="editForm.account" placeholder="请输入账号" :disabled="disabledAccount" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-show="!disabledAccount">
                    <el-input v-model="editForm.password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="editForm.sex" class="ml-4">
                        <el-radio label="0" size="small">男</el-radio>
                        <el-radio label="1" size="small">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="号码" prop="phone">
                    <el-input v-model="editForm.phone" placeholder="请输入电话号码" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="editForm.address" placeholder="请输入地址" />
                </el-form-item>
                <el-form-item label="简介" prop="introduction">
                    <el-input v-model="editForm.introduction" placeholder="请输入个人简介" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 分配角色页面弹窗 -->
        <el-dialog v-model="ApportionRoleDialogVisible" :title="ApportionRoleForm.title" width="50%"
            :before-close="handleApportionRoleDialogClose">
            <div style="text-align: center">
                <el-transfer v-model="ApportionRoleForm.bindRoleList" filterable :filter-method="handleApportionRoleFilter"
                    filter-placeholder="搜索需要的角色" :data="ApportionRoleForm.data" :titles="['未绑角色', '已绑角色']" />
            </div>
            <el-form-item style="margin-top: 8px;">
                <el-button type="primary" @click="handleApportionRoleDialogConfirm">确定</el-button>
                <el-button @click="handleApportionRoleDialogClose">取消</el-button>
            </el-form-item>
        </el-dialog>

        <!-- 主体策略权重设置页面弹窗 -->
        <el-dialog v-model="subjectWeightSetDialogVisible" :title="subjectWeightSetForm.title" width="30%"
            :before-close="handleSubjectWeightSetDialogClose">
            <div style="box-shadow:rgb(231, 231, 231) 0px 0px 3px 1px;border-radius: 2px;padding: 6px;user-select: none;">
                <el-alert title="拖拽列表来设置策略生效的权重(目前只有用户绑定)" type="info" />
                <ul id="SubjectWeightSetList">
                    <li v-for="i in subjectWeightSetForm.subjectList" :data-enum="i.value">{{ i.label }}</li>
                </ul>
            </div>
            <el-form-item style="margin-top: 16px;">
                <el-button type="primary" @click="handleSubjectWeightSetDialogConfirm">确定</el-button>
                <el-button @click="handleSubjectWeightSetDialogClose">取消</el-button>
            </el-form-item>
        </el-dialog>

        <!-- 用户策略管理-页面弹窗 -->
        <el-dialog v-model="userTacticsDialogVisible" :title="userTacticsForm.title" width="80%"
            :before-close="handleUserTacticsDialogClose">
            <el-alert title="排序越靠前权重越高" type="info" />
            <el-table v-loading="showLoading" :data="userTacticsTableData" style="width: 100%" stripe
                class="UserTacticsWeight">
                <el-table-column type="index" />
                <el-table-column prop="order" label="sortOrder" width="100" align="center"></el-table-column>
                <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                    width="180"></el-table-column>
                <el-table-column prop="name" label="name"></el-table-column>
                <el-table-column prop="effect" label="effect" :formatter="formatEffect"></el-table-column>
                <el-table-column prop="condition" label="condition"></el-table-column>
                <el-table-column label="Operate" width="90" fixed="right">
                    <template #default="scope">
                        <div style="display: flex;justify-content: center;align-items: center;">
                            <el-button link type="primary" @click="handleUserTacticsDetail(scope.row)">查看</el-button>
                            <el-button link type="danger" @click="handleUserTacticsDelete(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item style="margin-top: 16px;">
                <el-button @click="DragUserTactics">{{ userTacticsForm.dragButtonTxt }}</el-button>
                <el-button type="primary" @click="handleUserTacticsDialogConfirm">确定</el-button>
                <el-button @click="handleUserTacticsDialogClose">取消</el-button>
            </el-form-item>
        </el-dialog>


        <!-- 策略详细信息弹窗 -->
        <el-dialog v-model="tacticsDetailDialogVisible" title="策略详细信息" width="60%"
            :before-close="handleTacticsDetailDialogClose">
            <el-form :model="tacticsDetailForm" ref="editFormRef" disabled="true">
                <el-form-item label="id" prop="id" v-show="disabledAccount">
                    <el-input v-model="tacticsDetailForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="策略名称" prop="name">
                    <el-input v-model="tacticsDetailForm.name" placeholder="请输入策略名称" />
                </el-form-item>
                <el-form-item label="效果(Effect)" prop="effect">
                    <el-radio-group v-model="tacticsDetailForm.effect" class="ml-4">
                        <el-radio label="1" size="small">允许</el-radio>
                        <el-radio label="0" size="small">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择服务(项目)" prop="services">
                    <el-radio-group v-model="tacticsDetailForm.services" @change="handleServiceSelectChange">
                        <el-radio size="small" v-for="item in projectData" :key="item.id" :label="item.id">{{
                            `${item.cName}(${item.eName})` }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择操作(模块---后续补上)" prop="modules">
                    <el-radio-group v-model="tacticsDetailForm.modules">
                        <el-radio size="small" v-for="item in moduleData" :key="item.id" :label="item.id">{{
                            `${item.cName}(${item.eName})` }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择资源(API接口)" prop="apis">
                    <el-checkbox-group v-model="tacticsDetailForm.apis">
                        <el-checkbox size="small" v-for="item in apiData" :key="item.id" :label="item.id"
                            @change="handleAPISelectChange">{{
                                `${item.name}(${item.path})` }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="简介" prop="introduction">
                    <el-input v-model="tacticsDetailForm.introduction" placeholder="请输入策略简介" />
                </el-form-item>
                <el-form-item label="条件(暂时不做后续补上)" prop="introduction">
                    <el-input v-model="tacticsDetailForm.introduction" placeholder="请添加策略条件" disabled />
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
import { onMounted, ref, reactive, defineAsyncComponent, nextTick } from "vue";
import {
    UserList,
    Register,
    DeleteUser,
    UpdateUser,
    UserInfo,
    RoleList,
    UserRoleList,
    SetUserRole,
    UserTacticsList,
    DeleteTacticsSubject,
    SortTacticsSubject,
    ProjectList,
    APIModuleList,
    TacticsDetail
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone, fuzzyQuery, formatDateTime } from "../utils";
import Sortable from 'sortablejs';

export default {
    setup() {
        let sortable_subjectTacticsWeight = null; // 
        let sortable_userTacticsWeight = null;


        const projectData = ref([]);
        const moduleData = ref([]);
        const apiData = ref([]);


        /**
         * 变量数据
         */
        const tableData = ref([]);
        const userTacticsTableData = ref([]); // 用户策略列表-表格数据

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const editDialogVisible = ref(false); // 编辑对话框可见性
        const ApportionRoleDialogVisible = ref(false); // 分配角色对话框可见性
        const subjectWeightSetDialogVisible = ref(false); // 主体策略权重设置对话框可见性
        const userTacticsDialogVisible = ref(false); // 用户策略管理对话框可见性
        const tacticsDetailDialogVisible = ref(false); // 策略详细对话框可见性


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
            account: "",
            password: "",
            name: "",
            sex: "",
            phone: "",
            address: "",
            introduction: "",
        });
        // 编辑表单验证规则
        const editFormRules = ref({});

        //
        const subjectWeightSetForm = reactive({
            title: "主体策略权重设置",
            subjectList: [
                { label: '用户策略', value: 1 },
                { label: '角色策略', value: 2 },
                { label: '组织策略', value: 3 }
            ]
        })

        const userTacticsForm = reactive({
            title: "用户策略管理",
            id: "",
            dragButtonTxt: "开启拖拽"
        })

        // 分配角色弹窗数据
        const ApportionRoleForm = reactive({
            title: "角色分配界面",
            data: [], // 穿梭框可选择列表
            bindRoleList: [] // 穿梭框选中值
        })

        const tacticsDetailForm = reactive({
            id: "",
            modules: "",
            apis: [],
            introduction: "",
            name: "",
            services: "",
            effect: "",
        })


        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);
        const ApportionRoleFormRef = ref(null);

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
        const userList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            UserList(params)
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

        const deleteUser = (params) => {
            showLoading.value = true;
            DeleteUser(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        userList();
                    }
                })
                .finally(() => {
                    showLoading.value = false;
                });
        };

        const addUser = (params) => {
            showLoading.value = true;
            Register(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(typeof res.data == "string" ? res.data : "新增用户成功！");
                        userList();
                    }
                })
                .finally(() => {
                    showLoading.value = false;
                    editDialogVisible.value = false;
                });
        };

        const updateUser = (params) => {
            showLoading.value = true;
            UpdateUser(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data);
                        userList();
                    }
                })
                .finally(() => {
                    showLoading.value = false;
                    editDialogVisible.value = false;
                });
        };

        const userInfo = (id) => UserInfo(id);

        const roleList = (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 99999999
                };
            }
            RoleList(params)
                .then((res) => {
                    if (res.code === 200) {
                        ApportionRoleForm.data = res.data.data.map(i => {
                            return {
                                key: i.id,
                                label: i.name,
                            }
                        });
                        ElMessage.success("角色信息列表查询成功！");
                    }
                })
        };

        const userRoleList = (id) => UserRoleList(id);
        const userTacticsList = (id) => UserTacticsList(id);

        const setUserRole = (params) => {
            SetUserRole(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("改变用户绑定角色列表成功！");
                    }
                })
        };


        const deleteTacticsSubject = (id) => {
            DeleteTacticsSubject(id)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        handleUserTacticsEdit({ id: userTacticsForm.id })
                    }
                })
        };

        const sortTacticsSubject = (params) => {
            SortTacticsSubject(params)
                .then(async (res) => {
                    if (res.code === 200) {
                        ElMessage.success("重新排序成功！");
                    }
                })
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

        const tacticsDetail = (id) => {
            TacticsDetail(id)
                .then((res) => {
                    if (res.code === 200) {
                        tacticsDetailForm.modules = res.data.modules;
                        tacticsDetailForm.apis = res.data.apis.split(",");
                        tacticsDetailForm.introduction = res.data.introduction;
                        tacticsDetailForm.name = res.data.name;
                        tacticsDetailForm.services = res.data.services;
                        tacticsDetailForm.effect = res.data.effect + "";
                        apiModuleList({
                            page: 1,
                            take: 999999,
                            exact: JSON.stringify({ projectId: res.data.services })
                        })
                        ElMessage.success("策略详细信息查询成功！");
                    }
                })
        };



        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            userList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            userList(); // 发起新的请求
        };


        /**
         * 查看单条详细信息
         * @param {*} rowData 
         */
        const handleEdit = async (rowData) => {
            editForm.title = "查看/修改 用户信息";
            editForm.type = "update";
            editForm.id = rowData.id;
            editForm.account = rowData.account;

            const res = await userInfo(editForm.id);
            if (res.code == 200) {
                ElMessage.success(typeof res.data == "string" ? res.data : "查询用户详细信息成功！");
                editForm.address = res.data.address;
                editForm.introduction = res.data.introduction;
                editForm.name = res.data.name;
                editForm.phone = res.data.phone;
                editForm.sex = res.data.sex + "";
            }

            // 设置其他字段的初始值
            disabledAccount.value = true;
            editDialogVisible.value = true;
        };


        /**
          * 分配角色信息
          * @param {*} rowData 
          */
        const handleApportionRole = async (rowData) => {
            ApportionRoleDialogVisible.value = true;
            editForm.id = rowData.id;
            const { code, data } = await userRoleList(rowData.id);
            if (code == 200) {
                ApportionRoleForm.bindRoleList = data.map(i => i.id)
            }
        }


        /**
         * 主体策略权重设置
         * @param {*} rowData 
         */
        const handleSubjectWeightSet = async (rowData) => {
            subjectWeightSetDialogVisible.value = true;
            nextTick(() => {
                sortable_subjectTacticsWeight = Sortable.create(document.getElementById('SubjectWeightSetList'));
            })
        }

        /**
         * 用户策略权重排序管理
         * @param {*} rowData 
         */
        const handleUserTacticsEdit = async (rowData) => {
            userTacticsTableData.value = [];
            showLoading.value = true;
            userTacticsDialogVisible.value = true;
            userTacticsForm.id = rowData.id;
            try {
                const { code, data } = await userTacticsList(rowData.id);
                showLoading.value = false;
                if (code == 200) {
                    userTacticsTableData.value = data;
                }
            } catch (e) {
                showLoading.value = false;
                userTacticsForm.id = "";
            }
            // 减少查看接口的调用
            projectList();
        }


        /**
         * 分配角色信息-确认事件
         */
        const handleApportionRoleDialogConfirm = () => {
            ApportionRoleDialogVisible.value = false;
            setUserRole({
                userId: editForm.id,
                roleIds: ApportionRoleForm.bindRoleList
            })
        }

        /**
         * 分配角色信息-关闭事件
         */
        const handleApportionRoleDialogClose = () => {
            ApportionRoleDialogVisible.value = false;
        }

        const handleSubjectWeightSetDialogConfirm = () => {
            subjectWeightSetDialogVisible.value = false;
            nextTick(() => {
                let arr = Array.from(document.querySelectorAll('#SubjectWeightSetList > li')).reduce((t, c) => t.push(Number(c.dataset.enum)) && t, [])
                ElMessage.success(`排序名单 :${JSON.stringify(arr)} -- 接口开发中`);
            })
        }

        const handleSubjectWeightSetDialogClose = () => {
            subjectWeightSetDialogVisible.value = false;
        }

        /**
         * 关闭用户策略排序管理拖拽行为
         */
        const closeDragUserTactics = async () => {
            if (sortable_userTacticsWeight) {
                sortable_userTacticsWeight.destroy();
            }
            sortable_userTacticsWeight = null;
            userTacticsForm.dragButtonTxt = "开启拖拽";
        }

        const DragUserTactics = () => {
            if (userTacticsForm.dragButtonTxt == "开启拖拽") {
                if (sortable_userTacticsWeight) {
                    sortable_userTacticsWeight.destroy();
                }
                nextTick(() => {
                    let str = '.UserTacticsWeight > .el-table__inner-wrapper > .el-table__body-wrapper > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view > table > tbody';
                    const dom = document.querySelector(str);
                    dom.setAttribute("id", 'UserTacticsWeight')
                    sortable_userTacticsWeight = Sortable.create(document.getElementById('UserTacticsWeight'));
                });
                userTacticsForm.dragButtonTxt = "关闭拖拽";
            } else {
                closeDragUserTactics();
            }
        }

        const handleUserTacticsDialogConfirm = () => {
            let str = '.UserTacticsWeight > .el-table__inner-wrapper > .el-table__body-wrapper > .el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view > table > tbody > tr';
            const doms = Array.from(document.querySelectorAll(str));
            const needUpdateTacticsSubjectIds = []
            doms.forEach(i => {
                const order = Number(i.childNodes[1].childNodes[0].innerText)
                userTacticsTableData.value.filter(i => i.order == order).forEach(i => needUpdateTacticsSubjectIds.push(i.id_m))
            })
            // 发起请求
            sortTacticsSubject({
                subjectId: userTacticsForm.id,
                subjectType: 1,
                ids: needUpdateTacticsSubjectIds
            })
            closeDragUserTactics();
            userTacticsDialogVisible.value = false;
        }
        const handleUserTacticsDialogClose = () => {
            closeDragUserTactics();
            userTacticsDialogVisible.value = false;
            userTacticsForm.id = "";
        }

        const handleTacticsDetailDialogClose = () => {
            tacticsDetailDialogVisible.value = false;
            tacticsDetailForm.id = "";
        }


        /**
         * 穿梭框分配角色远程搜索事件
         */
        const handleApportionRoleFilter = (query, item) => {
            if (!query) return item
            return fuzzyQuery(query, [item.label]).length > 0 ? item : ""
        }


        /**
         * 新增用户
         */
        const handleUserAdd = () => {
            editForm.title = "新增用户信息";
            editForm.type = "add";
            editDialogVisible.value = true;
        }

        /**
         * 删除用户
         * @param {*} rowData 
         */
        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteUser(rowData.id);
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


        /**
         * 查看/编辑弹窗 确定按钮
         */
        const handleEditConfirm = () => {
            editForm.sex = Number(editForm.sex);
            if (editForm.type == "add") {
                addUser(editForm);
            } else if (editForm.type == "update") {
                updateUser(editForm)
            }
        }


        /**
         * 查看/编辑弹窗 关闭按钮
         */
        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            disabledAccount.value = false;
            editDialogVisible.value = false;
        };

        const handleUserTacticsDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteTacticsSubject(rowData.id_m)
            }).catch(() => {

            });
        }

        const handleUserTacticsDetail = (rowData) => {
            tacticsDetailDialogVisible.value = true;
            tacticsDetailForm.id = rowData.id;
            tacticsDetail(rowData.id)
        }




        /**
         * 生命周期
         */
        onMounted(async () => {
            userList();
            roleList();
        });

        return {
            formatDateTime,

            projectData,
            moduleData,
            apiData,

            tableData,
            userTacticsTableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            editDialogVisible,
            ApportionRoleDialogVisible,
            subjectWeightSetDialogVisible,
            userTacticsDialogVisible,
            tacticsDetailDialogVisible,
            disabledAccount,
            filterForm,
            editForm,
            ApportionRoleForm,
            subjectWeightSetForm,
            userTacticsForm,
            tacticsDetailForm,

            editFormRef,
            ApportionRoleFormRef,

            handleCurrentChange,
            handleSizeChange,
            formatStatus,
            formatEffect,
            handleEdit,

            handleApportionRole,
            handleApportionRoleDialogConfirm,
            handleApportionRoleDialogClose,
            handleApportionRoleFilter,

            handleSubjectWeightSet,
            handleSubjectWeightSetDialogConfirm,
            handleSubjectWeightSetDialogClose,

            handleUserTacticsEdit,
            DragUserTactics,
            handleUserTacticsDialogConfirm,
            handleUserTacticsDialogClose,
            handleTacticsDetailDialogClose,

            handleUserAdd,
            handleDelete,
            handleEditConfirm,
            handleEditDialogClose,

            handleUserTacticsDelete,
            handleUserTacticsDetail,
        };
    },
};
</script>

<style scoped lang="scss">
:deep(.el-input__inner) {
    border: none !important;
}

#SubjectWeightSetList {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
        padding: 4px 8px;
        cursor: grab;
        text-align: center;
    }
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
