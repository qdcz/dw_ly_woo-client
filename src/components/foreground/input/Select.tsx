import { computed, defineComponent, ref, Transition, onMounted, onUnmounted } from 'vue';
import { cn } from '../../../utils/tailwindcss';

export default defineComponent({
    name: "Select",
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
            required: true
        },
        options: {
            type: Array<{ value: any, label: string }>,
            required: true,
            default: () => []
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        bordered: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const isOpen = ref(false);
        const selectRef = ref<HTMLDivElement | null>(null);

        const selectedLabel = computed(() => {
            const selected = props.options.find(opt => opt.value == props.modelValue);
            return selected ? selected.label : props.placeholder;
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
                isOpen.value = false;
            }
        };

        onMounted(() => {
            document.body.addEventListener('mousedown', handleClickOutside);
        });

        onUnmounted(() => {
            document.body.removeEventListener('mousedown', handleClickOutside);
        });

        const toggleDropdown = () => {
            if (!props.disabled) {
                isOpen.value = !isOpen.value;
            }
        };

        const selectOption = (value: any) => {
            emit('update:modelValue', value);
            isOpen.value = false;
        };

        return () => (
            <div ref={selectRef} class="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    class={cn(
                        "min-w-28 w-full h-full px-3 py-1.5 text-left rounded text-sm",
                        "bg-white dark:bg-transparent",
                        props.bordered && "border border-gray-200 dark:border-gray-700",
                        "text-gray-800 dark:text-gray-200",
                        "hover:bg-gray-50 dark:hover:bg-gray-750",
                        props.bordered && "focus:outline-none focus:ring-1 focus:ring-blue-400",
                        props.disabled && "opacity-50 cursor-not-allowed",
                        !props.disabled && "cursor-pointer",
                        "flex items-center justify-between"
                    )}
                >
                    <span class={cn(
                        "block truncate",
                        !props.modelValue && "text-gray-400 dark:text-gray-500"
                    )}>
                        {selectedLabel.value}
                    </span>
                    <svg
                        class={cn(
                            "h-4 w-4 ml-2 transition-transform duration-300",
                            isOpen.value && "transform rotate-180"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>


                {/** drop down list */}
                <Transition
                    enterActiveClass="transition duration-200 ease-out"
                    enterFromClass="transform opacity-0 -translate-y-2"
                    enterToClass="transform opacity-100 translate-y-0"
                    leaveActiveClass="transition duration-150 ease-in"
                    leaveFromClass="transform opacity-100 translate-y-0"
                    leaveToClass="transform opacity-0 -translate-y-2"
                >
                    {isOpen.value && (
                        <div class={cn(
                            "absolute z-10 w-full mt-1 rounded shadow-sm",
                            "bg-white dark:bg-gray-800",
                            "border border-gray-200 dark:border-gray-700",
                            "text-sm",
                            "w-28 w-full"
                        )}>
                            {props.options.map((option) => (
                                <div
                                    key={option.value}
                                    class={cn(
                                        "px-3 py-1.5 cursor-pointer",
                                        "text-gray-800 dark:text-gray-200",
                                        "transition duration-200 ease-out",
                                        "hover:bg-blue-50 hover:text-blue-600",
                                        "dark:hover:bg-gray-900 dark:hover:text-gray-750 dark:hover:font-semibold"
                                    )}
                                    onClick={() => selectOption(option.value)}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </Transition>
            </div>
        );
    }
});
