import { defineComponent, ref } from 'vue';
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
        },
        type: {
            type: String,
            default: 'input'
        },
        // 表单验证错误信息
        checkError: {
            type: String,
            default: ''
        }
    },
    emits: ['dataChange', "update:modelValue", "enterPressed"],
    setup(props, { emit }) {

        const IsShowCheckError = ref(false);

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
            <>
                {props.type === 'input' ? (
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
                            props.bordered && "border border-gray-200 dark:border-gray-700",
                            "transition duration-200 ease-in",
                            props.disabled && "opacity-50 cursor-not-allowed",
                            !props.disabled && "cursor-text",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        )}
                    />
                ) : (
                    <textarea
                        class={cn(
                            "w-full h-full px-3 py-1.5 text-sm rounded",
                            "outline-none border-0 bg-transparent", // 消除默认边框和背景样式
                            "text-gray-800 dark:text-gray-200",
                            props.bordered && "border border-gray-200 dark:border-gray-700",
                            "transition duration-200 ease-in",
                            props.disabled && "opacity-50 cursor-not-allowed",
                            !props.disabled && "cursor-text",
                            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        )}
                        value={props.modelValue}
                        onInput={handleInput}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeypress={handleKeyPress}
                        placeholder={props.placeholder}
                        disabled={props.disabled}
                    />
                )}

                {/* field check error */}
                <div class={cn("text-red-500 text-xs transition-all duration-300 ease-linear", IsShowCheckError.value && "opacity-100")}>
                    {props.checkError}
                </div>
            </>


        );
    }
});
