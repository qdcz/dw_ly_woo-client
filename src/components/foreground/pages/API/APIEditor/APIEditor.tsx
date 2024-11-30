import { defineComponent, ref, Transition } from 'vue';
import { cn } from '@/utils/index';
import { useRouter } from 'vue-router';

import mainContent from './mainContent.tsx';

export default defineComponent({
    name: "APIEditor",
    components: {
        mainContent
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const router = useRouter();
        const rightSidebarOpen = ref(false);
        const rightSidebarLoading = ref(false);

        return () => (
            <div class={cn("relative")}>
                {/* Header with blur effect */}
                <div class={cn(
                    "sticky top-0 left-0 right-0 z-20",
                    "bg-white/80 dark:bg-gray-900/80",
                    "backdrop-blur-sm",
                    "px-4 py-2"
                )}>
                    <div class={cn("flex items-center text-sm")}>
                        <button
                            onClick={() => router.back()}
                            class={cn(
                                "text-gray-600 dark:text-gray-400",
                                "hover:text-blue-600 dark:hover:text-blue-400",
                                "transition-colors duration-200"
                            )}
                        >
                            <span class={cn("flex items-center")}>
                                <svg class={cn("w-4 h-4 mr-1")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to API List
                            </span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div class={cn("w-full h-full relative")}>
                    {!rightSidebarOpen.value && (
                        <button onClick={() => rightSidebarOpen.value = true} class={cn(
                            "absolute right-0 top-1/2 transform -translate-y-1/2",
                            "bg-white dark:bg-gray-800",
                            "border border-gray-200 dark:border-gray-700",
                            "rounded-full p-1",
                            "shadow-sm hover:shadow-md",
                            "transition-all duration-200",
                            "z-10"
                        )}>
                            <svg class={cn("w-4 h-4 text-gray-600 dark:text-gray-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div class={cn("p-6")}>
                        <mainContent />
                    </div>
                </div>

                {/* Right Sidebar */}
                <Transition
                    enterActiveClass="transition ease-out duration-300 transform"
                    enterFromClass="translate-x-full"
                    enterToClass="translate-x-0"
                    leaveActiveClass="transition ease-in duration-300 transform"
                    leaveFromClass="translate-x-0"
                    leaveToClass="translate-x-full"
                >
                    <div v-show={rightSidebarOpen.value} class={cn(
                        "fixed right-0 top-0 h-full w-80",
                        "border-l border-gray-200 dark:border-gray-700",
                        "bg-white dark:bg-gray-800",
                        "z-10"
                    )}>
                        <div class={cn("p-4")}>
                            <h2 class={cn("text-lg font-semibold text-gray-800 dark:text-gray-200")}>Details</h2>
                        </div>
                        <button onClick={() => rightSidebarOpen.value = false} class={cn(
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
                        {rightSidebarLoading.value && (
                            <div class={cn(
                                "absolute inset-0",
                                "bg-white/50 dark:bg-gray-800/50",
                                "flex items-center justify-center"
                            )}>
                                <div class={cn("animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500")}></div>
                            </div>
                        )}
                    </div>
                </Transition>
            </div>
        );
    }
});
