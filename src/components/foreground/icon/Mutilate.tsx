import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MutilateIcon',
    props: {
        width: {
            type: String,
            default: '3.5'
        },
        height: {
            type: String,
            default: '3.5'
        }
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                    `icon cursor-pointer w-${props.width} h-${props.height}`,
                    "transition-all duration-300",
                    "text-gray-400 dark:text-gray-600",
                    "hover:text-black dark:hover:text-white hover:scale-110"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M3 6h18M3 12h18M3 18h18" />
                <circle cx="19" cy="6" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="18" r="1" fill="currentColor" />
            </svg>
        );
    }
});
