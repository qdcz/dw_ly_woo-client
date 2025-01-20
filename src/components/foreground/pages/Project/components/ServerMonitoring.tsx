import { defineComponent, onMounted, ref } from 'vue';
import { cn } from '@/utils/index';

import Input from '@/components/foreground/form/Input.tsx'
import Button from '@/components/foreground/form/ComfirmButton'

export default defineComponent({
    name: "ServerMonitoring",
    components: { Input, Button },
    setup() {

        const projectName = ref("");

        onMounted(async () => {

        });

        return () => (
            <div class={cn("flex w-full")}>
                <div class="flex justify-between items-center w-full">
                    <div class="w-60">
                        <Input modelValue={projectName.value} bordered={true} placeholder="请输入您需要查询的项目名称"
                            onUpdate:modelValue={(newValue: any) => projectName.value = newValue}
                            onEnterPressed="{ }"></Input>
                    </div>
                    <div class="">
                        <Button class="" text="新建项目"></Button>
                    </div>
                </div>
            </div>
        );
    }
});
