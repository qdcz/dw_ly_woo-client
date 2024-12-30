import {
    GetProjectBindApiList,
    GetProjectBindApiCount,
    ProjectList,
} from '@/api';


// 获取项目列表
const _ProjectList = (params) => {
    if (!params) {
        params = {
            page: 1,
            take: 10
        };
    }
    return ProjectList(params)
        .then((res: any) => {
            if (res.code === 200) {
                return {
                    data: res.data.data,
                    total: res.data.meta.itemCount
                };
            }
        })
};


// 获取项目的绑定接口列表
const _GetProjectBindApiList = (params) => {
    return GetProjectBindApiList(params)
        .then((res: any) => {
            if (res.code === 200) {
                return res.data;
            }
        })
};

// 获取项目的绑定接口数量
const _GetProjectBindApiCount = () => {
    return GetProjectBindApiCount()
        .then((res: any) => {
            if (res.code === 200) {
                return res.data;
            }
        })
};


export default {
    _ProjectList,
    _GetProjectBindApiList,
    _GetProjectBindApiCount,
}
