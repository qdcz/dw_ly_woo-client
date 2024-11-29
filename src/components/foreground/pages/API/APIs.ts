import {
    APIModuleList,
    APIModuleInfo,
    GetAPIModuleHook,
    APIModuleAddHook,
    UpdateAPIModuleHook,
    APIModuleBindRequest,
    UpdateAPIModuleRequest,
    AddAPIModuleRequest,
    GetProjectInfo,
    ProjectList,
    APIExecutePreview,
    AddAPIModule,
    APIModuleBindindUnits
} from '@/api';


// 获取API模块列表
const _APIModuleList = (params) => {
    if (!params) {
        params = {
            page: 1,
            take: 10
        };
    }
    return APIModuleList(params)
        .then((res: any) => {
            if (res.code === 200) {
                return {
                    data: res.data.data,
                    total: res.data.meta.itemCount
                };
            }
        })
};

// 获取API详细信息
const _APIInfo = (params) => {
    return APIModuleInfo(params)
};


// 获取API前置hook
const _GetAPIModuleHook = (params) => {
    return GetAPIModuleHook(params)
};

// 新增API前后置hook
const _APIModuleAddHook = (params) => {
    return APIModuleAddHook(params)
};

// 更新API前后置hook
const _UpdateAPIModuleHook = (params) => {
    return UpdateAPIModuleHook(params.id, params.data)
};

// 查询API请求头
const _APIModuleBindRequest = (params) => {
    return new Promise((resolve) => {
        APIModuleBindRequest(params).then((res: any) => {
            if (res.code === 200 && res.data) {
                // 在返回数据的时候将数据转成前端params表单需要的格式
                resolve({
                    id: res.data.id,
                    headerSchema: JSON.parse(res.data.headerSchema).map(i => {
                        return [
                            {
                                type: "input",
                                placeholder: "请输入自定义字段-键名",
                                value: i.key,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "请输入自定义字段-键值",
                                value: i.value,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "字段说明",
                                value: i.info,
                                id: i.id,
                            },
                        ];
                    }),
                    bodySchema: JSON.parse(res.data.bodySchema).map(i => {
                        return [
                            {
                                type: "input",
                                placeholder: "请输入入参名",
                                value: i.key,
                                id: i.id,
                            },
                            {
                                type: "select",
                                placeholder: "请选择字段类型",
                                value: i.type,
                                id: i.id,
                            },
                            {
                                type: "checkbox",
                                placeholder: "是否必传",
                                value: i.required,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "请输入示例值",
                                value: i.value,
                                id: i.id,
                            },
                            {
                                type: "input",
                                placeholder: "请输入入参描述",
                                value: i.info,
                                id: i.id,
                            },
                        ];
                    }),
                    querySchema: []
                })
            } else {
                resolve({
                    id: null,
                    data: []
                })
            }
        })
    })
};

// 更新API请求头
const _UpdateAPIModuleRequest = (params) => {
    return UpdateAPIModuleRequest(params.APIRequestId, params.schemas)
};

// 新增API请求头
const _AddAPIModuleRequest = (params) => {
    return AddAPIModuleRequest({
        apiModuleId: params.apiModuleId,
        headerSchema: params.headerSchema,
        bodySchema: params.bodySchema,
        querySchema: params.querySchema,
    })
};

// 获取项目信息
const _GetProjectInfo = (projectId: string) => {
    return GetProjectInfo(projectId)
};

// 获取项目列表
const _ProjectList = (params) => {
    if (!params) {
        params = {
            page: 1,
            take: 10
        };
    }
    return ProjectList(params)
};

// 接口调用预览结果
const _APIExecutePreview = (eName: string, apiId: string, data: any, headers: any) => {
    return APIExecutePreview(eName, apiId, data, headers)
};

// 新增API
const _AddAPIModule = (params) => {
    return AddAPIModule(params)
};

// 获取接口绑定的数据单元列表
const _APIModuleBindindUnits = (params) => {
    return APIModuleBindindUnits(params)
};

export default {
    _APIModuleList,
    _APIInfo,
    _GetAPIModuleHook,
    _APIModuleAddHook,
    _UpdateAPIModuleHook,
    _APIModuleBindRequest,
    _UpdateAPIModuleRequest,
    _AddAPIModuleRequest,
    _GetProjectInfo,
    _ProjectList,
    _APIExecutePreview,
    _AddAPIModule,
    _APIModuleBindindUnits,
}
