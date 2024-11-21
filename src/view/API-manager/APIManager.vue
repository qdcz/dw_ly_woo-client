<template>
    <div>
        <p>APIManager</p>

        <!-- 表单查询条件 -->
        <div class="operate" style="margin-bottom: 10px;">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="归属项目">
                        <el-select v-model="filterForm.projectId" class="m-2" placeholder="请选择归属项目">
                            <el-option v-for="item in projects" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="接口名称">
                        <el-input v-model="filterForm.name" placeholder="请输入接口名称-支持模糊查询" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="接口路径">
                        <el-input v-model="filterForm.path" placeholder="请输入接口路径-支持模糊查询" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="handleClear">清空查询条件</el-button>
                </el-col>
            </el-row>
            <el-button type="primary" @click="handleAdd">新增api接口</el-button>
            <el-button type="primary" @click="handleSelect">查询</el-button>

        </div>

        <!-- 表格内容 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%;" stripe>
            <el-table-column prop="name" label="Name" width="150"></el-table-column>
            <el-table-column prop="path" label="Path" width="150"></el-table-column>
            <el-table-column prop="description" label="Description" width="150">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.description">
                        <span class="text-cell">{{ scope.row.description }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="thumbnail" label="Thumbnail"></el-table-column>
            <el-table-column prop="status" label="Status" :formatter="formatStatus" width="70"></el-table-column>
            <el-table-column prop="step" label="Step" :formatter="formatStep" width="70"></el-table-column>
            <el-table-column prop="type" label="Type" :formatter="formatType" width="60"></el-table-column>
            <el-table-column prop="method" label="Method" :formatter="formatMethod" width="85"></el-table-column>
            <el-table-column prop="projectId" label="ProjectId" width="170"></el-table-column>
            <el-table-column prop="parentId" label="ParentId" width="170"></el-table-column>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column label="Operate" width="200" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="executionCall(scope.row)"
                        v-show="scope.row.type == 1">调用</el-button>
                    <el-button link type="primary" @click="bindingDataSource(scope.row)"
                        v-show="scope.row.type == 1">配元</el-button>
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="editDialogVisible" :title="editForm._title" width="60%"
            :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="归属项目" prop="projectId">
                    <el-select v-model="editForm.projectId" class="m-2" placeholder="请选择归属项目"
                        @focus="focus_selectProjects">
                        <el-option v-for="item in projects" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接口路径" prop="path">
                    <el-input v-model="editForm.path" placeholder="请输入接口路径" />
                </el-form-item>
                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入接口名称" />
                </el-form-item>
                <el-form-item label="接口描述" prop="description">
                    <el-input v-model="editForm.description" placeholder="请输入接口描述" />
                </el-form-item>
                <el-form-item label="接口封面" prop="thumbnail">
                    <el-input v-model="editForm.thumbnail" placeholder="请输入接口封面" />
                </el-form-item>
                <el-form-item label="接口状态" prop="status">
                    <el-radio-group v-model="editForm.status" class="ml-4">
                        <el-radio label="0" size="small">启用</el-radio>
                        <el-radio label="1" size="small">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="接口状态" prop="step">
                    <el-select v-model="editForm.step" class="m-2" placeholder="请选择接口状态">
                        <el-option key="1" label="开发中" value="1" />
                        <el-option key="2" label="已完成" value="2" />
                        <el-option key="3" label="需修改" value="3" />
                        <el-option key="4" label="已使用" value="4" />
                        <el-option key="5" label="已废弃" value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接口/模块" prop="type">
                    <el-radio-group v-model="editForm.type" class="ml-4">
                        <el-radio label="1" size="small">接口</el-radio>
                        <el-radio label="2" size="small">模块</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="接口方法" prop="method">
                    <el-select v-model="editForm.method" class="m-2" placeholder="请选择接口方法">
                        <el-option key="1" label="GET" value="1" />
                        <el-option key="2" label="POST" value="2" />
                        <!-- <el-option key="3" label="PUT" value="3" />
                        <el-option key="4" label="DELETE" value="4" /> -->
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 接口预览调用 -->
        <el-dialog v-model="executionCallDialogVisible" :title="executionCallDialogForm._title" width="60%"
            :before-close="executionCallDialogClose">
            <el-form-item label="接口地址（本服务）">
                <div style="display: flex;width:100%">
                    <div class="tag">GET</div>
                    <div class="tag" style="background-color: #13ce66;">POST</div>
                    <el-input v-model="executionCallDialogForm.APIUrl" placeholder="" disabled="true" />
                </div>
            </el-form-item>
            <el-form-item label="接口地址（离线部署服务）">
                <div style="display: flex;width:100%">
                    <div class="tag" v-if="executionCallDialogForm.method == 'GET'">GET</div>
                    <div class="tag" v-if="executionCallDialogForm.method == 'POST'" style="background-color: #13ce66;">
                        POST
                    </div>
                    <div class="tag" v-if="executionCallDialogForm.method == 'DELETE'"
                        style="background-color: #ee5050;">
                        DELETE</div>
                    <div class="tag" v-if="executionCallDialogForm.method == 'PUT'" style="background-color: #06ff12;">
                        PUT
                    </div>
                    <el-input v-model="executionCallDialogForm.APIUrl1" placeholder="" disabled="true" />
                </div>
            </el-form-item>
            <el-form-item label="请求体配置">
                <el-switch v-model="executionCallDialogForm.editMode" active-text="保存模式（修改会实时保存）"
                    inactive-text="调试模式" />
                <RequestParams title="请求头" :bodyData="executionCallDialogForm.bodyData_header"
                    :headerConfig="request_headerForm_headerConfig" @formDataChange="request_headerFormDataChange"
                    @headerItemAdd="request_headerFormDataHeaderItemAdd" @itemAdd='request_headerFormDataItemAdd'
                    @itemDelete='request_headerFormDataItemDelete'></RequestParams>
                <RequestParams title="请求参数" :bodyData="executionCallDialogForm.bodyData_body"
                    @formDataChange="request_bodyFormDataChange" @headerItemAdd="request_bodyFormDataHeaderItemAdd"
                    @itemAdd='request_bodyFormDataItemAdd' @itemDelete='request_bodyFormDataItemDelete'></RequestParams>
            </el-form-item>
            <el-form-item label="预处理">
                <div style="overflow: hidden; transition: .3s;width:100%;"
                    :class="executionCallDialogForm.beforeFnFold ? 'beforeFnUnFold' : 'beforeFnFold'">
                    <div style="display: flex;
                            flex-direction: row; 
                            align-items: center;
                            justify-content: space-between;
                            user-select: none;
                            cursor: pointer;" @click="handleBeforeFnFold">支持对请求前的入参做处理
                        <el-icon>
                            <ArrowDownBold style="transition: .3s;"
                                :class="{ foldIconRotate: executionCallDialogForm.beforeFnFold }" />
                        </el-icon>
                    </div>
                    <div>
                        <span style="margin-right: 40px;">params: 入参</span>
                        <span style="margin-right: 40px;">utils: 工具函数</span>
                        <span>plugin: 插件【开发中】</span>
                    </div>

                    <editorFuncBox :name="editForm.name" paramString="params, utils, plugin">
                        <MonacoEditor :initialValue="executionCallDialogForm.beforeFnContent"
                            initialLanguage="javascript" ref="beforeFnEditor" class="beforeFnEditor"></MonacoEditor>
                    </editorFuncBox>

                    <div style="position: relative;width: 100%;margin-top: 10px;">
                        <!-- <el-button style="position: absolute;right: 80px;" plain @click="">取消</el-button> -->
                        <el-button style="position: absolute;right: 0px;" type="primary"
                            :loading="executionCallDialogForm.beforeFnSaveBtnLoading"
                            @click="beforeFnClick">保存</el-button>
                    </div>


                </div>
            </el-form-item>
            <el-form-item label="后处理">
                <div style="overflow: hidden; transition: .3s; width:100%;"
                    :class="executionCallDialogForm.afterFnFold ? 'beforeFnUnFold' : 'beforeFnFold'">
                    <div style="display: flex;
                            flex-direction: row; 
                            align-items: center;
                            justify-content: space-between;
                            user-select: none;
                            cursor: pointer;" @click="handleAfterFnFold">支持对取到的结果数据做后处理操作
                        <el-icon>
                            <ArrowDownBold style="transition: .3s;"
                                :class="{ foldIconRotate: executionCallDialogForm.afterFnFold }" />
                        </el-icon>
                    </div>
                    <div>
                        <span style="margin-right: 40px;">data: 返回的数据</span>
                        <span style="margin-right: 40px;">utils: 工具函数</span>
                        <span>plugin: 插件【开发中】</span>
                    </div>

                    <editorFuncBox :name="executionCallDialogForm.name" paramString="params, utils, plugin">
                        <MonacoEditor :initialValue="executionCallDialogForm.afterFnContent"
                            initialLanguage="javascript" ref="afterFnEditor" class="afterFnEditor"></MonacoEditor>
                    </editorFuncBox>

                    <div style="position: relative;width: 100%;margin-top: 10px;">
                        <el-button style="position: absolute;right: 0px;" type="primary"
                            :loading="executionCallDialogForm.afterFnSaveBtnLoading"
                            @click="afterFnClick">保存</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="响应结果">
                <div style="overflow: hidden; transition: .3s;width:100%;"
                    :class="executionCallDialogForm.previewResFold ? 'previewResUnFold' : 'beforeFnFold'">
                    <div style="display: flex;
                            flex-direction: row; 
                            align-items: center;
                            justify-content: space-between;
                            user-select: none;
                            cursor: pointer;" @click="handlePreviewResultFold">展示接口响应结果
                        <el-icon>
                            <ArrowDownBold style="transition: .3s;"
                                :class="{ foldIconRotate: executionCallDialogForm.previewResFold }" />
                        </el-icon>
                    </div>
                    <editorFuncBox :name="executionCallDialogForm.name" :header="false">
                        <MonacoEditor :initialValue="executionCallDialogForm.previewContent" initialLanguage="json"
                            readOnly="true" ref="previewEditor" class="previewEditor"></MonacoEditor>
                    </editorFuncBox>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="executionCallDialogConfirm">execute</el-button>
                <el-button @click="executionCallDialogClose">关闭</el-button>
            </el-form-item>
        </el-dialog>

        <!-- 接口配源 -->
        <el-drawer v-model="configureSource" direction="ltr">
            <template #header>
                <div style="font-weight: 600;color: black;">《配置数据单元》</div>
            </template>
            <template #default>
                <p>已绑定的数据单元：</p>
                <div
                    style="display: flex;flex-direction: column; box-shadow: 0px 0px 4px 2px #eeeeee; padding: 6px 10px; border-radius: 4px;">
                    <div style="display: flex;flex-direction: row; align-items: center;justify-content: space-between;"
                        v-for="item in configureSourceData.currentBindingSource" :key="item.id">
                        <div style="color: #14b6dc;font-size: 14px;font-weight: 700;">{{ item.name }}</div>
                        <div>
                            <el-switch v-model="item.m_status__boolean" class="ml-2"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;margin-right: 10px;"
                                @change="configureSourceData_switchChange(item)" />
                            <el-button type="danger" circle @click="configureSourceData_delete(item)">
                                <Delete style="width: 1em; height: 1em;" />
                            </el-button>
                        </div>
                    </div>
                    <div v-if="configureSourceData.currentBindingSource.length == 0">
                        <div style="color: #6ebbcd;font-size: 10px;">暂无绑定数据单元 !</div>
                    </div>
                </div>
                <el-form-item label="数据单元列表：" prop="" style="margin-top: 10px;">
                    <el-select v-model="selectDataUnitType" class="m-2" placeholder="选择数据单元类型"
                        @change="configureSourceData_DataUnitTypeChange">
                        <el-option v-for="item in dataUnits" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-table v-loading="configureSourceData.showLoading" :data="configureSourceData.tableData"
                    style="width: 100%" border>
                    <el-table-column prop="name" label="Name"></el-table-column>
                    <el-table-column prop="sql" label="Sql"></el-table-column>
                    <el-table-column label="Operate" width="100">
                        <template #default="scope">
                            <el-button type="primary" @click="configureSourceData_handleAdd(scope.row)">添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>


                <el-drawer v-model="fullEditorDialogVisible" width="100%" direction="ttb" title="全屏编辑器"
                    :before-close="handleFullEditorDialogClose">
                    <fullEditor :logic="fullEditorLogic" @handleSaveCode="handleFullEditorSaveCode"
                        @codeChange="handleCodeChange">
                    </fullEditor>
                </el-drawer>

                <el-pagination @current-change="configureSourceData_CurrentChange"
                    @size-change="configureSourceData_SizeChange" :current-page="configureSourceData.currentPage"
                    :page-size="configureSourceData.pageSize" :total="configureSourceData.total"
                    :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"
                    style="margin-top: 10px;">
                </el-pagination>
            </template>
        </el-drawer>

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
    APIModuleList,
    AddAPIModule,
    DeleteAPIModule,
    UpdateAPIModule,
    ProjectList,
    SqlDataUnitList,
    BoundDataUnit,
    APIModuleBindindUnits,
    APIModuleDataUnitEnabled,
    DeleteAPIModuleDataUnits,
    APIExecutePreview,
    APIModuleBindRequest,
    UpdateAPIModuleRequest,
    AddAPIModuleRequest,
    APIModuleAddHook,
    GetAPIModuleHook,
    UpdateAPIModuleHook,
    MockDataUnitList,
} from "../../api";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";

