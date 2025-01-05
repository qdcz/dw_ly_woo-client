import { defineComponent, onMounted } from 'vue';
import { cn } from '@/utils/index';

export default defineComponent({
    name: "Home",
    components: {

    },
    setup() {
        onMounted(async () => {

        });
        return () => (
            <div class={cn("flex flex-col h-full dark:bg-gray-900 dark:text-gray-400")}>

                <div class={cn(
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 select-none"
                )}>
                    <div class={cn(
                        "group relative bg-white dark:bg-gray-800 p-3 rounded-lg",
                        "border border-gray-200 dark:border-gray-700",
                    )}>
                        <div class="flex flex-row justify-between cursor-pointer">
                            <h1 class="pb-1">服务器监控</h1>
                            <div>→</div>
                        </div>
                        <div class="text-sm px-1">
                            <div class="py-1">CPU使用率</div>
                            <div class="">磁盘使用量</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
