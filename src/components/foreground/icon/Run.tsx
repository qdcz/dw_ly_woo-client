import { defineComponent } from "vue";
import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: "RunIcon",
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
                    "hover:text-green-400 dark:hover:text-green-600 hover:scale-110"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        );
    }
});
