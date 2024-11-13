import { defineComponent, Transition } from 'vue';
import { cn } from '@/utils/index';

export default defineComponent({
    name: "Confirm",
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            default: 'Confirm'
        },
        message: {
            type: String,
            required: true
        },
        onConfirm: {
            type: Function,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        return () => (
            <>
                {/* Backdrop - 只在 isOpen 时渲染 */}
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
                            onClick={(e: MouseEvent) => props.onCancel(e)}
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
                        <div class={cn("fixed inset-0 z-[99] flex items-center justify-center")}>
                            <div
                                class={cn(
                                    "bg-white dark:bg-gray-800",
                                    "rounded-lg shadow-xl",
                                    "w-[90%] max-w-md p-6",
                                    "animate-wiggle"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 class={cn("text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4")}>
                                    {props.title}
                                </h3>
                                <div class={cn("mt-2")}>
                                    <p class={cn("text-sm text-gray-500 dark:text-gray-400")}>
                                        {props.message}
                                    </p>
                                </div>
                                <div class={cn("mt-6 flex justify-end space-x-3")}>
                                    <button
                                        type="button"
                                        class={cn(
                                            "inline-flex justify-center rounded-md",
                                            "border border-gray-300 dark:border-gray-600",
                                            "bg-white dark:bg-gray-700",
                                            "px-4 py-2 text-sm font-medium",
                                            "text-gray-700 dark:text-gray-200",
                                            "hover:bg-gray-50 dark:hover:bg-gray-600",
                                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                        )}
                                        onClick={(e: MouseEvent) => props.onCancel(e)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        class={cn(
                                            "inline-flex justify-center rounded-md",
                                            "border border-transparent",
                                            "bg-indigo-600 hover:bg-indigo-700",
                                            "px-4 py-2 text-sm font-medium text-white",
                                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                        )}
                                        onClick={(e: MouseEvent) => props.onConfirm(e)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Transition>
            </>
        );
    }
});
