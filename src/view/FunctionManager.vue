<template>
    <div>
        <p>FunctionManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增函数</el-button>
        </div>


        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" border>
            <el-table-column label="Serial" width="65">
                <template #default="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="Name" width="150"></el-table-column>
            <el-table-column prop="description" label="Description" width="150"></el-table-column>
            <el-table-column prop="params" label="Params" width="150" :formatter="formatParams"></el-table-column>

            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column label="Operate" width="250" fixed="right">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm._title" width="60%"
            :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" disabled="true" />
                </el-form-item>
                <el-form-item label="名字" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入函数名称 (注意：使用关键词会导致函数失效) " />
                </el-form-item>
                <el-form-item label="参数" prop="params">
                    <RequestParams title="" :bodyData="editForm._params" :headerConfig="functionParamsHeaderConfig"
                        @formDataChange="functionParamsFormDataChange" @headerItemAdd="functionParamsHeaderItemAdd"
                        @itemAdd='functionParamsItemAdd' @itemDelete='functionParamsItemDelete'></RequestParams>
                </el-form-item>
                <el-form-item label="代码" prop="logic">
                    <editorFuncBox :name="editForm.name" :params="editForm._params" @onCopy="handleCopy" :isShowCopy="true" :isShowFullPage="true"
                        @onFullPage="fullPage">
                        <MonacoEditor initialLanguage="javascript" ref="FunctionEditor"
                            @contentChange="FunctionEditorContentChange" style="height: 300px;">
                        </MonacoEditor>
                    </editorFuncBox>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="editForm.description" placeholder="请输入函数描述" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                    <el-button @click="handleEditDialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-drawer v-model="fullEditorDialogVisible" width="100%" direction="ttb" title="全屏编辑器"
            :before-close="handleFullEditorDialogClose">
            <fullEditor :logic="fullEditorLogic" @handleSaveCode="handleFullEditorSaveCode"
                @codeChange="handleCodeChange">
            </fullEditor>
        </el-drawer>

        <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
            :page-size="pageSize" :total="total" :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper" style="margin-top: 10px;">
        </el-pagination>
    </div>
</template>
<script>
import { onMounted, ref, defineAsyncComponent, nextTick } from "vue";
import {
    FunctionList,
    AddFunction,
    DeleteFunction,
    UpdateFunction,
} from "../api";
import { FullScreen, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, } from "element-plus";
import { generateString, formatDateTime } from '../utils';
import MonacoEditor from "../components/monaco.vue";
import RequestParams from '../components/request-form/request-form.jsx';
import fullEditor from "../components/full-editor/index.jsx";
import editorFuncBox from '../components/editor-func-box/index.jsx';

