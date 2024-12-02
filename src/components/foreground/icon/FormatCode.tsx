import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'FormatCodeIcon',
    props: {
        width: {
            type: String,
            default: '3.5'
        },
        height: {
            type: String,
            default: '3.5'
        },
        hoverClass: {
            type: String,
            default: 'hover:text-blue-500 dark:hover:text-blue-500 hover:scale-110'
        }
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class={cn(
                    `icon cursor-pointer w-${props.width} h-${props.height}`,
                    "transition-all duration-300",
                    "text-gray-400 dark:text-gray-400",
                    props.hoverClass
                )}
                viewBox="0 0 1024 1024"
            >
                <path stroke="currentColor" d="M1024 704v320H448v-320h576z m-403.456 57.792l-3.456 2.752-86.016 85.952a19.2 19.2 0 0 0-2.752 23.68l2.752 3.456 86.016 86.016a19.2 19.2 0 0 0 23.68 2.752l3.456-2.752 18.112-18.112a19.2 19.2 0 0 0 2.752-23.68l-2.752-3.456-54.336-54.4 54.336-54.208a19.2 19.2 0 0 0 2.752-23.68l-2.752-3.52-18.112-18.048a19.2 19.2 0 0 0-23.68-2.752z m228.736 2.624l-18.112 18.112a19.2 19.2 0 0 0 0 27.136l54.336 54.272-54.336 54.4a19.2 19.2 0 0 0 0 27.136l18.112 18.112a19.2 19.2 0 0 0 27.136 0l86.016-86.016a19.2 19.2 0 0 0 0-27.136l-86.016-86.016a19.2 19.2 0 0 0-27.136 0zM556.8 576a19.2 19.2 0 0 1 19.2 19.2v25.6a19.2 19.2 0 0 1-19.2 19.2H384v300.8a19.2 19.2 0 0 1-19.2 19.2h-25.6a19.2 19.2 0 0 1-19.2-19.2V640H256v300.8a19.2 19.2 0 0 1-19.2 19.2h-25.6a19.2 19.2 0 0 1-19.2-19.2V640H128v300.8a19.2 19.2 0 0 1-19.2 19.2H19.2a19.2 19.2 0 0 1-19.2-19.2V595.2A19.2 19.2 0 0 1 19.2 576h537.6zM364.8 32a19.2 19.2 0 0 1 19.2 19.2v290.112l154.24 137.152a19.2 19.2 0 0 1-12.8 33.536H50.56a19.2 19.2 0 0 1-12.8-33.536L192 341.312V51.2a19.2 19.2 0 0 1 19.2-19.2h153.6z" p-id="5098"></path>
            </svg>
        );
    }
});
