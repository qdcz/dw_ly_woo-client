import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const FunctionList = (params: any) => {
    return request.get("/function", { params });
};

// 增
export const AddFunction = (data: any) => {
    return request.post("/function", { ...data });
};

// 删
export const DeleteFunction = (id: string) => {
    return request.delete("/function/" + id, {});
};

// 改
export const UpdateFunction = (id: string, data: any) => {
    return request.patch("/function/" + id, { ...data });
};
