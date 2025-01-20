import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ExpansionIcon',
    props: {
        width: {
            type: String,
            default: '3.5'
        },
        height: {
            type: String,
            default: '3.5'
        },
        colorClass: {
            type: String,
            default: 'text-gray-400 dark:text-gray-600'
        },
        hoverClass: {
            type: String,
            default: 'hover:text-black dark:hover:text-white hover:scale-110'
        }
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                    `icon cursor-pointer w-${props.width} h-${props.height}`,
                    "transition-all duration-300",
                    props.colorClass,
                    props.hoverClass
                )}
                viewBox="0 0 1024 1024"
                fill="currentColor"
            >
                <path d="M69.3 512m-68.8 0a68.8 68.8 0 1 0 137.6 0 68.8 68.8 0 1 0-137.6 0Z" p-id="4278"></path>
                <path d="M505.7 512m-68.8 0a68.8 68.8 0 1 0 137.6 0 68.8 68.8 0 1 0-137.6 0Z" p-id="4279"></path>
                <path d="M954.7 512m-68.8 0a68.8 68.8 0 1 0 137.6 0 68.8 68.8 0 1 0-137.6 0Z" p-id="4280"></path>
            </svg>

        );
    }
});