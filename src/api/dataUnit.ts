import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */


/**
 * sql 
 */

// 查
export const SqlDataUnitList = (params: any) => {
    return request.get("/sqlDataUnit", { params });
};

// 增
export const AddSqlDataUnit = (data: any) => {
    return request.post("/sqlDataUnit", { ...data });
};

// 删
export const DeleteSqlDataUnit = (id: string) => {
    return request.delete("/sqlDataUnit/" + id);
};

// 更
export const UpdateSqlDataUnit = (id: string, data: any) => {
    return request.patch("/sqlDataUnit/" + id, { ...data });
};

// sql数据预览
export const SQLResult = (data: any) => {
    return request.post("/sqlDataUnit/SQLResult", { ...data });
};


/**
 * mock
 */
// 查
export const MockDataUnitList = (params: any) => {
    return request.get("/mockDataUnit", { params });
};

// 增
export const AddMockDataUnit = (data: any) => {
    return request.post("/mockDataUnit", { ...data });
};

// 删
export const DeleteMockDataUnit = (id: string) => {
    return request.delete("/mockDataUnit/" + id);
};

// 更
export const UpdateMockDataUnit = (id: string, data: any) => {
    return request.patch("/mockDataUnit/" + id, { ...data });
};
