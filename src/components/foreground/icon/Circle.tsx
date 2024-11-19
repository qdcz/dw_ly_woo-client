import { defineComponent } from 'vue';
import { cn } from '@/utils/index';

export default defineComponent({
    name: "Circle",
    props: {
        width: {
            type: String,
            default: '24px'
        },
        height: {
            type: String,
            default: '24px'
        },
        class: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'plus', // 'plus' or 'minus'
            validator: (value: string) => ['plus', 'minus'].includes(value)
        }
    },
    setup(props) {
        return () => (
            <div
                class={cn(
                    "rounded-full border-2 relative",
                    "border-gray-400 dark:border-gray-600",
                    props.type === 'plus'
                        ? "hover:border-blue-500 dark:hover:border-blue-400"
                        : "hover:border-red-500 dark:hover:border-red-400",
                    "hover:bg-gray-100 dark:hover:bg-slate-800",
                    "hover:shadow-lg",
                    "transition-all duration-300",
                    props.class
                )}
                style={{
                    width: props.width,
                    height: props.height
                }}
            >
                <div class={cn(
                    "absolute inset-0 flex items-center justify-center translate-y-[-1px]",
                    "opacity-0 hover:opacity-100 transition-opacity duration-300",
                    props.type === 'plus'
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-red-500 dark:text-red-400",
                    "font-bold text-lg"
                )}>
                    {props.type === 'plus' ? '+' : '-'}
                </div>
            </div>
        );
    }
});
