import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LightIcon',
    props: {
        width: {
            type: String,
            default: '2'
        },
        height: {
            type: String,
            default: '2'
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
                    `icon cursor-pointer`,
                    "transition-all duration-300",
                    "text-black dark:text-white",
                    props.hoverClass
                )}
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 1024 1024"
                width={props.width + 'rem'}
                height={props.height + 'rem'}
            >
                <path fill="currentColor"
                    d="M544 832v96h-64v-96h64z m-280.896-116l45.248 45.28-67.904 67.84L195.2 783.936l67.904-67.904z m498.144-0.352l67.904 67.872-45.248 45.28-67.904-67.904 45.248-45.248zM512 256c141.44 0 256 114.56 256 256s-114.56 256-256 256-256-114.56-256-256 114.56-256 256-256z m0 64c-105.6 0-192 86.4-192 192s86.4 192 192 192 192-86.4 192-192-86.4-192-192-192zM192 480v64H96v-64h96z m736 0v64h-96v-64h96zM240.096 195.2l67.872 67.904L262.72 308.352 194.848 240.48 240.096 195.2z m543.424-0.32L828.8 240.064l-67.872 67.904-45.248-45.28 67.872-67.84zM544 96v96h-64V96h64z" ></path>
            </svg>
        );
    }
});
