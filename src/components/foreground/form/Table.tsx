import { defineComponent, PropType } from 'vue';
import { cn } from '@/utils/tailwindcss';

export default defineComponent({
    name: 'Table',
    props: {
        columns: {
            type: Array as PropType<{ props: string, isShow: boolean, width: string }[]>,
            required: true,
        },
        data: {
            type: Array as PropType<{ [key: string]: string }[]>,
            required: true,
        },
        width: {
            type: String,
            default: "100%"
        }
    },
    emits: ['click'],
    setup(props, { slots, emit }) {

        return () => (
            <div class={cn("p-2 pb-0 rounded-md border border-gray-300 dark:border-gray-600 max-h-[500px] overflow-y-auto no-scrollbar")} style={{ width: props.width }}>
                {/* header */}
                <div class={cn("flex flex-row items-center text-md font-medium py-1 border-b border-gray-300 dark:border-gray-600")}>
                    {props.columns.map((column: { props: string, isShow: boolean, width: string }) => (
                        column.isShow && (
                            <span class={cn("text-center")} style={{ width: column.width }}>{column.props}</span>
                        )
                    ))}
                </div>

                {/* body */}
                {props.data.map((row: { [key: string]: string }) => (
                    <div class={cn("flex flex-row items-center py-2 text-sm font-medium")}>
                        {props.columns.map((column: { props: string, width: string }) => {
                            return (
                                <div class="text-center" style={{ width: column.width }}>
                                    {column.props !== "Operation" && <span>{row[column.props]}</span>}
                                    {column.props === "Operation" && (
                                        <div class={cn("flex flex-row items-center justify-center")}>
                                            {slots.Operation && slots.Operation.call(null, row)}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        );
    },
});
