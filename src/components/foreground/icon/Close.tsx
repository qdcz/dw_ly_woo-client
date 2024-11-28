import { cn } from '@/utils';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CloseIcon',
    setup() {
        return () => (
            <svg
                class={cn("w-5 h-5 text-gray-600 dark:text-gray-400")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        );
    }
});