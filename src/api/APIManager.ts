import request from "../request";

/**
 *
 * 接口的any 部分直接见后端接口的api文档 前端不做重复声明
 */

// 查 获取系统内部接口
export const SystemAPIs = (params: any) => {
    return request.get("/apiModule/systemAPIs", { params });
};

// 查
export const APIModuleList = (params: any) => {
    return request.get("/apiModule", { params });
};

// 查-获取API详细信息
export const APIModuleInfo = (params: any) => {
    return request.get("/apiModule/" + params.id, { params });
};

// 增
export const AddAPIModule = (data: any) => {
    return request.post("/apiModule", { ...data });
};

// 删
export const DeleteAPIModule = (id: string) => {
    return request.delete("/apiModule/" + id);
};

// 更
export const UpdateAPIModule = (data: any) => {
    return request.patch("/apiModule", { ...data });
};

// 增-接口绑定数据单元
export const BoundDataUnit = (data: any) => {
    return request.post("/apiModule/boundDataUnit", { ...data });
};

// 查-接口下的所有数据单元
export const APIModuleBindindUnits = (params: any) => {
    return request.get("/apiModule/dataUnits", { params });
};

// 删-接口下的数据单元
export const DeleteAPIModuleDataUnits = (data: any) => {
    return request.delete("/apiModule/dataUnit", { data: data });
};

// 更-切换接口绑定数据单元状态
export const APIModuleDataUnitEnabled = (data: any) => {
    return request.patch("/apiModule/dataUnitEnabled", { ...data });
};

// 增-接口直接添加hook
export const APIModuleAddHook = (data: any) => {
    return request.post("/apiModule/addHook", { ...data });
};

// 查-查询当前接口绑定的hook
export const GetAPIModuleHook = (params: any) => {
    return request.get("/apiModule/getHook", { params });
};

// 更-修改hook内容 (修改当前接口绑定的HOOK)
export const UpdateAPIModuleHook = (id: string, data: any) => {
    return request.patch("/hook/" + id, { ...data });
};

// 更-修改接口状态
export const UpdateAPIModuleStep = (data: any) => {
    return request.patch("/apiModule/apiStep", { ...data });
};

// 接口调用预览结果
export const APIExecutePreview = (
    eName: string,
    apiId: string,
    data: any,
    headers: any
) => {
    return request.post(
        "/api/" + eName + "/" + apiId,
        { ...data },
        {
            headers,
        }
    );
};
