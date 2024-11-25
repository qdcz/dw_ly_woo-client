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
    emits: ['dataChange', "update:modelValue", "enterPressed"],
    setup(props, { emit }) {
        const handleInput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            emit('update:modelValue', target.value);
            emit('dataChange', target.value);
        };

        const handleFocus = (event: FocusEvent) => {
            (event.target as HTMLElement).classList.add('shadow-ly_inputActive');
            if (document.documentElement.classList.contains('dark')) {
                (event.target as HTMLElement).classList.add('shadow-ly_inputActive__dark');
            }
        };

        const handleBlur = (event: FocusEvent) => {
            (event.target as HTMLElement).classList.remove('shadow-ly_inputActive');
            (event.target as HTMLElement).classList.remove('shadow-ly_inputActive__dark');
        };

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                (event.target as HTMLElement).blur();
                emit('enterPressed');
            }
        };

        return () => (
            <input
                type="text"
                value={props.modelValue}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeypress={handleKeyPress}
                placeholder={props.placeholder}
                disabled={props.disabled}
                class={cn(
                    "w-full h-full px-3 py-1.5 text-sm rounded",
                    "outline-none border-0 bg-transparent", // 消除默认边框和背景样式
                    "text-gray-800 dark:text-gray-200",
                    "transition duration-200 ease-in",
                    props.disabled && "opacity-50 cursor-not-allowed",
                    !props.disabled && "cursor-text",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                )}
            />
        );
    }
});
