import { defineComponent, onMounted, provide, ref } from 'vue';
import { API_METHOD, API_STEP } from '@/constants';
import router from '@/router/index.ts';
import { cn } from '@/utils/index';
import APIs from './APIs';

import OperateList from './OperateList';
import CreateAPI from './CreateAPI';
import ProjectSideList from '@/components/foreground/business/project-side-list/project-side-list'
import { ApiStore } from '@/store/api/api';

interface IAPI {
    id: number;
    method: number;
    status: number;
    name: string;
    path: string;
    step: number;
}

export default defineComponent({
    name: "API",
    components: {
        OperateList,
        CreateAPI,
        ProjectSideList
    },
    setup() {
        const apiStore = ApiStore();


        const tableData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);

        const ProjectSideListRef = ref<any>(null);
        // const handleCurrentChange = (val: number) => {
        //     currentPage.value = val;
        // };

        // const handleSizeChange = (val: number) => {
        //     pageSize.value = val;
        //     currentPage.value = 1;
        //     APIs._APIModuleList({
        //         page: currentPage.value,
        //         take: pageSize.value
        //     });
        // };

        const isCreateAPI = ref(false);

        const trigger = (e: MouseEvent) => {
            // 获取最近的data-id元素
            const target = (e.target as HTMLElement).closest('[data-id]');
            if (target) {
                const id = target.getAttribute('data-id');
                if (id) {
                    router.push(`/APIEditor?id=${id}`);
                }
            }
        };

        const handleOperate = (type: string) => {
            if (type == "add") {
                isCreateAPI.value = true;
            }
        }

        provide('APIPage', {
            freshProjectList: () => {
                ProjectSideListRef.value.freshProjectList();
            },
            getCurrentSelectProjectId: () => apiStore.getCurrentSelectProjectId(),
            freshAPIList: (projectId: string) => {
                getAPIModuleList(projectId);
            }
        });

        const getAPIModuleList = async (projectId?: string) => {
            const params = {
                exact: {},
                page: currentPage.value,
                take: pageSize.value
            };
            if (projectId) {
                params.exact = `{"projectId":"${projectId}"}`;
            }
            const res = await APIs._APIModuleList(params);
            if (res) {
                tableData.value = res.data;
                total.value = res.total;
            }
        };

        const RightClick = (e: MouseEvent) => {
            e.preventDefault();
        }

        const projectToggle = (id: string) => {
            getAPIModuleList(id);

        }

        onMounted(async () => {
            // 由项目组件选中后触发
            // await getAPIModuleList();
        });

        return () => (
            <div class={cn("flex flex-col h-full dark:bg-gray-900")}>
                <CreateAPI onRefresh={(e) => getAPIModuleList.bind(null, e)} isOpen={isCreateAPI.value} onClose={() => { isCreateAPI.value = false }} />


                {/* Header section */}
                <div class={cn("mb-6")}>
                    <h1 class={cn("text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent")}>
                        API Explorer
                    </h1>
                    <div class={cn("flex items-center justify-between")}>
                        <p class={cn("text-gray-600 dark:text-gray-400 mt-1 text-sm")}>
                            Discover and manage your API endpoints
                        </p>
                        <OperateList onBtnClick={handleOperate} />
                    </div>
                </div>
                <div class="flex flex-row">
                    <ProjectSideList class="mr-6" onActive={projectToggle} ref={ProjectSideListRef}></ProjectSideList>
                    <div class="flex-1">
                        {/* Search & Filter Bar */}
                        {/* API Cards Grid */}
                        <div class={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 select-none")} onClick={trigger}>
                            {/* API Cards */}
                            {tableData.value?.map((api: IAPI) => (
                                <div data-id={api.id} onContextmenu={RightClick} class={cn(
                                    "group relative bg-white dark:bg-gray-800 p-3 rounded-lg",
                                    "border border-gray-200 dark:border-gray-700",
                                    "hover:border-blue-400 dark:hover:border-blue-500",
                                    "hover:shadow-lg hover:-translate-y-1",
                                    "transition-all duration-300 cursor-pointer"
                                )}>
                                    <div class={cn(
                                        "absolute inset-0 bg-gradient-to-r",
                                        "from-blue-50 to-cyan-50",
                                        "dark:from-blue-900/20 dark:to-cyan-900/20",
                                        "opacity-0 group-hover:opacity-100",
                                        "transition-all duration-300 rounded-lg"
                                    )}></div>
                                    <div class={cn("relative")}>
                                        <div class={cn("flex items-center justify-between mb-2")}>
                                            <span class={cn(
                                                "px-1.5 py-0.5 text-xs rounded-full",
                                                "transform group-hover:scale-105 transition-transform duration-300",
                                                {
                                                    'GET': "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
                                                    'POST': "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
                                                    'PUT': "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
                                                    'DELETE': "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                                                }[API_METHOD[api.method]]
                                            )}>
                                                {API_METHOD[api.method]}
                                            </span>
                                            <div class={cn("flex items-center space-x-1")}>
                                                <span class={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    api.status === 0 ? "bg-green-500" : "bg-red-500"
                                                )}></span>
                                                <span class={cn("text-xs text-gray-600 dark:text-gray-400")}>
                                                    {api.status === 0 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 class={cn(
                                            "text-sm font-semibold mb-1",
                                            "group-hover:text-blue-600",
                                            "dark:text-gray-200 dark:group-hover:text-blue-400",
                                            "transition-colors duration-300"
                                        )}>{api.name}</h3>
                                        <p class={cn("text-gray-600 dark:text-gray-400 text-xs mb-2 truncate")}>{api.path}</p>
                                        <div class={cn("flex items-center justify-between text-xs")}>
                                            <span class={cn("text-gray-500 dark:text-gray-400")}>{API_STEP[api.step]}</span>
                                            <span class={cn(
                                                "text-blue-600 dark:text-blue-400",
                                                "group-hover:translate-x-1",
                                                "transition-transform duration-300"
                                            )}>Details →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* <el-pagination
                    onCurrentChange={handleCurrentChange}
                    onSizeChange={handleSizeChange}
                    currentPage={currentPage.value}
                    pageSize={pageSize.value}
                    total={total.value}
                    pageSizes={[10, 20, 30, 40]}
                    layout="total, sizes, prev, pager, next, jumper"
                    style={{ marginTop: '8px' }}
                /> */}
                    </div>
                </div>


            </div>
        );
    }
});
