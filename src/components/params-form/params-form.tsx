import { defineComponent } from "vue";
import { deepClone, generateString } from "@/utils/index";
import { Plus, Minus } from '@element-plus/icons-vue';
import Circle from '@/components/foreground/icon/Circle.tsx';
import { cn } from '@/utils/index';
import Select from '@/components/foreground/input/Select.tsx';
import Input from '@/components/foreground/input/input.tsx';

interface headerData {
    name: string;
    width: string;
}

interface ColumnData {
    type: string;
    placeholder?: string;
    value: any;
    options?: Array<{
        key: string;
        label: string;
        value: any;
    }>;
    id?: string;
}

export const requestFormProps = {
    title: {
        type: String,
        default: "这是一个标题",
    },
    headerData: {
        type: Array as () => headerData[],
        default: () => [
            { name: "参数名", width: "20" },
            { name: "类型", width: "20" },
            { name: "必填", width: "10" },
            { name: "示例值", width: "20" },
            { name: "说明", width: "20" },
        ],
    },
    bodyData: {
        type: Array as () => ColumnData[][],
        default: () => [
            [
                { type: "input", placeholder: "添加参数", value: "age" },
                { type: "select", placeholder: "字段类型", value: "1" },
                { type: "checkbox", value: true },
                { type: "input", placeholder: "示例值", value: "99" },
                {
                    type: "input",
                    placeholder: "说明",
                    value: "这是一个年龄字段",
                },
            ],
            [
                { type: "input", placeholder: "添加参数", value: "age" },
                { type: "select", placeholder: "字段类型", value: "2" },
                { type: "checkbox", value: true },
                { type: "input", placeholder: "示例值", value: "99" },
                {
                    type: "input",
                    placeholder: "说明",
                    value: "这是一个年龄字段",
                },
            ],
        ],
    },
};

export default defineComponent({
    name: "ParamsForm",
    emits: [
        "update:modelValue",
        "formDataChange",
        "headerItemAdd",
        "itemAdd",
        "itemDelete",
    ],
    components: {
        Plus,
        Minus,
        Circle,
        Select,
        Input
    },
    props: requestFormProps,
    setup(props, { emit }) {
        const emitFormDataChange = () => {
            emit("formDataChange", props.bodyData);
        };

        const requestForm_selectChange = emitFormDataChange;
        const requestForm_inputChange = emitFormDataChange;
        const requestForm_checkChange = emitFormDataChange;

        const header_itemAdd = () => {
            const id = generateString(36);
            emit("headerItemAdd", [
                new Array(props.headerData.length).fill(0).map(() => ({ id }))
            ]);
        };

        const itemAdd = function (this: ColumnData[]) {
            const newData = deepClone(this).map((item: ColumnData) => ({
                ...item,
                id: generateString(36)
            }));
            emit("itemAdd", newData);
        };

        const itemDelete = function (this: ColumnData[]) {
            emit("itemDelete", deepClone(this));
        };

        const renderFormByType = (columnData: ColumnData) => {
            const commonProps = {
                'v-model': columnData.value,
                placeholder: columnData.placeholder,
            };

            switch (columnData.type) {
                case "input":
                    return (
                        // <el-input
                        //     {...commonProps}
                        //     onChange={() => requestForm_inputChange()}
                        // />
                        <Input modelValue={columnData.value} />
                    );

                case "select": {
                    const options = columnData.options?.length ? columnData.options : [
                        { key: "String", label: "String", value: "String" },
                        { key: "Number", label: "Number", value: "Number" },
                        { key: "Array", label: "Array", value: "Array" },
                        { key: "Object", label: "Object", value: "Object" },
                        { key: "Boolean", label: "Boolean", value: "Boolean" }
                    ];

                    return (
                        <el-select
                            {...commonProps}
                            onChange={() => requestForm_selectChange()}
                        >
                            {options.map(opt => (
                                <el-option
                                    key={opt.key}
                                    label={opt.label}
                                    value={opt.value}
                                />
                            ))}
                        </el-select>
                    );
                }

                case "checkbox":
                    return (
                        <el-checkbox
                            v-model={columnData.value}
                            size="large"
                            onChange={() => requestForm_checkChange()}
                        />
                    );

                default:
                    return null;
            }
        };

        return () => (
            <div class={cn("text-sm text-gray-700 dark:text-slate-400")}>
                {/* 头部标题 */}
                <div class={cn(
                    "flex flex-row items-center w-full font-semibold",
                    "border border-gray-200 dark:border-slate-800",
                )}>
                    {props.headerData.map((header) => (
                        <div
                            style={{ width: `${header.width}%` }}
                            class={cn("text-center py-2 border-r dark:border-r-slate-800")}
                        >
                            {header.name}
                        </div>
                    ))}

                    <div class={cn("px-2")}>
                        <Circle
                            class={cn("cursor-pointer select-none")}
                            width="20px"
                            height="20px"
                            onClick={() => header_itemAdd()}
                            type="plus"
                        />
                    </div>
                </div>

                {/* 头部参数 */}
                <div class={cn(
                    "w-full",
                    "border border-gray-200 dark:border-slate-800"
                )}>
                    {props.bodyData.map((row) => (
                        <div class={cn("flex flex-row items-center")}>
                            {row.map((column, columnIndex) => (
                                <div
                                    class={cn("border-r dark:border-r-slate-800")}
                                    style={{
                                        width: `${props.headerData[columnIndex].width}%`
                                    }}
                                >
                                    {renderFormByType(column)}
                                </div>
                            ))}
                            <div class={cn("px-2")}>
                                <Circle
                                    class={cn("cursor-pointer select-none")}
                                    width="20px"
                                    height="20px"
                                    type="minus"
                                />
                            </div>
                            {/* <div class={cn("flex justify-center items-center py-1 border-r dark:border-r-slate-800")}>
                                <el-button
                                    type="primary"
                                    circle
                                    onClick={itemAdd.bind(row)}
                                >
                                    <Plus class={cn("w-4 h-4")} />
                                </el-button>
                                <el-button
                                    type="danger"
                                    circle
                                    onClick={itemDelete.bind(row)}
                                >
                                    <Minus class={cn("w-4 h-4")} />
                                </el-button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        );
    },
});
