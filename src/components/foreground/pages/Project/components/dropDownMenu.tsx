import { defineComponent, onMounted } from 'vue';
import { cn } from '@/utils/index';
import DeleteICon from '@/components/foreground/icon/Delete';

export default defineComponent({
    name: "dropDownMenu",
    components: { DeleteICon },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            validator: (value: string) => ['preprocessing', 'postprocessing', 'excuteResult'].includes(value),
            default: ""
        }
    },
    setup(props, { emit }) {
        onMounted(async () => {
        });

        return () => (
            <div class={cn(
                "overflow-hidden box-content",
                "transition-all duration-300",
                props.isOpen ? "h-20" : "h-0",
            )}>
                <div class={cn(
                    "flex flex-col py-2 px-3 text-nowrap bg-gray-800 rounded-md text-md shadow-ly_mimicry",
                )}>
                    <div class="py-1 hover:text-blue-400">修改项目</div>
                    <div class="flex py-1 hover:text-blue-400">
                        <DeleteICon height="4" width="4" class="mr-2"></DeleteICon>
                        <span>删除项目</span>
                    </div>
                </div>
            </div>
        );
    }
});
