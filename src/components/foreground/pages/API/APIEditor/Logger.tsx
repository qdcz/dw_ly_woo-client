import { defineComponent, onMounted, PropType, ref, Transition } from 'vue';
import { cn, } from '@/utils/index';
import Tab from '@/components/foreground/other/tab.tsx';
import { ApiStore } from '@/store';
import ClearIcon from '@/components/foreground/icon/Clear.tsx';
import Input from '@/components/foreground/form/Input';


export default defineComponent({
    name: 'Logger',
    components: {
        Tab,
        Input,
        ClearIcon
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array as PropType<{ id: string, name: string }[]>,
            default: () => []
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const tabList = [
            { id: 'preprocessingLog', name: 'Preprocessing Log' },
            { id: 'postprocessingLog', name: 'Postprocessing Log' }
        ];
        const activeTab = ref('preprocessingLog');
        const apiStore = ApiStore();
        const searchValue = ref('');

        const renderLog = (logType: string) => {
            const logData = apiStore.GETLOGGERDATA()[logType];
            return (
                <div class={cn("p-1 overflow-y-scroll",)} style={{ height: "43rem" }}>
                    {
                        logData.map((item: any) => (
                            <div class={cn("mb-2")}>
                                <div class={cn("header flex gap-2 text-ellipsis bg-gray-100 dark:bg-gray-700 p-2 rounded-md")}>
                                    <div class={cn("")}>{item.type}</div>
                                    <div class={cn("text-ellipsis overflow-hidden whitespace-nowrap w-80")}>{item.id}</div>
                                </div>
                                <div class={cn("content p-2 rounded-md overflow-y-scroll")} style={{ maxHeight: "18rem" }}>
                                    <div class={cn("text-gray-800 dark:text-gray-200")}>
                                        {
                                            item.data.map((item: any) => (
                                                <div class={cn("mb-2")}>{JSON.stringify(item)}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            );
        };

        const renderLogHeader = (logType: string) => {
            const logData = apiStore.GETLOGGERDATA()[logType];
            return (
                <div class={cn("flex items-center justify-between gap-4 mb-2")}>
                    <span class={cn("text-gray-700 dark:text-gray-300 flex items-center text-nowrap")}>
                        total：{logData.length} count
                    </span>
                    <Input class={cn("flex-1")} bordered={true} modelValue={searchValue.value} placeholder="search [ id、name ]" />
                    <ClearIcon width="8" height="8"
                        class={cn("cursor-pointer border border-gray-200 dark:border-gray-600 rounded-lg p-1")}
                        colorClass="text-gray-400 dark:text-gray-300"
                        hoverClass="hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => apiStore.clearLoggerData(logType)}
                    />
                </div>
            );
        };

        return () => (
            <div class={cn("w-full")}>
                <Transition
                    enterActiveClass="transition ease-out duration-300 transform"
                    enterFromClass="translate-x-full"
                    enterToClass="translate-x-0"
                    leaveActiveClass="transition ease-in duration-300 transform"
                    leaveFromClass="translate-x-0"
                    leaveToClass="translate-x-full"
                >
                    <div v-show={props.open} class={cn(
                        "fixed right-0 top-0 h-full w-[800px]",
                        "border-l border-gray-200 dark:border-gray-700",
                        "bg-white dark:bg-gray-800",
                        "z-[100]",
                        "shadow-ly_mimicry dark:shadow-md"
                    )} >
                        <Tab class={cn("text-gray-800 dark:text-gray-200")} options={tabList} active={activeTab} onActive={(id: string) => activeTab.value = id}>
                            <div class={cn("p-4")}>
                                {
                                    activeTab.value === 'preprocessingLog' && <div>
                                        {renderLogHeader('preprocessingLog')}
                                        {renderLog('preprocessingLog')}
                                    </div>
                                }
                                {
                                    activeTab.value === 'postprocessingLog' && <div>
                                        {renderLogHeader('postprocessingLog')}
                                        {renderLog('postprocessingLog')}
                                    </div>
                                }
                            </div>
                        </Tab>
                        <button onClick={() => emit('close')} class={cn(
                            "absolute -left-3 top-1/2 transform -translate-y-1/2",
                            "bg-white dark:bg-gray-800",
                            "border border-gray-200 dark:border-gray-700",
                            "rounded-full p-1",
                            "shadow-sm hover:shadow-md",
                            "transition-all duration-200"
                        )}>
                            <svg class={cn("w-4 h-4 text-gray-600 dark:text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </Transition >
            </div >
        );
    }
});
