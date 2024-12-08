import { defineComponent } from "vue";
import { deepClone, throttle } from "@/utils/index";
import Circle from '@/components/foreground/icon/Circle.tsx';
import { cn } from '@/utils/index';
import Select from '@/components/foreground/form/Select';
import Input from '@/components/foreground/form/Input';
import CheckBox from "@/components/foreground/form/CheckBox";

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

export const paramsFormProps = {
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
        "paramsChange",
        "itemAdd",
        "itemDelete",
    ],
    components: {
        Circle,
        Select,
        Input,
        CheckBox
    },
    props: paramsFormProps,
    setup(props, { emit }) {
        const emitParamsDataChange = throttle(() => {
            emit("paramsChange", props.bodyData);
        }, 500);
        const header_itemAdd = () => emit("itemAdd");

        const itemDelete = function (this: ColumnData[], index: number) {
            emit("itemDelete", deepClone(this), index);
        };
        const renderFormByType = (columnData: ColumnData) => {
            const commonProps = {
                modelValue: columnData.value,
                placeholder: columnData.placeholder,
            };
            switch (columnData.type) {
                case "input":
                    return (
                        <Input {...commonProps}
                            onUpdate:modelValue={(newValue: any) => columnData.value = newValue}
                            onEnterPressed={emitParamsDataChange}
                        />
                    );

                case "select": {
                    const options = columnData.options?.length ? columnData.options : [
                        { key: "String", label: "String", value: "String" },
                        { key: "Number", label: "Number", value: "Number" },
                        { key: "Array", label: "Array", value: "Array" },
                        { key: "Object", label: "Object", value: "Object" },
                        { key: "Boolean", label: "Boolean", value: "Boolean" }
                    ];
                    return <Select class='p-0.5' bordered={false} options={options} {...commonProps} onUpdate:modelValue={(val) => {
                        columnData.value = val;
                        emitParamsDataChange()
                    }} />
                }

                case "checkbox":
                    // TODO  后续封装一下
                    // return <CheckBox />
                    return (
                        <el-checkbox
                            modelValue={columnData.value}
                            size="large"
                            onChange={(val) => {
                                columnData.value = val;
                                emitParamsDataChange()
                            }}
                        />
                    );

                default:
                    return null;
            }
        };

        return () => (
            <div class={cn(
                "request-params",
            )}>
                {/* 头部部分 */}
                <div class={cn(
                    "request-params_header",
                )}>
                    {props.headerData.map((header) => (
                        <div
                            style={{ width: `${header.width}%` }}
                            class={cn(
                                "text-center py-1",
                                "shadow-ly_border dark:shadow-ly_border_dark"
                            )}
                        >
                            {header.name}
                        </div>
                    ))}

                    <div class={cn("h-full p-2", "shadow-ly_border dark:shadow-ly_border_dark")}>
                        <Circle
                            class={cn("cursor-pointer select-none")}
                            width="20px"
                            height="20px"
                            onClick={() => header_itemAdd()}
                            type="plus"
                        />
                    </div>
                </div>

                {/* 参数部分 */}
                <div class={cn(
                    "request-params_body",
                )}>
                    {props.bodyData.map((row, index) => (
                        <div class={cn("flex flex-row items-center h-[36px]")}>
                            {row.map((column, columnIndex) => (
                                <div
                                    class={cn(
                                        "params_body_column",
                                        "shadow-ly_border dark:shadow-ly_border_dark"
                                    )}
                                    style={{
                                        width: `${props.headerData[columnIndex].width}%`
                                    }}
                                >
                                    {renderFormByType(column)}
                                </div>
                            ))}
                            <div class={cn("h-full flex items-center px-2", "shadow-ly_border dark:shadow-ly_border_dark")}>
                                <Circle
                                    class={cn("cursor-pointer select-none")}
                                    width="20px"
                                    height="20px"
                                    type="minus"
                                    onClick={itemDelete.bind(row, index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
});
