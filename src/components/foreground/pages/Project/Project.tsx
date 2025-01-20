import { defineComponent, onMounted } from 'vue';
import { cn } from '@/utils/index';

import ProjectList from './components/project.tsx'

export default defineComponent({
    name: "Project",
    components: {
        ProjectList
    },
    setup() {

        onMounted(async () => {
            // 由项目组件选中后触发
            // await getAPIModuleList();
        });

        return () => (
            <div class={cn("h-full dark:bg-gray-900")}>
                <ProjectList />
            </div>
        );
    }
});
