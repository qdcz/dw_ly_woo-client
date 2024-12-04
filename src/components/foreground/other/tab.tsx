import { defineComponent, PropType } from 'vue';
import { cn, } from '@/utils/index';


export default defineComponent({
    name: 'Tab',
    props: {
        options: {
            type: Array as PropType<{ id: string, name: string }[]>,
            default: () => []
        },
        active: {
            type: Object as PropType<{ value: string }>,
            required: true
        }
    },
    emits: ['active'],
    setup(props, { slots, emit }) {
        return () => (
            <div class={cn("w-full")}>
                <div class={cn("flex border-b border-gray-200 dark:border-gray-700")}>
                    {props.options.map((tab: { id: string, name: string }) => (
                        <div
                            class={cn(
                                "px-4 py-2 cursor-pointer",
                                "border-b-2",
                                props.active.value === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent hover:border-gray-300"
                            )}
                            onClick={() => emit('active', tab.id)}
                        >
                            {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                        </div>
                    ))}
                </div>
                {slots.default?.()}
            </div>
        );
    }
});
