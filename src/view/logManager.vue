<template>
    <div>
        <p>loggerManager</p>

        <!-- 表单查询条件 -->
        <div class="operate" style="margin-bottom: 10px;">
            <el-row :gutter="24">
                <el-col :span="6">
                    <el-form-item label="请求类型">
                        <el-select v-model="filterForm.requestMethod" placeholder="选择请求类型" clearable>
                            <el-option v-for="item in methodOptions" :key="item.value" :label="item.label"
                                :value="item.value" :disabled="item.disabled" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="响应状态">
                        <el-select v-model="filterForm.responseStatus" placeholder="选择响应状态" clearable>
                            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                :value="item.value" :disabled="item.disabled" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="日志场景">
                        <el-select v-model="filterForm.logScenario" placeholder="选择日志场景" clearable>
                            <el-option v-for="item in logScenarioOptions" :key="item.value" :label="item.label"
                                :value="item.value" :disabled="item.disabled" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="日志等级">
                        <el-select v-model="filterForm.logType" placeholder="选择日志等级" clearable>
                            <el-option v-for="item in logLevelOptions" :key="item.value" :label="item.label"
                                :value="item.value" :disabled="item.disabled" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="请求时间范围">
                        <el-col :span="12">
                            <el-date-picker v-model="filterForm.startTime" type="datetime" placeholder="选择开始时间"
                                style="width: 100%" />
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker v-model="filterForm.endTime" type="datetime" placeholder="选择结束时间"
                                style="width: 100%" /></el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="响应速度范围" label-width="120px">
                        <el-col :span="12">
                            <el-input-number v-model="filterForm.startSpeed" :min="0" />
                        </el-col>
                        <el-col :span="12">
                            <el-input-number v-model="filterForm.endSpeed" :min="1" />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="10">
                    <el-form-item label="请求地址">
                        <el-input v-model="filterForm.requestUrl" clearable
                            placeholder="支持模糊搜索,例如:    /proxyApi/sgj/sbhzzb?pk=CAJFBW7GmOf" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="请求来源(origin)">
                        <el-input v-model="filterForm.requestOrigin" clearable
                            placeholder="支持模糊搜索,例如:    https://element-plus.org/zh-C" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button type="primary" @click="handleSelect">查询</el-button>
            <el-button type="primary" @click="handleResetSelect">重置查询条件</el-button>
            <el-button type="danger" @click="handleDeleteAll">清空整个日志存储库</el-button>
        </div>

        <!-- 表格 -->
        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column type="expand">
                <template #default="props">
                    <div style="padding: 10px;">
                        <template v-if="props.row.requestQuery">
                            <p m="t-0 b-2">请求入参(Query):
                            <div class="jsonPre">
                                <span class="btn-pre-copy" @click="copyDataClipboard(props.row.requestQuery)">复制代码</span>
                                <pre v-html='parse2(props.row.requestQuery)'></pre>
                            </div>
                            </p>
                        </template>
                        <template v-if="props.row.requestBody">
                            <p m="t-0 b-2">请求入参(Body):
                            <div class="jsonPre">
                                <span class="btn-pre-copy" @click="copyDataClipboard(props.row.requestBody)">复制代码</span>
                                <pre v-html='parse2(props.row.requestBody)'></pre>
                            </div>
                            </p>
                        </template>
                        <template v-if="props.row.responseData">
                            <p m="t-0 b-2">响应数据:
                            <div class="jsonPre">
                                <span class="btn-pre-copy" @click="copyDataClipboard(props.row.responseData)">复制代码</span>
                                <pre v-html='parse2(props.row.responseData)'></pre>
                            </div>
                            </p>
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="requestDate" label="请求时间" :formatter="formatDateTime" width="110"></el-table-column>
            <el-table-column prop="requestUrl" label="请求地址" width="180">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.requestUrl">
                        <span class="text-cell">{{ scope.row.requestUrl }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="requestOrigin" label="请求来源" width="180">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.requestOrigin">
                        <span class="text-cell">{{ scope.row.requestOrigin }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="userId" label="用户id" width="110"></el-table-column>
            <el-table-column prop="requestClientRemoteAddress" label="客户端IP" width="180">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.requestClientRemoteAddress">
                        <span class="text-cell">{{ scope.row.requestClientRemoteAddress }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="logScenario" label="种类" width="80"></el-table-column>
            <el-table-column prop="logType" label="类型" width="80"></el-table-column>
            <el-table-column prop="requestMethod" label="方法" width="80"></el-table-column>
            <el-table-column prop="responseTime" label="速度(ms)" width="60"></el-table-column>
            <el-table-column prop="responseStatus" label="响应状态" width="60"></el-table-column>
            <el-table-column prop="data" label="系统日志" width="180">
                <template #default="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.data">
                        <span class="text-cell">{{ scope.row.data }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Operate" width="90" fixed="right">
                <template #default="scope">
                    <!-- <el-button type="primary" @click="handleEdit(scope.row)">查</el-button> -->
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
    LogList,
    DeleteLogOne,
    RemoveLogTable,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import MonacoEditor from "../components/monaco.vue";
import { deepClone, formatDateTime } from "../utils";

export default {
    components: {
        MonacoEditor,
    },
    setup() {
        /**
         * 常量数据
         */
        const methodOptions = [
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'DELETE', label: 'DELETE' },
            { value: 'PUT', label: 'PUT' },
            { value: 'HEAD', label: 'HEAD' }
        ]
        const statusOptions = [
            { value: '200', label: '200' },
            { value: '400', label: '400' },
            { value: '404', label: '404' },
            { value: '422', label: '422' },
            { value: '500', label: '500' }
        ]
        const logScenarioOptions = [
            { value: 'api', label: '接口日志' },
            { value: 'system', label: '系统日志' },
            { value: 'plugin', label: '插件日志' },
            { value: 'database', label: '数据库日志' },
        ]
        const logLevelOptions = [
            { value: 'info', label: 'INFO' },
            { value: 'error', label: 'ERROR' },
            // { value: 'warn', label: 'WARN' },
        ]
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

        // 过滤查询表单数据
        const filterForm = reactive({
            requestMethod: "",
            responseStatus: "",
            logScenario: "",
            logType: "",
            requestOrigin: "",
            requestUrl: "",
            startTime: "",
            endTime: "",
            startSpeed: 0,
            endSpeed: 1000,
        })

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
        const logList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            LogList(params)
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

        const deleteLogOne = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteLogOne(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        logList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const removeLogTable = () => {
            showLoading.value = true; // 显示加载中遮罩层
            RemoveLogTable()
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("全部清空成功！");
                        logList();
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
            logList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            logList(); // 发起新的请求
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
            deleteLogOne(rowData._id);
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


        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            editDialogVisible.value = false;
        };

        const copyDataClipboard = async (value) => {
            await navigator.clipboard.writeText(value);
            ElMessage.success("已复制到剪贴板");
        };

        // json格式美化
        const parse2 = (str) => {
            // 设置缩进为2个空格
            if (!str) return '---'
            str = JSON.stringify(str, null, 2);
            str = str
                .replace(/&/g, '&')
                .replace(/</g, '<')
                .replace(/>/g, '>');
            return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        const handleSelect = () => {
            Object.keys(filterForm)
            const formData = {
                page: currentPage.value,
                take: pageSize.value
            };
            for (let [key, value] of Object.entries(filterForm)) {
                if (value || value === 0) {
                    formData[key] = value
                }
            }
            logList(formData)
        }

        const handleResetSelect = () => {
            Object.keys(filterForm).forEach(i => {
                filterForm[i] = "";
                if (i == "startSpeed") {
                    filterForm[i] = 0;
                } else if (i == 'endSpeed') {
                    filterForm[i] = 1000;
                }
            })
        }

        const handleDeleteAll = () => {
            ElMessageBox.confirm("Are you sure to delete all logger ?").then(() => {
                removeLogTable();
            }).catch(() => {

            });
        }

        /**
         * 生命周期
         */
        onMounted(async () => {
            logList();
        });

        return {
            methodOptions,
            statusOptions,
            logScenarioOptions,
            logLevelOptions,

            tableData,
            currentPage,
            pageSize,
            total,
            dataSources,
            showLoading,
            editDialogVisible,
            filterForm,
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
            handleEditDialogClose,
            copyDataClipboard,

            parse2,
            handleSelect,
            handleResetSelect,
            handleDeleteAll
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

/* /deep/ .el-input__inner {
    border: none !important;
} */

/*-------滚动条整体样式----*/
.jsonPre::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

/*滚动条里面小方块样式*/
.jsonPre::-webkit-scrollbar-thumb {
    border-radius: 100px;
    -webkit-box-shadow: inset 0 0 5px rgba(32, 83, 107, 0.92);
    background: rgba(160, 158, 177, 0.331);
}

/*边角*/
.jsonPre::-webkit-scrollbar-corner {
    background: rgba(160, 158, 177, 0.331);
}

/*滚动条里面轨道样式*/
.jsonPre::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(32, 83, 107, 0.92);
    border-radius: 0;
    background: rgba(103, 102, 114, 0.331);
}

.jsonPre {
    background-color: #262629;
    color: #fff;
    /* width: 90%; */
    max-height: 30vh;
    outline: 1px solid #ccc;
    padding: 5px;
    overflow: scroll;
    border-radius: 4px;
    position: relative;
}

.number {
    color: darkorange;
}

.boolean {
    color: blue;
}

.null {
    color: magenta;
}

.btn-pre-copy {
    position: absolute;
    right: 8px;
    top: 4px;
    color: #a5a59f;
    user-select: none;
    cursor: pointer;
}

.string {
    color: green;
}

.number {
    color: darkorange;
}

.boolean {
    color: blue;
}

.null {
    color: magenta;
}

.key {
    color: red;
}
</style>
