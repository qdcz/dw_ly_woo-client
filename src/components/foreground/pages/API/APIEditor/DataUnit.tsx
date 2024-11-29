import { computed, defineComponent, onMounted, ref } from "vue";
import { cn } from "@/utils/tailwindcss";
import APIs from "../APIs";
import { useRoute } from "vue-router";
import { DATA_UNIT_TYPE } from "@/constants";
import Switch from "@/components/foreground/form/Switch";
import DeleteIcon from "@/components/foreground/icon/Delete";
import RunIcon from '@/components/foreground/icon/Run';
import MultipleIcon from '@/components/foreground/icon/Mutilate';

export default defineComponent({
    name: "DataUnit",
    components: {
        Switch,
        DeleteIcon,
        RunIcon,
        MultipleIcon
    },
    setup() {
        const route = useRoute();
        const dataUnitList = ref<Array<any>>([]);
        const isDragging = ref(false);
        const dragStartIndex = ref(null);

        const formatterMStatus = (row: any) => row.m_status == 0 ? true : false; // 0:启用 1:禁用;

        onMounted(async () => {
            const res: any = await APIs._APIModuleBindindUnits({
                apiId: route.query.id
            });
            if (res.code === 200) {
                dataUnitList.value = res.data.dataUnits;
                dataUnitList.value.forEach((item: any) => item.m_status = formatterMStatus(item));
                console.log("dataUnitList", dataUnitList.value);
            }
        });

        const handleUpdateMStatus = (data: any, value: boolean) => {
            dataUnitList.value.forEach((item: any) => {
                if (data.id === item.id) {
                    item.m_status = value
                }
            });
        };

        const handleDragStart = (index: number) => {
            isDragging.value = true;
            dragStartIndex.value = index;
        };

        const handleDragOver = (index: number) => {
            if (isDragging.value) {
                const dragStart = dragStartIndex.value;
                const dragEnd = index;
                if (dragStart !== dragEnd) {
                    const item = dataUnitList.value[dragStart];
                    dataUnitList.value.splice(dragStart, 1);
                    dataUnitList.value.splice(dragEnd, 0, item);
                    // Add animation here
                    dataUnitList.value = dataUnitList.value.map((item, i) => {
                        if (i === dragStart) {
                            item.animation = 'move-up';
                        } else if (i === dragEnd) {
                            item.animation = 'move-down';
                        } else {
                            item.animation = '';
                        }
                        return item;
                    });
                }
            }
        };

        const handleDragEnd = () => {
            isDragging.value = false;
            dragStartIndex.value = null;
            // Remove animation here
            dataUnitList.value = dataUnitList.value.map(item => {
                item.animation = '';
                return item;
            });
        };

        return () => (
            <div>
                <div class={cn("text-lg font-bold", "dark:text-gray-300")}>
                    Used to bind data units to interfaces
                </div>


                <div class={cn(
                    "mt-4",
                    "px-2",
                    "rounded-lg",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-center"
                )}>
                    {dataUnitList.value.map((item: any, index: number) => (
                        <div class={cn(
                            "flex flex-wrap items-center justify-between",
                            item.animation // Apply animation here
                        )} draggable="true" ondragstart={() => handleDragStart(index)} ondragover={() => handleDragOver(index)} ondrop={() => handleDragEnd()}>
                            <div class={cn("w-1/8 p-2 flex items-center gap-2")}>
                                <MultipleIcon width="5" height="5" />
                            </div>
                            <div class={cn(
                                "w-1/8",
                                "rounded-full text-white text-xs px-2 py-1",
                                item.m_unitType === '1' && 'bg-yellow-500 dark:bg-yellow-600',
                                item.m_unitType === '2' && 'bg-blue-500 dark:bg-blue-600',
                                item.m_unitType === '3' && 'bg-orange-500 dark:bg-orange-600',
                            )}>{DATA_UNIT_TYPE[item.m_unitType]}</div>
                            <div class={cn("w-1/4 p-2", "dark:text-gray-300", "text-sm")}>{item.name}</div>
                            <div class={cn("w-1/4 p-2", "dark:text-gray-400", "text-xs")}>{item.description}</div>
                            <div class={cn("w-1/8 p-2")}>
                                <Switch modelValue={item.m_status} onUpdate:modelValue={handleUpdateMStatus.bind(null, item)} />
                            </div>
                            <div class={cn("w-1/8 p-2 flex items-center gap-2")}>
                                <RunIcon width="5" height="5" />
                                <DeleteIcon width="5" height="5" />
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        )
    }
});
