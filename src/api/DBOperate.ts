import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查
export const TableExist = (params: any) => {
    return request.get("/dbOperate/tableExist", { params });
};

// 增
export const CreateTable = (data: any) => {
    return request.post("/dbOperate/createTable", { ...data });
};
