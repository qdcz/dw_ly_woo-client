import {
    APIModuleList,
    APIModuleInfo,
    GetAPIModuleHook,
    APIModuleAddHook,
    UpdateAPIModuleHook,
    APIModuleBindRequest,
    UpdateAPIModuleBindRequest,
    AddAPIModuleBindRequest
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
    return APIModuleBindRequest(params)
};

// 更新API请求头
const _UpdateAPIModuleBindRequest = (params) => {
    return UpdateAPIModuleBindRequest(params.id, params.data)
};

// 新增API请求头
const _AddAPIModuleBindRequest = (params) => {
    return AddAPIModuleBindRequest(params)
};

export default {
    _APIModuleList,
    _APIInfo,
    _GetAPIModuleHook,
    _APIModuleAddHook,
    _UpdateAPIModuleHook,
    _APIModuleBindRequest,
    _UpdateAPIModuleBindRequest,
    _AddAPIModuleBindRequest
}
