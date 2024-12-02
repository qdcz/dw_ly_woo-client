import { defineComponent, inject, nextTick, onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import Sortable from 'sortablejs';
// lib
import { ElMessage } from "element-plus";

import { DATA_UNIT_TYPE } from "@/constants";
import { cn } from "@/utils/tailwindcss";
import APIs from "../APIs";

// components
import Switch from "@/components/foreground/form/Switch";
import Confirm from "@/components/foreground/dialog/confirm";
import BindDataUnitDialog from "./BindDataUnitDialog";
import RunDataUnitDialog from "./RunDataUnitDialog";

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
        RunDataUnitDialog,
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

        // cache need delete data unit id
        let NeedToDeleteDataUnitId: string = "";
        let NeedToRunDataUnit: Object = {};

        const IsShowBindDataUnitDialog = ref<boolean>(false);
        const IsShowRunDataUnitDialog = ref<boolean>(false);


        // inject
        const loading = inject('APIEditorPage_EnableLoading') as any;

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
                nextTick(() => {
                    setTimeout(() => {
                        dataUnitListSortable.value = Sortable.create(document.getElementById('BindingDataUnitList'), {
                            animation: 250,
                            handle: '.DataUnitDrag',
                            onEnd: () => {
                                if (dataUnitListSortable.value.toArray().length > 1) {
                                    updateConfirmDialogStatus(true, "Tip", "Are you sure you want to save the current order?");
                                    CurrentComfirmType.value = "save";
                                }
                            }
                        });
                    }, 100);
                })
            }
        };

        const updateConfirmDialogStatus = (show: boolean, title: string, message: string) => {
            IsShowSortConfirmDialog.value = show;
            ConfirmTitle.value = title;
            ConfirmMessage.value = message;
        };


        /**
         * event handler
         */
        const updateMStatus = (data: any, value: boolean) => {
            dataUnitList.value.forEach((item: any) => {
                if (data.id === item.id) {
                    item.m_status = value;
                    loading.changeLoading(true);
                    APIs._APIModuleDataUnitEnabled({
                        m_id: data.m_id,
                        status: value ? 0 : 1
                    }).finally(() => {
                        ElMessage.success("Update success");
                        loading.changeLoading(false);
                    });
                }
            });
        };

        const saveDataUnitSort = () => {
            IsShowSortConfirmDialog.value = false;
            console.log("saveDataUnitSort");
        };

        const runDataUnit = (data: Ref<any>) => {
            IsShowRunDataUnitDialog.value = true;
            NeedToRunDataUnit = data;
        };

        const deleteDataUnit = (data: any) => {
            updateConfirmDialogStatus(true, "Warning", "Are you sure you want to delete the data unit binding to this API?");
            CurrentComfirmType.value = "delete";
            NeedToDeleteDataUnitId = data.m_id;
        };

        const handleConfirm = () => {
            const confirmType: string = CurrentComfirmType.value;
            if (confirmType === "delete") {
                APIs._DeleteAPIModuleDataUnits({
                    unitIds: NeedToDeleteDataUnitId
                }).then(() => {
                    ElMessage.success("Delete success");
                    IsShowSortConfirmDialog.value = false;
                    getAPIModuleBindindUnits();
                    NeedToDeleteDataUnitId = "";
                });
            } else if (confirmType === "save") {
                saveDataUnitSort();
            }
        };

        const addBindDataUnit = (row: any) => {
            // 1:sql data unit 2:mock data unit
            const unitType = row.ItemData.hasOwnProperty("sql") ? 1 : row.ItemData.hasOwnProperty("schema") ? 2 : 0;

            APIs._BoundDataUnit({
                apiId: route.query.id,
                unitId: row.ItemData.id,
                status: 1,
                unitType
            }).then((res: any) => {
                ElMessage.success(res.data);
                getAPIModuleBindindUnits();
            });
        };


        onMounted(async () => {
            getAPIModuleBindindUnits();
        });

        return () => (
            <div>
                <Confirm title={ConfirmTitle.value} message={ConfirmMessage.value}
                    isOpen={IsShowSortConfirmDialog.value} onCancel={() => IsShowSortConfirmDialog.value = false} onConfirm={handleConfirm}
                />
                <BindDataUnitDialog title="Bind Data Unit"
                    isOpen={IsShowBindDataUnitDialog.value}
                    onClose={() => IsShowBindDataUnitDialog.value = false}
                    onAddBindDataUnit={addBindDataUnit}
                />
                <RunDataUnitDialog title="Run Or Preview Data Unit"
                    dataUnit={NeedToRunDataUnit}
                    isOpen={IsShowRunDataUnitDialog.value}
                    onClose={() => IsShowRunDataUnitDialog.value = false}
                />


                <div class={cn("text-lg font-bold", "dark:text-gray-300", "flex justify-between")}>
                    <span class={cn("text-base")}>Used to bind data units to interfaces </span>
                    <div class={cn("flex flex-row items-center gap-1")}>
                        👉
                        <span><AddIcon width="6" height="6" hoverClass="hover:text-black dark:hover:text-blue-500 hover:scale-110" onClick={() => IsShowBindDataUnitDialog.value = true} /></span>
                    </div>
                </div>

                <div id="BindingDataUnitList" class={cn(
                    "select-none",
                    "mt-4",
                    "px-2",
                    "rounded-lg",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-center"
                )}>
                    {dataUnitList.value.map((item: any) => (
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
                                <RunIcon width="5" height="5" onClick={runDataUnit.bind(null, item)} />
                                <DeleteIcon width="5" height="5" onClick={deleteDataUnit.bind(null, item)} />
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        )
    }
});
