<template>
    <div>
        <p>ProjectManager</p>

        <div class="operate" style="margin-bottom: 10px;">
            <el-button type="primary" @click="handleAdd">新增项目</el-button>
            <el-button type="primary" @click="handleGetCorePackage">获取离线部署核心包</el-button>
            <el-button type="primary" @click="routerFileGenerate">路由文件转化打包</el-button>
            <!-- https://cdnforspeed.oss-cn-beijing.aliyuncs.com/install%20pack/visix/visix-0.0.2.exe -->
        </div>

        <el-table v-loading="showLoading" :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="order" label="Order" width="70"></el-table-column>
            <el-table-column prop="cName" label="CName" width="200"></el-table-column>
            <el-table-column prop="eName" label="EName" width="200"></el-table-column>
            <el-table-column prop="banner" label="Banner" width="150">
                <template #default="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.__banner" :zoom-rate="1.2"
                        :initial-index="4" fit="cover" />
                </template>
            </el-table-column>
            <el-table-column prop="service" label="Service" width="150"></el-table-column>
            <el-table-column prop="status" label="Status" :formatter="formatStatus" width="70"></el-table-column>
            <el-table-column prop="type" label="Type" :formatter="formatType" width="100"></el-table-column>
            <el-table-column prop="createdAt" label="Created At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column prop="updatedAt" label="Updated At" :formatter="formatDateTime"
                width="110"></el-table-column>
            <el-table-column label="Operate" width="120" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row)">查/改</el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="editDialogVisible" :title="editForm._title" width="60%"
            :before-close="handleEditDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" placeholder="" :disabled="true" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="editForm.order" placeholder="请输入排序编号" />
                </el-form-item>
                <el-form-item label="中文名称" prop="cName">
                    <el-input v-model="editForm.cName" placeholder="请输入中文名称" />
                </el-form-item>
                <el-form-item label="英文名称" prop="eName">
                    <el-input v-model="editForm.eName" placeholder="请输入英文名称" />
                </el-form-item>

                <el-form-item label="封面" prop="banner">
                    <el-upload ref="uploadRef" class="avatar-uploader" :auto-upload="false" :action="presignedUrl"
                        list-type="picture-card" :on-exceed="handleExceed" :limit=1 method="put"
                        :before-upload="beforeAvatarUpload" :on-change="uploadChange">
                        <img v-if="editForm.__banner" :src="editForm.__banner" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <!-- <el-input v-model="editForm.banner" placeholder="请输入封面" /> -->
                </el-form-item>
                <el-form-item label="项目服务前缀" prop="service">
                    <el-input v-model="editForm.service" placeholder="请输入项目服务前缀" />
                </el-form-item>
                <el-form-item label="项目状态" prop="status">
                    <el-radio-group v-model="editForm.status" class="ml-4">
                        <el-radio label="0" size="small">启用</el-radio>
                        <el-radio label="1" size="small">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                    <el-radio-group v-model="editForm.type" class="ml-4">
                        <el-radio label="0" size="small">PRIVATE</el-radio>
                        <el-radio label="1" size="small">PUBLIC</el-radio>
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
import { onMounted, ref, defineAsyncComponent } from "vue";
import {
    ProjectList,
    AddProject,
    DeleteProject,
    UpdateProject,
    TestDataBaseConn,
    UploadImage,
    downloadImage
} from "../api";
import { ElMessage, ElMessageBox, genFileId } from "element-plus";
import { formatDateTime, minioClient, ImageCache } from "../utils";
const imageCache = new ImageCache()


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

        const uploadRef = ref(); // 上传组件dom实例
        let presignedUrl = ref(""); // 带有时效性的上传url
        const fileList = ref([]);    // 上传图片

        // 编辑表单数据
        const editForm = ref({
            _title: "", // 标题
            _type: "", // 类型 编辑/查看/新增

            // ... 表单字段
            id: "",
            order: "",
            cName: "",
            eName: "",
            banner: "",
            __banner: "",// 仅用来展示
            service: "",
            status: "",
            type: "",
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

        const formatType = function (row, column) {
            const _map = {
                0: "PRIVATE",
                1: "PUBLIC",
            };
            return _map[row[column.property]];
        };

        /**
         * api接口请求
         */
        const projectList = (params) => {
            showLoading.value = true; // 显示加载中遮罩层
            if (!params) {
                params = {
                    page: currentPage.value,
                    take: pageSize.value,
                };
            }
            ProjectList(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("查询成功！");
                        res.data.data.forEach(i => {
                            if (imageCache.get(i.banner)) {
                                i.__banner = imageCache.get(i.banner)
                            } else {
                                downloadImage({
                                    bucketName: "visix",
                                    objectName: encodeURIComponent(i.banner),
                                }).then((res) => {
                                    imageCache.set(i.banner, res.data, 1000 * 60 * 20);
                                    i.__banner = imageCache.get(i.banner)
                                })
                            }
                        })
                        tableData.value = res.data.data; // 更新表格数据
                        total.value = res.data.meta.itemCount; // 更新总记录数
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const addProject = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            AddProject(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("新增成功！");
                        projectList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const deleteProject = (params = {}) => {
            showLoading.value = true; // 显示加载中遮罩层
            DeleteProject(params)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("删除成功！");
                        projectList();
                    }
                })
                .finally(() => {
                    showLoading.value = false; // 隐藏加载中遮罩层
                });
        };

        const updateProject = async (id = "", params = {}) => {
            showLoading.value = true;
            const { code } = await UpdateProject(id, params);
            if (code == 200) {
                ElMessage.success("更新成功！");
                projectList();
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
            projectList(); // 发起新的请求
        };

        const handleCurrentChange = (page) => {
            currentPage.value = page; // 更新当前页码
            projectList(); // 发起新的请求
        };

        const handleEdit = (rowData) => {
            editForm.value._title = "查看/修改 项目";
            editForm.value._type = "update";
            editForm.value.id = rowData.id;
            editForm.value.order = rowData.order;
            editForm.value.cName = rowData.cName;
            editForm.value.eName = rowData.eName;
            editForm.value.banner = rowData.banner;

            if (imageCache.get(rowData.banner)) {
                editForm.value.__banner = imageCache.get(rowData.banner)
            } else {
                downloadImage({
                    bucketName: "visix",
                    objectName: encodeURIComponent(rowData.banner),
                }).then((res) => {
                    imageCache.set(rowData.banner, res.data, 1000 * 60 * 20);
                    editForm.value.__banner = imageCache.get(rowData.banner)
                })
            }

            editForm.value.service = rowData.service;
            editForm.value.status = rowData.status + "";
            editForm.value.type = rowData.type + "";
            // 设置其他字段的初始值
            editDialogVisible.value = true;
        };

        const handleDelete = (rowData) => {
            ElMessageBox.confirm("Are you sure to delete the item ?").then(() => {
                deleteProject(rowData.id);
            }).catch(() => {

            });
        };

        const handleAdd = () => {
            editForm.value._title = "新增项目";
            editForm.value._type = "add";
            editDialogVisible.value = true;
        };

        const handleGetCorePackage = () => {
            ElMessage.success("使用 npm i dw_ly_woo - cli 安装脚手架");
        }

        const routerFileGenerate = () => {
            ElMessage.success("两个系统的路由结构正在耦合中，正在编写dsl生成器~~~");
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
            uploadRef.value.clearFiles();
        };

        const saveEditChanges = async () => {
            // 执行保存修改逻辑
            // ...
            editDialogVisible.value = false;
            editForm.value.order = Number(editForm.value.order);
            editForm.value.status = Number(editForm.value.status);
            editForm.value.type = Number(editForm.value.type);

            // 新增
            if (editForm.value._type == "add") {
                addProject(editForm.value);
            } else if (editForm.value._type == "update") {
                // 更新
                await updateProject(editForm.value.id, editForm.value);
            }
            console.log("save cf", editForm.value);
        };

        const handleEditConfirm = async () => {
            const isValid = validateEditForm(); // 验证编辑表单的数据
            if (isValid) {
                // 执行保存修改操作
                await saveEditChanges();
            }
            uploadRef.value.clearFiles();
        };

        const handleEditDialogClose = () => {
            resetEditForm(); // 重置编辑表单的数据和验证状态
            editDialogVisible.value = false;
        };

        const beforeAvatarUpload = (rawFile) => {
            if (rawFile.type !== 'image/jpeg') {
                return true
                // ElMessage.error('Avatar picture must be JPG format!')
                // return false
            } else if (rawFile.size / 1024 / 1024 > 2) {
                ElMessage.error('Avatar picture size can not exceed 2MB!')
                return false
            }
            return true
        };

        const uploadChange = async (rawFile) => {
            if (rawFile.status == 'ready') {

                // 生成预操作的url
                const { code, data } = await UploadImage({
                    bucketName: "visix",
                    prefix: "projectImage/",
                    fileName: rawFile.name,
                    expires: 1000 * 60
                });

                if (code !== 200) {
                    ElMessage.error("生成预上传链接失败");
                    return
                }



                // 使用自定义上传
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', data, true);
                xhr.setRequestHeader('Content-Type', rawFile.raw.type);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        ElMessage.success("上传成功！");
                        editForm.value.banner = "projectImage/" + rawFile.name;
                        editForm.value.__banner = ""
                    } else {
                        ElMessage.error("上传失败！" + xhr.statusText);
                    }
                };
                xhr.onerror = function () {
                    ElMessage.error("请求错误" + xhr.statusText);
                };
                xhr.send(rawFile.raw);
            }
        }


        /**
         * 只允许上传一张图片
         * @param files 
         */
        const handleExceed = (files) => {
            uploadRef.value.clearFiles()
            const file = files[0]
            file.uid = genFileId()
            uploadRef.value.handleStart(file)
        }


        /**
         * 生命周期
         */
        onMounted(() => {
            projectList();
        });

        return {
            tableData,
            currentPage,
            pageSize,
            total,
            showLoading,
            databaseType,
            selectDataBase,
            presignedUrl,
            fileList,
            editDialogVisible,
            editForm,
            editFormRules,
            editFormRef,
            uploadRef,

            handleCurrentChange,
            handleSizeChange,
            formatDateTime,
            formatStatus,
            formatType,
            handleEdit,
            handleDelete,
            handleAdd,
            handleGetCorePackage,
            routerFileGenerate,
            handleEditConfirm,
            handleEditDialogClose,

            uploadChange,
            handleExceed,
            beforeAvatarUpload

        };
    },
};
</script>

<style scoped>
:deep(.el-input__inner) {
    border: none !important;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
