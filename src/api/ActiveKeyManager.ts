import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const ActiveKeyList = (params: any) => {
    return request.get("/active-key", { params });
};

// 增
export const AddActiveKey = (data: any) => {
    return request.post("/active-key", { ...data });
};

// 删
export const DeleteActiveKey = (id: string) => {
    return request.delete("/active-key/" + id, {});
};

// 改
export const UpdateActiveKey = (id: string, data: any) => {
    return request.patch("/active-key/" + id, { ...data });
};
