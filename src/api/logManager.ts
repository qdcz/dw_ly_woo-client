import request from "../request";

/**
 * 
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查询日志列表
export const LogList = (params: any) => {
    return request.get("/logger", { params });
};

// 删除单条日志
export const DeleteLogOne = (id: string) => {
    return request.delete("/logger/" + id);
};

// 删除整个存储库
export const RemoveLogTable = () => {
    return request.delete("/logger/delete/all");
};
