<template>
    <div>
        <p>makeTable</p>

        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="id" prop="id" v-show="disabledAccount">
                <el-input v-model="editForm.id" placeholder="" disabled="true" />
            </el-form-item>
            <el-form-item label="数据库" prop="database">
                <el-select v-model="editForm.database" placeholder="选择数据库" clearable>
                    <el-option v-for="item in databases" :key="item.value" :label="item.label" :value="item.value"
                        :disabled="item.disabled" />
                </el-select>
                <el-button style="margin-left: 10px;" @click="handleGetDataBase()">获取数据库</el-button>
            </el-form-item>
            <el-form-item label="表名" prop="tableName">
                <el-input v-model="editForm.prefix" placeholder="请输入业务表前缀" style="width:140px;" />
                <div>&nbsp; __ &nbsp;</div>
                <el-input v-model="editForm.tableName" placeholder="请输入表名" style="width:235px;" />
                <el-button style="margin-left: 10px;" @click="handleQueryTableExist()">验证表是否存在</el-button>
            </el-form-item>
            <el-form-item>
                <RequestParams title="表字段" :bodyData="editForm.tableField" :headerConfig="tableField_headerConfig"
                    @headerItemAdd="tableField_FormDataHeaderItemAdd" @itemAdd='tableField_FormDataItemAdd'
                    @itemDelete='tableField_FormDataItemDelete'></RequestParams>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleCreateTable">开始建表</el-button>
        <el-button type="primary" @click="handleResetEditForm">清空表单</el-button>
    </div>
</template>


<script>
import { onMounted, ref, reactive, defineAsyncComponent } from "vue";
import {
    DataSourceList,
    TableExist,
    CreateTable,
} from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepClone, formatDateTime } from "../utils";

import RequestParams from "../components/request-form/request-form.jsx";

