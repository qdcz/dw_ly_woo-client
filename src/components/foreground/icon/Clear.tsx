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
                <path
                    d="M448 256h128V128H448v128z m192-128v128h192a64 64 0 0 1 64 64v128a64 64 0 0 1-54.976 63.36l44.544 311.616a64 64 0 0 1-63.36 73.024H201.792a64 64 0 0 1-63.36-73.024L183.04 511.36A64 64 0 0 1 128 448V320a64 64 0 0 1 64-64h192V128a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64z m136.512 320H832V320H192v128h584.512z m0 64H247.488l-45.696 320H320v-128h64v128h96v-128h64v128H640v-128h64v128h118.208l-45.696-320z"
                    fill="currentColor"
                    fill-opacity=".9"
                ></path>
            </svg>

        );
    }
});