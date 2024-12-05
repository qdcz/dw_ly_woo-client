import { defineComponent, ref } from 'vue';
import { cn } from '@/utils/index';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

import mainContent from './mainContent.tsx';
import LoggerSideBar from './Logger.tsx';

import { ApiStore } from '@/store/api/api';

export default defineComponent({
    name: "APIEditor",
    components: {
        mainContent,
        LoggerSideBar
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const router = useRouter();
        const rightSidebarOpen = ref(false);
        const apiStore = ApiStore();

        onBeforeRouteLeave(() => {
            apiStore.clearLoggerData('all');
        });

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
                    <mainContent />
                </div>

                {/* Right Sidebar */}
                <LoggerSideBar open={rightSidebarOpen.value} onClose={() => rightSidebarOpen.value = false} />
            </div>
        );
    }
});
