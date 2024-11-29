import { cn } from '@/utils/tailwindcss';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PreviewIcon',
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
            viewBox="0 0 24 24"
            fill="currentColor"
            class={cn(`w-${props.width} h-${props.height}`, "text-gray-900 dark:text-gray-600")}
        >
            <path d="M19 13H5v-2h14v2z" fill="currentColor"></path>
            <path d="M19 17H5v-2h14v2z" fill="currentColor"></path>
            <path d="M19 21H5v-2h14v2z" fill="currentColor"></path>
        </svg>
        );
    }
});