export default {
    components: {
        RequestParams,
    },
    setup() {
        /**
         * 变量数据
         */
        const databases = ref([

        ])

        const tableField_headerConfig = [
            { name: "字段", width: "30" },
            { name: "类型", width: "22" },
            { name: "长度", width: "30" },
            { name: "小数点", width: "10" },
            { name: "是否为空", width: "10" },
            { name: "是否主键", width: "10" },
        ];


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
            database: "",
            tableName: "",
            prefix: "",
            tableField: []
        });
        // 编辑表单验证规则
        const editFormRules = ref({
            database: [
                {
                    required: true,
                    message: "请选择数据库！",
                    trigger: "change",
                },
            ],
            tableName: [
                {
                    required: true,
                    message: "请输入表名！",
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
        const dataSourceList = (params) => {
            showLoading.value = true;
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
                        databases.value = res.data.data.map((i, index) => {
                            return {
                                key: i.id,
                                value: i.name,
                                index
                            }
                        })

                    }
                })
                .finally(() => {
                    showLoading.value = false;
                });
        };

        const tableExist = (params) => {
            showLoading.value = true;
            TableExist(params)
                .then((res) => ElMessage.success(res.code === 200 ? "恭喜您,该表可用！" : message))
                .finally(() => {
                    showLoading.value = false;
                });
        }

        const createTable
            = (params) => {
                showLoading.value = true;
                CreateTable
                    (params)
                    .then((res) => ElMessage.success(res.code === 200 ? "创建表成功!" : message))
                    .finally(() => {
                        showLoading.value = false;
                    });
            }



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

        const handleGetDataBase = () => {
            dataSourceList();
        }

        const formCheck = () => {
            return new Promise((resolve) => {
                if (!editForm.database) {
                    ElMessage.warning("请先选择数据源！");
                    resolve(false);
                    return
                }
                if (!editForm.prefix) {
                    ElMessage.warning("业务前缀名是必须的！");
                    resolve(false);
                    return
                }
                if (!editForm.tableName) {
                    ElMessage.warning("表名不能为空！");
                    resolve(false);
                    return
                }
                resolve(true);
            })
        }

        const handleCreateTable = async () => {
            if (!await formCheck()) return
            const tableFields = editForm.tableField.reduce((t, c, i) => {
                return t.push({
                    key: c[0].value,
                    type: c[1].value,
                    length: c[2].value,
                    decimalPoint: c[3].value,
                    isNull: c[4].value,
                    primaryKey: c[5].value,
                }) && t
            }, []);

            const databaseId = databases.value.filter(i => i.value == editForm.database)[0].key;
            createTable({
                databaseId,
                tableName: editForm.prefix + "__" + editForm.tableName,
                tableFields
            })
        }

        const handleResetEditForm = () => {
            editForm.id = "";
            editForm.database = "";
            editForm.tableName = "";
            editForm.prefix = "";
            editForm.tableField = [];
        }

        const handleQueryTableExist = async () => {
            if (!await formCheck()) return
            const databaseId = databases.value.filter(i => i.value == editForm.database)[0].key;
            tableExist({
                databaseId,
                tableName: editForm.prefix + "__" + editForm.tableName
            });
        }

        const tableField_FormDataHeaderItemAdd = async (e) => {
            const data = e.map((row) => {
                row[0] = {
                    type: "input",
                    placeholder: "字段名",
                    value: "",
                    id: 1,
                };
                row[1] = {
                    type: "select",
                    placeholder: "字段类型",
                    value: "varchar",
                    id: 2,
                    options: [
                        { key: "tinyint", value: "tinyint", label: "tinyint" },
                        { key: "smallint", value: "smallint", label: "smallint" },
                        { key: "mediumint", value: "mediumint", label: "mediumint" },
                        { key: "int", value: "int", label: "int" },
                        { key: "integer", value: "integer", label: "integer" },
                        { key: "bigint", value: "bigint", label: "bigint" },
                        { key: "bit", value: "bit", label: "bit" },
                        { key: "real", value: "real", label: "real" },
                        { key: "double", value: "double", label: "double" },
                        { key: "float", value: "float", label: "float" },
                        // { key: "decimal", value: "decimal", label: "decimal" },
                        { key: "numeric", value: "numeric", label: "numeric" },
                        { key: "char", value: "char", label: "char" },
                        { key: "varchar", value: "varchar", label: "varchar" },
                        { key: "date", value: "date", label: "date" },
                        { key: "time", value: "time", label: "time" },
                        { key: "year", value: "year", label: "year" },
                        { key: "timestamp", value: "timestamp", label: "timestamp" },
                        { key: "datetime", value: "datetime", label: "datetime" },
                        { key: "tinyblob", value: "tinyblob", label: "tinyblob" },
                        { key: "blob", value: "blob", label: "blob" },
                        { key: "mediumblob", value: "mediumblob", label: "mediumblob" },
                        { key: "longblob", value: "longblob", label: "longblob" },
                        { key: "tinytext", value: "tinytext", label: "tinytext" },
                        { key: "text", value: "text", label: "text" },
                        { key: "mediumtext", value: "mediumtext", label: "mediumtext" },
                        { key: "longtext", value: "longtext", label: "longtext" },
                        { key: "enum", value: "enum", label: "enum" },
                        { key: "set", value: "set", label: "set" },
                        { key: "binary", value: "binary", label: "binary" },
                        { key: "varbinary", value: "varbinary", label: "varbinary" },
                        { key: "point", value: "point", label: "point" },
                        { key: "linestring", value: "linestring", label: "linestring" },
                        { key: "polygon", value: "polygon", label: "polygon" },
                        { key: "geometry", value: "geometry", label: "geometry" },
                        { key: "multipoint", value: "multipoint", label: "multipoint" },
                        { key: "multilinestring", value: "multilinestring", label: "multilinestring" },
                        { key: "multipolygon", value: "multipolygon", label: "multipolygon" },
                        { key: "geometrycollection", value: "geometrycollection", label: "geometrycollection" },
                    ]
                };
                row[2] = {
                    type: "input",
                    placeholder: "长度",
                    value: "",
                    id: 3,
                };
                row[3] = {
                    type: "input",
                    placeholder: "小数点",
                    value: "",
                    id: 4,
                };
                row[4] = {
                    type: "checkbox",
                    placeholder: "是否为空",
                    value: "",
                    id: 5,
                };
                row[5] = {
                    type: "checkbox",
                    placeholder: "是否主键",
                    value: "",
                    id: 6,
                };
                return row;
            });
            editForm.tableField.push(...data);
        };

        const tableField_FormDataItemAdd = async (e) => {
            editForm.tableField.push([...e]);
        }

        const tableField_FormDataItemDelete = async (e) => {
            editForm.tableField.forEach((item, index) => {
                if (item[0].id == e[0].id) {
                    editForm.tableField.splice(index, 1)
                }
            });
        }

        /**
         * 生命周期
         */
        onMounted(async () => {
        });

        return {
            databases,
            tableField_headerConfig,

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
            handleGetDataBase,
            handleCreateTable,
            handleResetEditForm,
            handleQueryTableExist,
            tableField_FormDataHeaderItemAdd,
            tableField_FormDataItemAdd,
            tableField_FormDataItemDelete
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
