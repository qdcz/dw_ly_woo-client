import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */


// 查
export const DataSourceList = (params: any) => {
    return request.get("/data-source", { params });
};

// 增
export const AddDataSource = (data: any) => {
    return request.post("/data-source", { ...data });
};

// 删
export const DeleteDataSource = (id: string) => {
    return request.delete("/data-source/" + id);
};

// 更
export const UpdateDataSource = (id: string, data: any) => {
    return request.patch("/data-source/" + id, { ...data });
};

// 测试数据库连接并查出所有库
export const TestDataBaseConn = (data: any) => {
    return request.post("/data-source/testConn", { ...data });
};
