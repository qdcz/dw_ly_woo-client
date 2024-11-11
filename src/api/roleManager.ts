import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const RoleList = (params: any) => {
    return request.get("/role", { params });
};

// 增
export const AddRole = (data: any) => {
    return request.post("/role", { ...data });
};

// 删
export const DeleteRole = (id: string) => {
    return request.delete("/role/" + id);
};

// 更
export const UpdateRole = (data: any) => {
    return request.patch("/role/", { ...data });
};
