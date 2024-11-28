import { cn } from '@/utils';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FoldIcon',
    setup() {
        return () => (
            <svg
                class={cn("w-6 h-6 dark:text-white")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
        );
    }
});