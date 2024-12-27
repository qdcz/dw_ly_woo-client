import { defineComponent, onMounted, ref } from 'vue';
import { cn, } from '@/utils/index';

import APIs from '@/components/foreground/pages/Project/APIs';


export default defineComponent({
    name: 'project-side-list',
    props: {

    },
    emits: ['active'],
    setup(props, { slots, emit }) {
        const listData = ref([]);
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);
        const currentSelect = ref("");

        const getProjectList = async () => {
            const res: any = await APIs._ProjectList({
                page: currentPage.value,
                take: pageSize.value
            })
            if (res) {
                listData.value = res.data;
                total.value = res.total;
            }
        }

        const handleClick = (id: string) => {
            currentSelect.value = id
        }

        onMounted(() => {
            getProjectList()
        })

        return () => (
            <div class={cn("flex flex-col")}>
                {
                    listData.value.map((item: any) => {
                        return (
                            <div class={cn("")} onClick={handleClick(item?.id)}>
                                <div class={cn(
                                    "flex flex-row justify-between text-gray-600 dark:text-gray-400 mt-1 text-sm cursor-pointer select-none",
                                    "transition-all duration-150 ease-linear",
                                    "hover:text-blue-400 hover:dark:text-blue-600",
                                    currentSelect.value === item?.id ? "bg-gray-800 rounded-md" : "",
                                    "px-2 py-1"
                                )}>
                                    <div class="flex flex-col mr-4">
                                        <span class="" data-id={item.id}>{item?.cName}</span>
                                        <span class="text-xs text-gray-600 dark:text-gray-600" data-id={item.id}>{item?.eName}</span>
                                    </div>
                                    <span class="p-2" data-id={item.id}>999</span>
                                </div>
                            </div>
                        )
                    })
                }
                {slots.default?.()}
            </div>
        );
    }
});
