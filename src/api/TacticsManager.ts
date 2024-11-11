import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查 列表数据
export const APIAccessControlList = (params: any) => {
    return request.get("/tactics", { params });
};

// 查 单条数据
export const TacticsDetail = (id: string) => {
    return request.get("/tactics/" + id);
};

// 查询角色关联的用户列表
export const GetAssociatedSubject = (data: any) => {
    return request.post("/tactics/getAssociatedSubject", { ...data });
};

// 增
export const AddAPIAccessControl = (data: any) => {
    return request.post("/tactics", { ...data });
};

// 将策略授权给主体
export const AuthorizedSubject = (data: any) => {
    return request.post("/tactics/authorizedSubject", { ...data });
};

// 更 
export const UpdateTactics = (data: any) => {
    return request.patch("/tactics",  { ...data });
};

// 更 重新排序与主体绑定的策略
export const SortTacticsSubject = (data: any) => {
    return request.patch("/tactics/sortTacticsSubject/",  { ...data });
};

// 删
export const DeleteAPIAccessControl = (id: string) => {
    return request.delete("/tactics/" + id);
};


// 删 删除主体绑定的策略信息
export const DeleteTacticsSubject = (id: string) => {
    return request.delete("/tactics/tacticsSubject/" + id);
};