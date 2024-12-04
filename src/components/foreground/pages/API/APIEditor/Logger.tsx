import { defineComponent, ref, Transition } from 'vue';
import { cn, } from '@/utils/index';
import Tab from '@/components/foreground/other/tab.tsx';


export default defineComponent({
    name: 'Logger',
    components: {
        Tab
    },
    props: {
        open: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const tabList = [
            { id: 'preprocessingLog', name: 'Preprocessing Log' },
            { id: 'postprocessingLog', name: 'Postprocessing Log' }
        ];
        const activeTab = ref('preprocessingLog');

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
                        "fixed right-0 top-0 h-full w-1/3",
                        "border-l border-gray-200 dark:border-gray-700",
                        "bg-white dark:bg-gray-800",
                        "z-[100]",
                        "shadow-ly_mimicry dark:shadow-md"
                    )} >
                        {/* <h2 class={cn("text-lg font-semibold text-gray-800 dark:text-gray-200")}>API Log</h2> */}
                        <Tab class={cn("text-gray-800 dark:text-gray-200")} options={tabList} active={activeTab} onActive={(id: string) => activeTab.value = id}>
                            <div class={cn("p-4")}>
                                {
                                    activeTab.value === 'preprocessingLog' && <div>Preprocessing Log</div>
                                }
                                {
                                    activeTab.value === 'postprocessingLog' && <div>Postprocessing Log</div>
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
                </Transition>
            </div>
        );
    }
});
