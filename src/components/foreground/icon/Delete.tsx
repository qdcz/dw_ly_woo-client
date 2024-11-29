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
                    "hover:text-red-600 dark:hover:text-red-600 hover:scale-110"
                )}
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1473"
            >
                <path
                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72z"
                    fill="currentColor"
                    p-id="1474"
                ></path>
                <path
                    d="M864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                    p-id="1475"
                    fill="currentColor"
                ></path>
            </svg>
        );
    }
});