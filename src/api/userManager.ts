import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

export const login = (params: any) => {
    return request.post("/auth/login", params);
};

export const Register = (params: any) => {
    return request.post("/auth/register", params);
};

// 查 用户列表（不含详细信息）
export const UserList = (params: any) => {
    return request.get("/user", { params });
};

// 查 用户详细信息
export const UserInfo = (id: string) => {
    return request.get(`/user/${id}`);
};

// 查 用户下绑定的角色信息
export const UserRoleList = (id: string) => {
    return request.get(`/user/roleList/${id}`);
};

// 查 用户下绑定的策略信息(不含角色和组织包含的)
export const UserTacticsList = (id: string) => {
    return request.get(`/user/tacticsList/${id}`);
};

// 增、删、改 用户下绑定的角色信息
export const SetUserRole = (data: any) => {
    return request.post(`/user/setRole`, { ...data });
};

// 增
export const AddUser = (data: any) => {
    return request.post("/user", { ...data });
};

// 删
export const DeleteUser = (id: string) => {
    return request.delete("/user/" + id);
};

// 更
export const UpdateUser = (data: any) => {
    return request.patch("/user/", { ...data });
};
