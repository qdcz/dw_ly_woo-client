import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DeleteIcon',
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
                t="1732871153452"
                class={cn(
                    `icon cursor-pointer w-${props.width} h-${props.height}`,
                    "transition-all duration-300", 
                    "text-gray-400 dark:text-gray-600",
                    "hover:text-green-600 dark:hover:text-green-600 hover:scale-110"
                )}
                viewBox="0 0 1024 1024"
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg"
                p-id="1473"
            >
                <path
                    d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840z"
                    fill="currentColor"
                    p-id="1474"
                ></path>
                <path
                    d="M512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144z m0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
                    fill="currentColor"
                    p-id="1475"
                ></path>
            </svg>
        );
    }
});