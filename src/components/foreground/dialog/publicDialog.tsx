import { defineComponent, Transition } from 'vue';
import { cn } from '../../../utils/tailwindcss';
import Select from '../form/Select.tsx';

export default defineComponent({
    name: "PublicDialog",
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        onClose: {
            type: Function,
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        width: {
            type: String,
            default: '500px'
        },
        showClose: {
            type: Boolean,
            default: true
        },
        dropdownProps: {
            type: Object,
            default: () => ({
                modelValue: "1",
                options: [
                    {
                        value: '1',
                        label: '选项1',
                        disabled: false,
                        active: true
                    },
                    {
                        value: '2',
                        label: '选项2',
                        disabled: false,
                        active: false
                    }
                ],
                placeholder: '请选择',
                disabled: false
            })
        }
    },
    components: {
        Select
    },
    emits: ['selectChange'],
    setup(props, { emit, slots }) {

        return () => (
            <>
                {/* Backdrop */}
                <Transition
                    enterActiveClass="transition duration-200 ease-out"
                    enterFromClass="opacity-0"
                    enterToClass="opacity-100"
                    leaveActiveClass="transition duration-200 ease-in"
                    leaveFromClass="opacity-100"
                    leaveToClass="opacity-0"
                >
                    {props.isOpen && (
                        <div
                            class={cn("fixed inset-0 bg-black/30 dark:bg-black/50 z-[98]")}
                            onClick={() => props.onClose()}
                        />
                    )}
                </Transition>

                {/* Dialog */}
                <Transition
                    enterActiveClass="transition duration-200 ease-out"
                    enterFromClass="opacity-0 scale-75"
                    enterToClass="opacity-100 scale-100"
                    leaveActiveClass="transition duration-200 ease-in"
                    leaveFromClass="opacity-100 scale-100"
                    leaveToClass="opacity-0 scale-75"
                >
                    {props.isOpen && (
                        <div class={cn(
                            "fixed z-[99] flex items-center justify-center",
                            "left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        )}>
                            <div
                                style={{ width: props.width }}
                                class={cn("bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-wiggle")}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Dialog Header */}
                                <div class={cn("flex justify-between items-center px-6 py-4 border-b dark:border-gray-700")}>
                                    <h3 class={cn("text-lg font-medium text-gray-900 dark:text-gray-100")}>
                                        {props.title}
                                    </h3>
                                    <Select
                                        modelValue={props.dropdownProps.modelValue}
                                        options={props.dropdownProps.options}
                                        placeholder={props.dropdownProps.placeholder}
                                        disabled={props.dropdownProps.disabled}
                                        bordered={props.dropdownProps.bordered}
                                        onUpdate:modelValue={(v) => emit('selectChange', v)}
                                    >
                                    </Select>
                                    {props.showClose && (
                                        <button
                                            onClick={() => props.onClose()}
                                            class={cn(
                                                "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400",
                                                "hover:rotate-90 transition-all duration-300 focus:outline-none"
                                            )}
                                        >
                                            <svg class={cn("h-6 w-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Dialog Content */}
                                <div class={cn("px-6 py-4 text-gray-900 dark:text-gray-100")}>
                                    {slots.default?.()}
                                </div>

                                {/* Dialog Footer */}
                                {slots.footer && (
                                    <div class={cn("px-6 py-4 border-t dark:border-gray-700 flex justify-end space-x-3")}>
                                        {slots.footer()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Transition>
            </>
        );
    },
});
