import { defineComponent } from 'vue';
import { cn } from '@/utils/tailwindcss';
import AddIcon from '@/components/foreground/icon/Add';

export default defineComponent({
    name: "OperateList",
    components: {
        AddIcon
    },
    setup() {

        return () => (
            <div class={cn(
                "text-gray-600 dark:text-gray-400 mt-1 text-sm",
                "flex items-center space-x-2"
            )}>
                <div>
                    <AddIcon />
                </div>
                <div>222</div>
                <div>333</div>
            </div>
        );
    }
});