import { generateString, formatDateTime, decryptAES } from "../../utils/index";

import MonacoEditor from "../../components/monaco.vue";
import editorFuncBox from '../../components/editor-func-box/index.jsx';
import fullEditor from "../../components/full-editor/index.jsx";
import RequestParams from "../../components/request-form/request-form.jsx";
import { isArray } from "element-plus/es/utils/types.mjs";

const METHOD = {
    1: "GET",
    2: "POST",
    3: "PUT",
    4: "DELETE",
};

const STEP = {
    1: "开发中",
    2: "已完成",
    3: "需修改",
    4: "已使用",
    5: "已废弃",
};

export default {
    components: {
        MonacoEditor,
        RequestParams,
        editorFuncBox,
        fullEditor
    },
    setup() {
        const dataUnits = [
            {
                value: 'sqlDataUnit',
                label: 'sql数据单元',
            },
            {
                value: 'mockDataUnit',
                label: 'mock数据单元',
            }
        ]
        /**
         * 变量数据
         */
        const tableData = ref([]);

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const projects = ref([]); // 项目列表

        const showLoading = ref(false); // 控制显示加载中遮罩层

        const editDialogVisible = ref(false); // 编辑对话框可见性
        const executionCallDialogVisible = ref(false); // 预览调用对话框可见性
        const configureSource = ref(false); // 配置数据源 侧边栏
        const selectDataUnitType = ref("sqlDataUnit"); // 配置选择的数据源 
        const fullEditorDialogVisible = ref(false); // 全屏编辑器
        const fullEditorLogic = ref(""); // 全屏编辑器代码逻辑

        const configureSourceData = reactive({
            // 配源数据合集
            currentPage: 1,
            pageSize: 10,
            total: 0,

            showLoading: false,
            tableData: [],

            currentBindingSource: [], // 当前绑定的数据单元
            curAPIId: "", // 当前点击的APIModuleId
        });

        // 过滤查询表单数据
        const filterForm = reactive({
            projectId: "",
            name: "",
            path: ""
        })

        // 编辑表单数据
        const editForm = ref({
            _title: "", // 标题
            _type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            projectId: "",
            parentId: "",
            path: "",
            name: "",
            description: "",
            thumbnail: "",
            status: "",
            step: "",
            type: "",
            method: "",
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
         * 调用窗口字段
         */
        const executionCallDialogForm = reactive({
            _title: "接口调用预览结果",
            APIUrl: "", // 本系统接口地址
            APIUrl1: "", // 离线部署系统接口地址
            method: "", // 请求类型
            editMode: false, // 是否开启编辑模式（请求体）
            beforeFnSaveBtnLoading: false, // 保存按钮loading (预处理函数)
            afterFnSaveBtnLoading: false, // 保存按钮loading  (后处理函数)
            beforeFnFold: "",// 预处理函数编辑器折叠状态
            afterFnFold: "", // 后处理编辑器折叠状态
            previewResFold: "", // 预览结果编辑器折叠状态
            bodyData_body: [], // body 入参
            bodyData_header: [], // header 入参
            apiId: "", // 接口的id
            requestId: "", // 请求体Id
            hookId: {
                // hookId
                before: "", // 前置处理
                after: "", // 后置处理
            },
            projectId: "", // 项目id

            eName: "", // 项目英文名称

            beforeName: "", //  前置函数-名字
            beforeDescription: "", // 前置函数-描述内容
            afterName: "", //  前置函数-名字
            afterDescription: "", // 前置函数-描述内容

            previewContent: "", // 函数调用预览返回结果 编辑器内容
            beforeFnContent: "", // 前置处理函数 编辑器内容
            afterFnContent: "", // 后置处理函数 编辑器内容
        });

        const request_headerForm_headerConfig = [
            { name: "参数名", width: "20" },
            { name: "示例值", width: "20" },
            { name: "字段描述", width: "40" },
        ];

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);
        const previewEditor = ref(null);
        const beforeFnEditor = ref(null);
        const afterFnEditor = ref(null);

        // 工具函数
        const formatStatus = function (row, column) {
            return row[column.property] === 0 ? "启用" : "禁用";
        };

        const formatStep = function (row, column) {
            return STEP[row[column.property]];
        };

        const formatType = function (row, column) {
            const _map = {
                1: "接口",
                2: "模块",
            };
            return _map[row[column.property]];
        };

        const formatMethod = function (row, column) {
            return METHOD[row[column.property]];
        };

        /**
         * api接口请求
         */
        const _APIModuleList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            APIModuleList(params)
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

        const addAPIModule = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddAPIModule(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.msg || res.data);
                        _APIModuleList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const deleteAPIModule = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteAPIModule(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        _APIModuleList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateAPIModule = async (params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateAPIModule(params);
            if (code == 200) {
                ElMessage.success("更新成功！");
                _APIModuleList();
            }
            showLoading.value = false;
        };

        const projectList = async (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 99999,
                };
            }
            const { code, data } = await ProjectList(params);
            if (code == 200) {
                projects.value = data.data.map((i) => {
                    i.label = i.eName;
                    i.value = i.id;
                    return i;
                });
                // projects.value.push({
                //     label:"丢失项目归属接口"
                //     value:"NoFate"
                // })
            }
        };

        const sqlDataUnitList = async (params) => {
            if (!params) {
                params = {
                    page: configureSourceData.currentPage,
                    take: configureSourceData.pageSize,
                };
            }
            const { code, data } = await SqlDataUnitList(params);
            if (code == 200) {
                data.data.forEach(item => item.sql = decryptAES(item.sql))
                configureSourceData.tableData = data.data;
                configureSourceData.total = data.meta.itemCount;
            }
        };

        const mockDataUnitList = async (params) => {
            if (!params) {
                params = {
                    page: configureSourceData.currentPage,
                    take: configureSourceData.pageSize,
                };
            }
            const { code, data } = await MockDataUnitList(params);
            if (code == 200) {
                configureSourceData.tableData = data.data;
                configureSourceData.total = data.meta.itemCount;
            }
        };

        const boundDataUnit = async (params) => {
            const { code, data } = await BoundDataUnit(params);
            if (code == 200) {
                ElMessage.success(data);
                await _APIModuleBindindUnits({
                    apiId: configureSourceData.curAPIId,
                });
            }
        };

        const _APIModuleBindindUnits = async (params) => {
            const { code, data } = await APIModuleBindindUnits(params);
            if (code == 200) {
                ElMessage.success("查询绑定数据单元成功！");
                let deletedItem =
                    configureSourceData.currentBindingSource.pop();
                while (deletedItem) {
                    deletedItem =
                        configureSourceData.currentBindingSource.pop();
                }
                data.dataUnits.forEach((item) => {
                    item.m_status__boolean = item.m_status == "0";
                    configureSourceData.currentBindingSource.push(item);
                });
            }
        };

        const _APIModuleDataUnitEnabled = async (params) => {
            const { code, data } = await APIModuleDataUnitEnabled(params);
            if (code == 200) {
            }
        };

        const deleteAPIModuleDataUnits = async (params) => {
            const { code, data } = await DeleteAPIModuleDataUnits(params);
            if (code == 200) {
            }
        };

        const _APIExecutePreview = async (eName, apiId, params, headers) => {
            const { code, data } = await APIExecutePreview(
                eName,
                apiId,
                params,
                headers
            );
            if (code == 200) {
                ElMessage.success("接口调用成功！");
                let content = null;

                // 匹配分页查询的结果
                if (Array.isArray(data)) {
                    try {
                        content =
                            "[" +
                            data
                                .map((obj) => JSON.stringify(obj, null, 2))
                                .join(",\n") +
                            "]";
                    } catch (e) {
                        console.error(e);
                    }
                    // 其他结果
                } else if (["string", "number", "boolean"].includes(typeof data)) {
                    content = data + " ";
                    // 匹配是对象的情况下
                } else if (typeof data == "object" && data != null) {
                    // 如果入参开启日志输出模式 返回的数据格式会发生变化
                    let __data = null;
                    if (data.logger) { // {logger:{},data:{}}
                        ElMessage.success(
                            "检测出您已开启日志打印，请开启控制台查看！"
                        );
                        console.info(
                            "preprocessingLogger(预处理日志打印),postprocessingLogger(后处理日志打印)",
                            JSON.parse(data.logger)
                        );
                        __data = data.data
                    } else { // 直接是 data:{}
                        __data = data
                    }
                    try {
                        if (isArray(__data)) {
                            content =
                                "[" +
                                __data
                                    .map((obj) => JSON.stringify(obj, null, 2))
                                    .join(",\n") +
                                "]";
                        } else if (typeof __data == "object") {
                            content = JSON.stringify(__data, null, 2);
                        } else {
                            content = __data;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    content = data + " ";
                }
                previewEditor.value.setContentValue(content || "");
            }
        };

        const _APIModuleBindRequest = async (params) => {
            const { code, data } = await APIModuleBindRequest(params);
            if (code == 200) {
                ElMessage.success("请求体查询成功！");
                if (!data) return;
                executionCallDialogForm.requestId = data.id;
                const querySchema = JSON.parse(data.querySchema);
                const bodySchema = JSON.parse(data.bodySchema);
                const headerSchema = JSON.parse(data.headerSchema);
                executionCallDialogForm.bodyData_header = headerSchema.map(
                    (i) => {
                        return [
                            {
                                type: "input",
                                placeholder: "请输入自定义字段-键名",
                                value: i.key,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "请输入自定义字段-键值",
                                value: i.value,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "字段说明",
                                value: i.info,
                                id: i.id,
                            },
                        ];
                    }
                );
                executionCallDialogForm.bodyData_body = bodySchema.map((i) => {
                    return [
                        {
                            type: "input",
                            placeholder: "添加参数",
                            value: i.key,
                            id: i.id,
                        },
                        {
                            type: "select",
                            placeholder: "字段类型",
                            value: i.type,
                            id: i.id,
                        },
                        { type: "checkbox", value: i.required, id: i.id },
                        {
                            type: "input",
                            placeholder: "示例值",
                            value: i.value,
                            id: i.id,
                        },
                        {
                            type: "input",
                            placeholder: "说明",
                            value: i.info,
                            id: i.id,
                        },
                    ];
                });
            }
        };

        const UpdateAPIModuleRequest = async function (id, params) {
            const { code, data } = await UpdateAPIModuleRequest(id, params);
            if (code == 200) {
                ElMessage.success("更新请求体成功！");
            }
        };

        const AddAPIModuleRequest = async function (params) {
            const { code, data } = await AddAPIModuleRequest(params);
            if (code == 200) {
                ElMessage.success("新增请求体成功！");
            }
        };

        const _APIModuleAddHook = async function (params) {
            APIModuleAddHook(params)
                .then(async (res) => {
                    if (res.code == 200) {
                        ElMessage.success("接口新增hook成功！");
                        await getAPIModuleHook({
                            apiId: executionCallDialogForm.apiId,
                            hookType: 1,
                        });
                        await getAPIModuleHook({
                            apiId: executionCallDialogForm.apiId,
                            hookType: 2,
                        });
                    }
                })
                .finally(() => {
                    if (params.hookType == 1) {
                        executionCallDialogForm.beforeFnSaveBtnLoading = false;
                    } else if (params.hookType == 2) {
                        executionCallDialogForm.afterFnSaveBtnLoading = false;
                    }
                });
        };

        const getAPIModuleHook = async function (params) {
            const { code, data } = await GetAPIModuleHook(params);
            const _mapFn = {
                1: function (data) {
                    if (data.length > 0) {
                        executionCallDialogForm.hookId.before = data[0].id;
                        executionCallDialogForm.beforeName = data[0].name;
                        executionCallDialogForm.beforeDescription =
                            data[0].description;
                        if (data[0].logic) {
                            executionCallDialogForm.beforeFnContent =
                                data[0].logic;
                        } else {
                            beforeFnEditor.value.setContentValue("");
                        }
                    } else {
                        executionCallDialogForm.hookId.before = "";
                        beforeFnEditor.value.setContentValue("");
                    }
                },
                2: function (data) {
                    if (data.length > 0) {
                        executionCallDialogForm.hookId.after = data[0].id;
                        executionCallDialogForm.afterName = data[0].name;
                        executionCallDialogForm.afterDescription =
                            data[0].description;
                        if (data[0].logic) {
                            executionCallDialogForm.afterFnContent =
                                data[0].logic;
                        } else {
                            afterFnEditor.value.setContentValue("");
                        }
                    } else {
                        executionCallDialogForm.hookId.after = "";
                        afterFnEditor.value.setContentValue("");
                    }
                },
            };

            if (code == 200) {
                let str = "";
                if (params.hookType == "1") {
                    str = "查询预处理函数成功！";
                } else if (params.hookType == "2") {
                    str = "查询后处理函数成功！";
                }
                ElMessage.success(str);
                _mapFn[params.hookType] ? _mapFn[params.hookType](data) : "";
            }
            // executionCallDialogForm.beforeFnSaveBtnLoading = false;
            // executionCallDialogForm.afterFnSaveBtnLoading = false;
        };

        const updateAPIModuleHook = async function (id, params) {
            UpdateAPIModuleHook(id, params)
                .then((res) => {
                    if (res.code == 200) {
                        ElMessage.success("更新apiHook成功！");
                    }
                })
                .finally(() => {
                    if (params.type == 1) {
                        executionCallDialogForm.beforeFnSaveBtnLoading = false;
                    } else if (params.type == 2) {
                        executionCallDialogForm.afterFnSaveBtnLoading = false;
                    }
                });
        };

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            _APIModuleList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            _APIModuleList(); // 发起新的请求
        };

        const configureSourceData_SizeChange = async (size) => {
            configureSourceData.pageSize = size;
            configureSourceData.currentPage = 1;
            await sqlDataUnitList();
        };

        const configureSourceData_CurrentChange = async (page) => {
            configureSourceData.currentPage = page;
            await mockDataUnitList();
        };

        const executionCall = async (rowData) => {
            executionCallDialogVisible.value = true;
            executionCallDialogForm.editMode = false;

            const eName = projects.value.filter(
                (i) => i.id == rowData.projectId
            )[0].eName;
            executionCallDialogForm.APIUrl = `https://服务IP:端口/visix/api/${eName}/${rowData.id}`;
            executionCallDialogForm.APIUrl1 = `https://服务IP:端口/visix/${rowData.path}`;
            executionCallDialogForm.method = METHOD[rowData.method];
            executionCallDialogForm.apiId = rowData.id;
            executionCallDialogForm.projectId = rowData.projectId;
            executionCallDialogForm.eName = eName;

            executionCallDialogForm.requestId = "";
            executionCallDialogForm.hookId.before = "";
            executionCallDialogForm.hookId.after = "";
            executionCallDialogForm.bodyData_body = [];
            executionCallDialogForm.bodyData_header = [];
            await _APIModuleBindRequest({ apiModuleId: rowData.id });
            await getAPIModuleHook({ apiId: rowData.id, hookType: 1 });
            await getAPIModuleHook({ apiId: rowData.id, hookType: 2 });
        };

        const bindingDataSource = async (rowData) => {
            configureSourceData.curAPIId = rowData.id;
            configureSource.value = true;
            selectDataUnitType.value = "sqlDataUnit";
            await sqlDataUnitList();
            await _APIModuleBindindUnits({
                apiId: rowData.id,
            });
        };

        const handleEdit = (rowData) => {
            editForm.value._title = "查看/修改 数据源";
            editForm.value._type = "update";
            editForm.value.id = rowData.id;
            editForm.value.projectId = rowData.projectId;
            editForm.value.parentId = rowData.parentId;
            editForm.value.path = rowData.path;
            editForm.value.name = rowData.name;
            editForm.value.description = rowData.description;
            editForm.value.thumbnail = rowData.thumbnail;
            editForm.value.status = rowData.status + "";
            editForm.value.step = rowData.step + "";
            editForm.value.type = rowData.type + "";
            editForm.value.method = rowData.method + "";

            console.log("handleEdit", rowData);
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteAPIModule(rowData.id);
            }).catch(() => {

            });
        };

        const handleAdd = () => {
            editForm.value._title = "新增 数据源";
            editForm.value._type = "add";
            editDialogVisible.value = true;
        };

        const handleClear = () => {
            Object.keys(filterForm).forEach(
                (element) => (filterForm[element] = "")
            );
        }

        const handleSelect = () => {
            const exact = {};
            if (filterForm.projectId) {
                exact['projectId'] = filterForm.projectId
            };
            _APIModuleList({
                page: currentPage.value,
                take: pageSize.value,
                fuzzy: JSON.stringify({
                    name: filterForm.name,
                    path: filterForm.path,
                }),
                exact: JSON.stringify(exact)
            })
        }

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
            editForm.value.status = Number(editForm.value.status);
            editForm.value.step = Number(editForm.value.step);
            editForm.value.type = Number(editForm.value.type);
            editForm.value.method = Number(editForm.value.method);
            // 新增
            if (editForm.value._type == "add") {
                addAPIModule(editForm.value);
            } else if (editForm.value._type == "update") {
                // 更新
                await updateAPIModule(editForm.value);
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

        const executionCallDialogConfirm = async () => {
            const params = {};
            executionCallDialogForm.bodyData_body.forEach(
                (i) => (params[i[0].value] = i[3].value)
            );
            const headers = {};
            executionCallDialogForm.bodyData_header.forEach(
                (i) => (headers[i[0].value] = i[1].value)
            );
            await _APIExecutePreview(
                executionCallDialogForm.eName,
                executionCallDialogForm.apiId,
                params,
                headers
            );
        };

        const executionCallDialogClose = () => {
            executionCallDialogVisible.value = false;
            Object.keys(executionCallDialogForm).forEach((item) => {
                if (item == "bodyData_body" || item == "bodyData_header") {
                    executionCallDialogForm[item] = [];
                    return;
                }
                if (
                    item == "beforeFnSaveBtnLoading" ||
                    item == "afterFnSaveBtnLoading"
                ) {
                    executionCallDialogForm[item] = false;
                    return;
                }
                if (item == "hookId") {
                    executionCallDialogForm[item] = {
                        before: "",
                        after: "",
                    };
                    return;
                }
                if (!item.startsWith("_")) {
                    executionCallDialogForm[item] = "";
                }
            });

            nextTick(() => {
                previewEditor.value.setContentValue("");
            });
        };

        const configureSourceData_DataUnitTypeChange = async (data) => {
            if (data == "sqlDataUnit") {
                await sqlDataUnitList();
            } else if (data == "mockDataUnit") {
                await mockDataUnitList();
            }
        }

        const configureSourceData_handleAdd = async (rowData) => {
            let unitType = 1;
            if (rowData.hasOwnProperty("sql")) {
                unitType = 1;
            } else if (rowData.hasOwnProperty("schema")) {
                unitType = 2;
            }
            await boundDataUnit({
                apiId: configureSourceData.curAPIId,
                unitId: rowData.id,
                status: 1, // 0 启用 1 禁用
                unitType,
            });
        };

        const configureSourceData_switchChange = async (value) => {
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            _APIModuleDataUnitEnabled({
                m_id: value.m_id,
                status: value.m_status__boolean ? 0 : 1, // m_status__boolean 已经被组件改变了 是真实的
            })
                .then()
                .finally(() => {
                    loading.close();
                });
        };

        const configureSourceData_delete = async (value) => {
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            deleteAPIModuleDataUnits({
                unitIds: [value.m_id],
            })
                .then(async () => {
                    await _APIModuleBindindUnits({
                        apiId: configureSourceData.curAPIId,
                    });
                })
                .finally(async () => {
                    loading.close();
                });
        };

        const focus_selectProjects = async () => {
            await projectList();
        };

        const request_bodyFormDataChange = async (data) => {
            if (executionCallDialogForm.editMode === true) {
                const loading = ElLoading.service({
                    lock: true,
                    text: "Loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });

                const schemas = {
                    headerSchema: JSON.stringify(
                        executionCallDialogForm.bodyData_header.map(
                            (rowData) => {
                                return {
                                    id: rowData[0].id || generateString(36),
                                    info: rowData[2].value,
                                    key: rowData[0].value,
                                    status: 0,
                                    value: rowData[1].value,
                                };
                            }
                        )
                    ),
                    bodySchema: JSON.stringify(
                        executionCallDialogForm.bodyData_body.map((rowData) => {
                            return {
                                id: rowData[0].id || generateString(36),
                                type: rowData[1].value,
                                required: rowData[2].value,
                                info: rowData[4].value,
                                key: rowData[0].value,
                                status: 0,
                                value: rowData[3].value,
                            };
                        })
                    ),
                    querySchema: "[]",
                };

                // 如果 executionCallDialogForm.requestId 不存在 表示要使用新增接口
                if (executionCallDialogForm.requestId) {
                    UpdateAPIModuleRequest(
                        executionCallDialogForm.requestId,
                        schemas
                    )
                        .then(async () => {
                            await _APIModuleBindRequest({
                                apiModuleId: executionCallDialogForm.apiId,
                            });
                        })
                        .finally(() => {
                            loading.close();
                        });
                    return;
                }

                AddAPIModuleRequest({
                    apiModuleId: executionCallDialogForm.apiId,
                    ...schemas,
                })
                    .then(async () => {
                        await _APIModuleBindRequest({
                            apiModuleId: executionCallDialogForm.apiId,
                        });
                    })
                    .finally(() => {
                        loading.close();
                    });
            }
        };

        const request_bodyFormDataHeaderItemAdd = async (e) => {
            const data = e.map((row) => {
                row[0] = {
                    type: "input",
                    placeholder: "添加参数",
                    value: "",
                    id: row[0].id,
                };
                row[1] = {
                    type: "select",
                    placeholder: "字段类型",
                    value: "String",
                    id: row[0].id,
                };
                row[2] = { type: "checkbox", value: false, id: row[0].id };
                row[3] = {
                    type: "input",
                    placeholder: "示例值",
                    value: "",
                    id: row[0].id,
                };
                row[4] = {
                    type: "input",
                    placeholder: "说明",
                    value: "",
                    id: row[0].id,
                };
                return row;
            });
            executionCallDialogForm.bodyData_body.push(...data);
            request_bodyFormDataChange();
        };

        const request_bodyFormDataItemAdd = async (e) => {
            executionCallDialogForm.bodyData_body.push([...e]);
            request_bodyFormDataChange();
        };

        const request_bodyFormDataItemDelete = async (e) => {
            executionCallDialogForm.bodyData_body.forEach((item, index) => {
                if (item[0].id == e[0].id) {
                    executionCallDialogForm.bodyData_body.splice(index, 1);
                }
            });
            request_bodyFormDataChange();
        };

        const request_headerFormDataChange = async (data) => {
            request_bodyFormDataChange(data);
        };

        const request_headerFormDataHeaderItemAdd = async (e) => {
            const data = e.map((row) => {
                row[0] = {
                    type: "input",
                    placeholder: "键名",
                    value: "",
                    id: row[0].id,
                };
                row[1] = {
                    type: "input",
                    placeholder: "键值",
                    value: "",
                    id: row[0].id,
                };
                row[2] = {
                    type: "input",
                    placeholder: "描述",
                    value: "",
                    id: row[0].id,
                };
                return row;
            });
            executionCallDialogForm.bodyData_header.push(...data);
            request_bodyFormDataChange();
        };

        const request_headerFormDataItemAdd = async (e) => {
            executionCallDialogForm.bodyData_header.push([...e]);
            request_bodyFormDataChange();
        };

        const request_headerFormDataItemDelete = async (e) => {
            executionCallDialogForm.bodyData_header.forEach((item, index) => {
                if (item[0].id == e[0].id) {
                    executionCallDialogForm.bodyData_header.splice(index, 1);
                }
            });
            request_bodyFormDataChange();
        };

        const beforeFnClick = async () => {
            executionCallDialogForm.beforeFnSaveBtnLoading = true;

            if (executionCallDialogForm.hookId.before == "") {
                await _APIModuleAddHook({
                    apiId: executionCallDialogForm.apiId,
                    hookType: 1,
                    name: "api_preprocessing_" + executionCallDialogForm.apiId,
                    logic: beforeFnEditor.value.getContentValue(),
                    description: `适用于${executionCallDialogForm.apiId}接口的预处理脚本`,
                });
            } else {
                await updateAPIModuleHook(
                    executionCallDialogForm.hookId.before,
                    {
                        name: executionCallDialogForm.beforeName,
                        logic: beforeFnEditor.value.getContentValue(),
                        description: executionCallDialogForm.beforeDescription,
                        type: 1,
                    }
                );
            }
        };

        const afterFnClick = async () => {
            executionCallDialogForm.afterFnSaveBtnLoading = true;

            if (executionCallDialogForm.hookId.after == "") {
                await _APIModuleAddHook({
                    apiId: executionCallDialogForm.apiId,
                    hookType: 2,
                    name: "api_postprocessing_" + executionCallDialogForm.apiId,
                    logic: afterFnEditor.value.getContentValue(),
                    description: `适用于${executionCallDialogForm.apiId}接口的后处理脚本`,
                });
            } else {
                await updateAPIModuleHook(
                    executionCallDialogForm.hookId.after,
                    {
                        name: executionCallDialogForm.afterName,
                        logic: afterFnEditor.value.getContentValue(),
                        description: executionCallDialogForm.afterDescription,
                        type: 2,
                    }
                );
            }
        };

        const handleBeforeFnFold = () => {
            executionCallDialogForm.beforeFnFold = executionCallDialogForm.beforeFnFold == '' ? true : '';
        }

        const handleAfterFnFold = () => {
            executionCallDialogForm.afterFnFold = executionCallDialogForm.afterFnFold == '' ? true : ''
        }

        const handlePreviewResultFold = () => {
            executionCallDialogForm.previewResFold = executionCallDialogForm.previewResFold == '' ? true : ''
        }



        const fullPage = async () => {
            fullEditorDialogVisible.value = true;
            fullEditorLogic.value = editForm.value.logic
        }

        const handleFullEditorDialogClose = async () => {
            fullEditorDialogVisible.value = false;
            // fullEditorLogic.value = "";
        }

        const handleFullEditorSaveCode = async (data) => {
            FunctionEditor.value.setContentValue(data);
            editForm.value.logic = data;
            // await updateFunction(editForm.value.id, editForm.value);
        }

        const handleCodeChange = async (data) => {
            editForm.value.logic = data;
            FunctionEditor.value.setContentValue(data);
        }



        /**
         * 生命周期
         */
        onMounted(async () => {
            _APIModuleList();
            await projectList();
        });

        return {
            dataUnits,
            tableData,
            currentPage,
            pageSize,
            total,
            projects,
            showLoading,
            editDialogVisible,
            executionCallDialogVisible,
            configureSource,
            selectDataUnitType,
            fullEditorDialogVisible,
            fullEditorLogic,
            configureSourceData,
            filterForm,
            editForm,
            executionCallDialogForm,
            request_headerForm_headerConfig,

            editFormRef,
            previewEditor,
            beforeFnEditor,
            afterFnEditor,

            handleCurrentChange,
            handleSizeChange,
            configureSourceData_CurrentChange,
            configureSourceData_SizeChange,

            formatDateTime,
            formatStatus,
            formatStep,
            formatType,
            formatMethod,

            executionCall,
            bindingDataSource,
            handleEdit,
            handleDelete,
            handleAdd,
            handleClear,
            handleSelect,
            handleEditConfirm,
            handleEditDialogClose,
            executionCallDialogClose,
            executionCallDialogConfirm,

            configureSourceData_DataUnitTypeChange,
            configureSourceData_handleAdd,
            configureSourceData_switchChange,
            configureSourceData_delete,

            focus_selectProjects,
            request_bodyFormDataChange,
            request_bodyFormDataHeaderItemAdd,
            request_bodyFormDataItemAdd,
            request_bodyFormDataItemDelete,
            request_headerFormDataChange,
            request_headerFormDataHeaderItemAdd,
            request_headerFormDataItemAdd,
            request_headerFormDataItemDelete,

            beforeFnClick,
            afterFnClick,
            handleBeforeFnFold,
            handleAfterFnFold,
            handlePreviewResultFold,
        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner) {
    border: none !important;
}

:deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 0 0 0 10px;
}

:deep(.el-form-item__content) {
    align-content: flex-start;
}

.functionHeader {
    width: 100%;
    background-color: #1e1e1e;
    color: #ccc;
    padding-left: 20px;
    height: 28px;
    line-height: 28px;
    user-select: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.functionFooter {
    width: 100%;
    background-color: #1e1e1e;
    color: #ccc;
    padding-left: 20px;
    height: 28px;
    line-height: 28px;
    user-select: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.beforeFnEditor {
    height: 300px;
}

.afterFnEditor {
    height: 300px;
}

.previewEditor {
    height: 300px;
}

.tag {
    background-color: #2aaaff;
    color: #5f5d5d;
    border-radius: 6px;
    padding: 0px 8px;
    cursor: pointer;
    user-select: none;
    margin-right: 4px;
}


.beforeFnFold {
    height: 30px;
}

.beforeFnUnFold {
    height: 465px;
}

.previewResUnFold {
    height: 340px;
}

.foldIconRotate {
    transform: rotate(180deg);
}
</style>
