import { defineComponent } from 'vue';
import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: "Switch",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const handleClick = () => {
            if (!props.disabled) {
                emit('update:modelValue', !props.modelValue);
            }
        };

        return () => (
            <div
                onClick={handleClick}
                class={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    props.modelValue ? "bg-blue-400 dark:bg-white" : "bg-gray-200 dark:bg-gray-700",
                    props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                )}
            >
                <span
                    class={cn(
                        "inline-block h-4 w-4 transform rounded-full transition-transform",
                        "shadow-lg",
                        props.modelValue ? "translate-x-6" : "translate-x-1",
                        props.modelValue ? "bg-white dark:bg-black" : "bg-white dark:bg-black"
                    )}
                />
            </div>
        );
    }
});
