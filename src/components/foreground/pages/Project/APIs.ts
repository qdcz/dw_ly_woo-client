import {
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


export default {
    _ProjectList,
}
