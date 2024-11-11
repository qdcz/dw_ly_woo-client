import { defineComponent, ref, Transition } from 'vue';
import { cn } from '@/utils/index';

import mainContent from './mainContent.tsx';

export default defineComponent({
    name: "APIEditor",
    components: {
        mainContent
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const leftSidebarOpen = ref(false);
        const rightSidebarOpen = ref(false);
        const leftSidebarLoading = ref(false);
        const rightSidebarLoading = ref(false);

        return () => (
            <div class={cn(
                "relative h-screen",
            )}>
                {/* Left Sidebar */}
                <Transition
                    enterActiveClass="transition ease-out duration-300 transform"
                    enterFromClass="-translate-x-full"
                    enterToClass="translate-x-0"
                    leaveActiveClass="transition ease-in duration-300 transform"
                    leaveFromClass="translate-x-0"
                    leaveToClass="-translate-x-full"
                >
                    <div v-show={leftSidebarOpen.value} class="absolute left-0 top-0 h-full w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                        <div class="p-4">
                            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
                        </div>
                        <button onClick={() => leftSidebarOpen.value = false} class="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200">
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                        {leftSidebarLoading.value && (
                            <div class="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>
                </Transition>

                {/* Main Content */}
                <div class="w-full h-full relative">
                    {!leftSidebarOpen.value && (
                        <button onClick={() => leftSidebarOpen.value = true} class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200 z-10">
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                    {!rightSidebarOpen.value && (
                        <button onClick={() => rightSidebarOpen.value = true} class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200 z-10">
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div class="p-6">
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
                    <div v-show={rightSidebarOpen.value} class="fixed right-0 top-0 h-full w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                        <div class="p-4">
                            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Details</h2>
                        </div>
                        <button onClick={() => rightSidebarOpen.value = false} class="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm hover:shadow-md transition-all duration-200">
                            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                        {rightSidebarLoading.value && (
                            <div class="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </div>
                </Transition>
            </div>
        );
    }
});
