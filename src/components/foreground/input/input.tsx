import { defineComponent } from 'vue';
import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: "Input",
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
            required: true
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        bordered: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const handleInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            emit('update:modelValue', target.value);
        };

        return () => (
            <input
                type="text"
                value={props.modelValue}
                onInput={handleInput}
                placeholder={props.placeholder}
                disabled={props.disabled}
                class={cn(
                    "w-full h-full px-3 py-1.5 text-sm outline-none",
                    "bg-transparent",
                    "text-gray-800 dark:text-gray-200",
                    props.disabled && "opacity-50 cursor-not-allowed",
                    !props.disabled && "cursor-text",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                )}
            />
        );
    }
});
