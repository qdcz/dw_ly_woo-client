import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const APIModuleBindRequest = (data: any) => {
    return request.post("/apiModule/apiRequest", { ...data });
};

// 更
export const UpdateAPIModuleRequest = (id: string, data: any) => {
    return request.patch("/apiRequest/" + id, { ...data });
};

// 增
export const AddAPIModuleRequest = (data: any) => {
    return request.post("/apiRequest", { ...data });
};
