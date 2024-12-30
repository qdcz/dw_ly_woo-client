import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const ProjectList = (params: any) => {
    return request.get("/project", { params });
};

// 查 单个项目信息
export const GetProjectInfo = (projectId: string) => {
    return request.get("/project/" + projectId);
};

// 增
export const AddProject = (data: any) => {
    return request.post("/project", { ...data });
};

// 删
export const DeleteProject = (id: string) => {
    return request.delete("/project/" + id);
};

// 更
export const UpdateProject = (id: string, data: any) => {
    return request.patch("/project/" + id, { ...data });
};

// 上传文件（使用带有签名时效的的url）
export const UploadImage = (params: any) => {
    return request.get("/minio/presignedUrl", { params });
};

// 下载文件 获取带签名的url
export const downloadImage = (params: any) => {
    return request.post(`/minio/downloadUrl/${params.bucketName}/${params.objectName}`);
};

// 获取项目的绑定接口列表
export const GetProjectBindApiList = (params: any) => {
    return request.get("/project/apiList", { params });
};

// 获取项目的绑定接口列表
export const GetProjectBindApiCount = () => {
    return request.get("/project/apiCountAll", {});
};



