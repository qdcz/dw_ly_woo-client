import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ClearIcon',
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
            // <svg
            //     xmlns="http://www.w3.org/2000/svg"
            //     class={cn(
            //         `icon cursor-pointer w-${props.width} h-${props.height}`,
            //         "transition-all duration-300",
            //         props.colorClass,
            //         props.hoverClass
            //     )}
            //     viewBox="0 0 24 24"
            //     fill="currentColor"
            // >
            //     <path
            //         stroke-linecap="round"
            //         stroke-linejoin="round"
            //         stroke-width="2"
            //         d="M6 18L18 6M6 6l12 12"
            //         fill="currentColor"
            //     />
            // </svg>

            <svg
                // class={cn("w-5 h-5 text-gray-600 dark:text-gray-400")}

                class={cn(
                    `icon cursor-pointer w-${props.width} h-${props.height}`,
                    "transition-all duration-300",
                    props.colorClass,
                    props.hoverClass
                )}
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