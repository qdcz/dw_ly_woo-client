import { APIModuleList, APIModuleInfo, GetAPIModuleHook } from '@/api';


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

export default {
    _APIModuleList,
    _APIInfo,
    _GetAPIModuleHook
}
