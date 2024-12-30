import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { cn } from '@/utils/index';

import APIs from '@/components/foreground/pages/Project/APIs';
import { ApiStore } from '@/store/api/api';


export default defineComponent({
    name: 'project-side-list',
    props: {

    },
    emits: ['active'],
    setup(props, { slots, emit, expose }) {
        const apiStore = ApiStore();
        const APIPageInjectData = inject('APIPage') as any;

        const listData = ref([]);
        const currentSelect = ref("");
        const clientHeight = ref(0);


        const getProjectList = async (inited: boolean = false) => {
            const res: any = await APIs._GetProjectBindApiCount()
            if (res) {
                listData.value = res;
                // 初始化默认选中一个
                if (inited && !currentSelect.value) currentSelect.value = res[0].id;
                // 只适用于API组件外部调用使用
                if (APIPageInjectData && APIPageInjectData.freshAPIList) {
                    APIPageInjectData.freshAPIList(currentSelect.value);
                }
            }
        }

        const handleClick = (id: string) => {
            currentSelect.value = id;
            apiStore.changeCurrentSelectProjectId(id);
            emit("active", currentSelect.value)
        }

        watch(
            () => apiStore.currentSelectProjectId,
            (value, oldValue) => {
                if (value) {
                    currentSelect.value = apiStore.getCurrentSelectProjectId();
                }
            }, { immediate: true }
        )

        expose({
            freshProjectList: async () => {
                currentSelect.value = apiStore.getCurrentSelectProjectId() || "";
                await getProjectList();
            }
        });

        onMounted(() => {
            currentSelect.value = apiStore.getCurrentSelectProjectId() || "";
            getProjectList(true);
            clientHeight.value = window.innerHeight;
        })

        return () => (
            <div class={cn("flex flex-col overflow-scroll no-scrollbar py-2")} style={{
                maxHeight: clientHeight.value - 180 + "px"
            }}>
                {
                    listData.value.map((item: any) => {
                        return (
                            <div class={cn("")} onClick={handleClick.bind(null, item?.id)}>
                                <div class={cn(
                                    "flex flex-row justify-between text-gray-600 dark:text-gray-400 mt-1 text-sm cursor-pointer select-none",
                                    "transition-all duration-150 ease-linear",
                                    "hover:text-blue-400 hover:dark:text-blue-600",
                                    currentSelect.value === item?.id ? "dark:bg-gray-800 bg-gray-100 shadow-inner rounded-md" : "",
                                    currentSelect.value === item?.id ? "text-blue-400 dark:text-blue-600" : "",
                                    "px-2 py-1"
                                )}>
                                    <div class="flex flex-col mr-4">
                                        <span class="" data-id={item.id}>{item?.cName}</span>
                                        <span class="text-xs text-gray-600 dark:text-gray-600" data-id={item.id}>{item?.eName}</span>
                                    </div>
                                    <span class="p-2" data-id={item.id}>{item?.apiCount}</span>
                                </div>
                            </div>
                        )
                    })
                }
                {slots.default?.()}
            </div>
        );
    },
});
