import { defineComponent, onMounted, ref, Ref } from "vue";
import PublicDialog from "@/components/foreground/dialog/publicDialog";
import ComfirmButton from "@/components/foreground/form/ComfirmButton";
import Select from "@/components/foreground/form/Select";
import Table from "@/components/foreground/form/Table";
import AddIcon from "@/components/foreground/icon/Add.tsx";
import { cn } from "@/utils/tailwindcss";

import APIs from "../APIs";

export default defineComponent({
    name: "BindDataUnitDialog",
    components: {
        PublicDialog,
        ComfirmButton,
        Select,
        Table,
        AddIcon
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        }
    },
    emits: ["close", "addBindDataUnit"],
    setup(props, { emit }) {
        const dataUnitTypeOptions: { value: string, label: string }[] = [
            {
                value: "1",
                label: "SQL Unit"
            },
            {
                value: "2",
                label: "Mock Unit"
            }
        ]

        const DataUnitList: Ref<{ name: string, operation: string }[]> = ref([]);
        const dataUnitType: Ref<string> = ref("1");

        const DataUnitTypeChange = (v: string) => {
            dataUnitType.value = v;
            GetDataUnitList(v);
        }

        const GetDataUnitList = (type: string) => {
            APIs._GetDataUnitList(type, {
                page: 1,
                take: 999,
            }).then((res: any) => {
                if (res.code === 200) {
                    DataUnitList.value = res.data.data.map((item: any) => {
                        return {
                            Name: item.name,
                            Description: item.description,
                            // Operation: ["add", "edit", "delete"]
                            Operation: true,
                            ItemData: item
                        }
                    });
                }
            });
        }

        onMounted(() => {
            GetDataUnitList(dataUnitType.value);
        });


        return () => (
            <PublicDialog title={props.title} isOpen={props.isOpen} width="80%" onClose={() => {
                emit("close");
            }}>
                {{
                    default: () => (
                        <div class={cn("flex flex-row items-center justify-center")}>
                            <Select
                                class="self-start mr-2"
                                placeholder="Select Data Unit Type"
                                options={dataUnitTypeOptions}
                                modelValue={dataUnitType.value}
                                onUpdate:modelValue={DataUnitTypeChange}
                                style={{ width: "18%" }}
                            />
                            <Table width="100%" columns={[
                                {
                                    props: "Name",
                                    key: "name",
                                    isShow: true,
                                    width: "40%"
                                },
                                {
                                    props: "Description",
                                    key: "description",
                                    isShow: true,
                                    width: "40%"
                                },
                                {
                                    props: "Operation",
                                    key: "operation",
                                    isShow: true,
                                    width: "20%"
                                }
                            ]} data={DataUnitList.value}>
                                {{
                                    Operation: (row: any) => (
                                        <div class={cn("flex flex-row items-center justify-center")}>
                                            <AddIcon height="6" width="6" onClick={() => emit("addBindDataUnit", row)} />
                                        </div>
                                    )
                                }}
                            </Table>
                        </div>
                    ),
                    footer: () => (
                        <ComfirmButton text="Confirm" onClick={() => emit("close")} />
                    )
                }}
            </PublicDialog>
        );
    }
});