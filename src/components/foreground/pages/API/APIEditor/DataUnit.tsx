import { defineComponent, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Sortable from 'sortablejs';

import { DATA_UNIT_TYPE } from "@/constants";
import { cn } from "@/utils/tailwindcss";
import APIs from "../APIs";

// components
import Switch from "@/components/foreground/form/Switch";
import Confirm from "@/components/foreground/dialog/confirm";
import BindDataUnitDialog from "./BindDataUnitDialog";

// icon
import DeleteIcon from "@/components/foreground/icon/Delete";
import RunIcon from '@/components/foreground/icon/Run';
import AddIcon from '@/components/foreground/icon/Add';
import MultipleIcon from '@/components/foreground/icon/Mutilate';



export default defineComponent({
    name: "DataUnit",
    components: {
        Switch,
        Confirm,
        BindDataUnitDialog,
        DeleteIcon,
        RunIcon,
        MultipleIcon,
        AddIcon
    },
    setup() {
        const route = useRoute();
        const dataUnitList = ref<Array<any>>([]);
        const dataUnitListSortable = ref<any>(null);
        const IsShowSortConfirmDialog = ref<boolean>(false);
        const CurrentComfirmType = ref<string>("");
        const ConfirmTitle = ref<string>("Tip");
        const ConfirmMessage = ref<string>("Are you sure you want to save the changes?");

        const IsShowBindDataUnitDialog = ref<boolean>(false);

        const formatterMStatus = (row: any) => row.m_status == 0 ? true : false; // 0:启用 1:禁用;

        /**
         * api request
         */
        const getAPIModuleBindindUnits = async () => {
            const res: any = await APIs._APIModuleBindindUnits({
                apiId: route.query.id
            });
            if (res.code === 200) {
                dataUnitList.value = res.data.dataUnits;
                dataUnitList.value.forEach((item: any) => item.m_status = formatterMStatus(item));
                console.log("dataUnitList", dataUnitList.value);
                nextTick(() => {
                    setTimeout(() => {
                        dataUnitListSortable.value = Sortable.create(document.getElementById('BindingDataUnitList'), {
                            animation: 250,
                            handle: '.DataUnitDrag',
                            onEnd: () => {
                                ConfirmMessage.value = "Are you sure you want to save the current order?";
                                ConfirmTitle.value = "Tip";
                                IsShowSortConfirmDialog.value = true;
                                CurrentComfirmType.value = "save";
                            }
                        });
                    }, 100);
                })
            }
        };


        /**
         * event handler
         */
        const updateMStatus = (data: any, value: boolean) => {
            dataUnitList.value.forEach((item: any) => {
                if (data.id === item.id) {
                    item.m_status = value
                }
            });
        };

        const saveDataUnitSort = () => {
            IsShowSortConfirmDialog.value = false;
            console.log("saveDataUnitSort");
        };

        const deleteDataUnit = (e: MouseEvent, data: any) => {
            IsShowSortConfirmDialog.value = true;
            ConfirmMessage.value = "Are you sure you want to delete the data unit binding to this API?";
            CurrentComfirmType.value = "delete";
            ConfirmTitle.value = "Warning";
            console.log("deleteDataUnit", data);
        };

        const handleConfirm = () => {
            const confirmType: string = CurrentComfirmType.value;
            if (confirmType === "delete") {
                console.log("handleConfirm");
            } else if (confirmType === "save") {
                saveDataUnitSort();
            }
        };


        onMounted(async () => {
            getAPIModuleBindindUnits();
        });

        return () => (
            <div>
                <Confirm title={ConfirmTitle.value} message={ConfirmMessage.value}
                    isOpen={IsShowSortConfirmDialog.value} onCancel={() => IsShowSortConfirmDialog.value = false} onConfirm={handleConfirm}
                />
                <BindDataUnitDialog title="Bind Data Unit" isOpen={IsShowBindDataUnitDialog.value} onClose={() => IsShowBindDataUnitDialog.value = false} />


                <div class={cn("text-lg font-bold", "dark:text-gray-300", "flex justify-between")}>
                    <span class={cn("text-base")}>Used to bind data units to interfaces</span>
                    <span><AddIcon width="6" height="6" hoverClass="hover:text-black dark:hover:text-blue-500 hover:scale-110" onClick={() => IsShowBindDataUnitDialog.value = true} /></span>
                </div>

                <div id="BindingDataUnitList" class={cn(
                    "select-none",
                    "mt-4",
                    "px-2",
                    "rounded-lg",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-center"
                )}>
                    {dataUnitList.value.map((item: any, index: number) => (
                        <div class={cn(
                            "flex flex-wrap items-center justify-between",
                        )}>
                            <div class={cn("w-1/8 p-2 flex items-center gap-2")}>
                                <MultipleIcon width="5" height="5" class="DataUnitDrag" />
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
                                <Switch modelValue={item.m_status} onUpdate:modelValue={updateMStatus.bind(null, item)} />
                            </div>
                            <div class={cn("w-1/8 p-2 flex items-center gap-2")}>
                                <RunIcon width="5" height="5" />
                                <DeleteIcon width="5" height="5" onClick={deleteDataUnit.bind(null, item)} />
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        )
    }
});
