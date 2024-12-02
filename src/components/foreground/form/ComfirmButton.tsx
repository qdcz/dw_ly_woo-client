import { defineComponent } from 'vue';
import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: 'ComfirmButton',
    props: {
        text: {
            type: String,
            required: true,
        },
    },
    emits: ['click'],
    setup(props, { emit }) {
        return () => (
            <button
                type="button"
                class={cn(
                    "inline-flex justify-center rounded-md",
                    "border border-transparent",
                    "transition-all duration-300 ease-linear",
                    "bg-indigo-600 hover:bg-indigo-800",
                    "px-4 py-2 text-sm font-medium text-white",
                    "hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 dark:hover:ring-offset-gray-800"
                )}
                onClick={() => emit('click')}
            >
                {props.text}
            </button>
        );
    },
});