export default {
    components: {
        MonacoEditor,
        RequestParams,
        fullEditor,
        editorFuncBox
    },
    setup() {
        /**
         * 常量数据
         */
        const functionParamsHeaderConfig = [
            { name: "入参名", width: "25" },
            { name: "默认值", width: "25" },
            { name: "说明", width: "30" },
        ]


        /**
         * 变量数据
         */
        const tableData = ref([]);

        const currentPage = ref(1); // 当前页码
        const pageSize = ref(10); // 每页大小
        const total = ref(0); // 总记录数

        const showLoading = ref(false); // 控制显示加载中遮罩层
        const selectDataBase = ref([]) // 数据库选库
        const editDialogVisible = ref(false); // 编辑对话框可见性
        const fullEditorDialogVisible = ref(false); // 编辑器全屏弹窗可见性
        const fullEditorLogic = ref("");


        // 编辑表单数据
        const editForm = ref({
            _title: "", // 标题
            _type: "", // 类型 编辑/查看/新增

            _params: [], // 显示在表单内的数据格式
            _params_editor: "", // 显示在编辑器内参数说明的内容

            // ... 传输给后端接口的内容
            id: "",
            name: "",
            logic: "",
            description: "",
            params: []
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
            // 其他字段的验证规则
        });

        /**
         * vue virtual dom
         */
        const editFormRef = ref(null);
        const FunctionEditor = ref(null)

        // 工具函数
        const formatParams = function (row, column) {
            return row[column.property] === "[]" ? "无参" : "有参,详见编辑表单";
        };

        /**
         * api接口请求
         */
        const functionList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            FunctionList(params)
                .then((res) => {
                    if (res.code === 200) {
                        // ElMessage.success("查询成功！");
                        tableData.value = res.data.data; // 更新表格数据
                        total.value = res.data.meta.itemCount; // 更新总记录数
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const addFunction = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddFunction(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("新增成功！");
                        functionList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                    resetEditForm();
                });
        };

        const deleteFunction = (id) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteFunction(id)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        functionList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateFunction = async (id = "", params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateFunction(id, params);
            if (code == 200) {
                // ElMessage.success("更新成功！");
                functionList();
            }
            showLoading.value = false;
        };

        /**
         * 事件函数绑定
         */

        const handleSizeChange = (size) => {
            pageSize.value = size; // 更新每页大小
            currentPage.value = 1; // 重置当前页码为第一页
            functionList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            functionList(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.value._title = "查看/修改 数据源";
            editForm.value._type = "update";
            editForm.value.id = rowData.id;
            editForm.value.name = rowData.name;
            editForm.value.logic = rowData.logic;
            editForm.value.description = rowData.description;
            editForm.value.params = rowData.params;
            editForm.value._params = [];
            try {
                const list = JSON.parse(rowData.params);
                list.forEach(row => {
                    editForm.value._params.push(
                        [
                            { id: row.id, placeholder: "", type: "input", value: row.key },
                            { id: row.id, placeholder: "", type: "input", value: row.value },
                            { id: row.id, placeholder: "", type: "input", value: row.info },
                        ]
                    )
                });
                functionParamsFormDataChange()
                nextTick(() => {
                    FunctionEditor.value.setContentValue(editForm.value.logic);
                })
            } catch (e) {
                console.error("params解析错误", e)
            }
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteFunction(rowData.id);
            }).catch(() => {

            });
        };

        const handleCopy = async (rowData) => {
            rowData = editForm.value;
            let str = '';
            JSON.parse(rowData.params).forEach(row => str += ` , ${row.key}`);
            const template = `function ${rowData.name}(${str.slice(2)}){
                ${rowData.logic}
            }`
            await navigator.clipboard.writeText(template);
            ElMessage.success("复制成功");
        }

        const handleAdd = () => {
            editForm.value._title = "新增工具函数";
            editForm.value._type = "add";
            editDialogVisible.value = true;

            editForm.value._params = [];
            editForm.value.params = [];
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
                (element) => {
                    if (element == "params" || element == "_params") {
                        editForm.value[element] = []
                        return
                    };
                    editForm.value[element] = ""
                }
            );
            editFormRef.value.clearValidate();
        };

        const saveEditChanges = async () => {
            // 执行保存修改逻辑
            // ...
            editDialogVisible.value = false;
            editForm.value.params = []
            editForm.value._params.forEach(rowData => {
                editForm.value.params.push({
                    id: rowData[0].id || generateString(36),
                    key: rowData[0].value,
                    value: rowData[1].value,
                    info: rowData[2].value,
                })
            })
            editForm.value.params = JSON.stringify(editForm.value.params);
            // editForm.value.logic = FunctionEditor.value.getContentValue();

            // 新增
            if (editForm.value._type == "add") {
                addFunction(editForm.value);
            } else if (editForm.value._type == "update") {
                // 更新
                await updateFunction(editForm.value.id, editForm.value);
            }
            console.log("save cf", editForm.value);
        };

        const FunctionEditorContentChange = (e) => {
            editForm.value.logic = e;
        }

        /**
         * 生命周期
         */

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

        const functionParamsFormDataChange = () => {
            let str = "";
            editForm.value._params.forEach(i => str += `,${i[0].value}`)
            editForm.value._params_editor = str.slice(2);
        }

        const functionParamsHeaderItemAdd = async (e) => {
            const data = e.map(row => {
                row[0] = { type: "input", placeholder: "添加参数", value: "", id: row[0].id }
                row[1] = { type: "input", placeholder: "添加默认值", value: "", id: row[0].id }
                row[2] = { type: "input", placeholder: "说明", value: "", id: row[0].id }
                return row
            })
            editForm.value._params.push(...data);
        }

        const functionParamsItemAdd = async (e) => {
            editForm.value._params.push([...e]);
            functionParamsFormDataChange()
        }

        const functionParamsItemDelete = async (e) => {
            editForm.value._params.forEach((item, index) => {
                if (item[0].id == e[0].id) {
                    editForm.value._params.splice(index, 1)
                }
            });
            functionParamsFormDataChange()
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
            await updateFunction(editForm.value.id, editForm.value);
        }

        const handleCodeChange = async (data) => {
            editForm.value.logic = data;
            FunctionEditor.value.setContentValue(data);
        }


        /**
         * 生命周期
         */
        onMounted(() => {
            functionList();
        });

        return {
            functionParamsHeaderConfig,

            tableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            selectDataBase,
            editDialogVisible,
            fullEditorDialogVisible,
            fullEditorLogic,
            editForm,

            editFormRef,
            FunctionEditor,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatParams,
            handleEdit,
            handleDelete,
            handleCopy,
            handleAdd,
            FunctionEditorContentChange,
            handleEditConfirm,
            handleEditDialogClose,
            fullPage,
            handleFullEditorDialogClose,
            handleFullEditorSaveCode,
            handleCodeChange,

            functionParamsFormDataChange,
            functionParamsHeaderItemAdd,
            functionParamsItemAdd,
            functionParamsItemDelete
        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner) {
    border: none !important;
}

:deep(.el-drawer__header) {
    margin-bottom: 0%;
}

:deep(.el-drawer) {
    background-color: #313334;
    height: 100% !important;
}
</style>
