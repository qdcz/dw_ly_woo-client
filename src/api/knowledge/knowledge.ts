import request from "../../request/dwly";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */
// 查
export const AccessLogList = (params: any) => {
    return request.get("/knowledge/logs/accessLog", { params });
};
