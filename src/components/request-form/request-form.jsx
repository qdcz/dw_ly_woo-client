import { defineComponent, reactive, computed } from "vue";
import { deepClone, generateString } from "../../utils/index";

export const requestFormProps = {
    title: {
        type: [String],
        default: "这是一个标题",
    },
    headerConfig: {
        type: [Array],
        default: [
            { name: "参数名", width: "20" },
            { name: "类型", width: "20" },
            { name: "必填", width: "10" },
            { name: "示例值", width: "20" },
            { name: "说明", width: "20" },
        ],
    },
    bodyData: {
        type: [Array],
        default: [
            [
                { type: "input", placeholder: "添加参数", value: "age" },
                { type: "select", placeholder: "字段类型", value: "1" },
                { type: "checkbox", value: true },
                { type: "input", placeholder: "示例值", value: "99" },
                {
                    type: "input",
                    placeholder: "说明",
                    value: "这是一个年宁字段",
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
                    value: "这是一个年宁字段",
                },
            ],
        ],
    },
};

export default defineComponent({
    name: "RollList",
    emits: [
        "update:modelValue",
        "formDataChange",
        "headerItemAdd",
        "itemAdd",
        "itemDelete",
    ],
    components: {},
    props: requestFormProps,
    setup(props, ctx) {
        const data = reactive({});

        /**
         * 计算属性
         */

        const headerConfigBridge = computed(() => props.headerConfig);
        const bodyDataBridge = computed(() => props.bodyData);

        /**
         * 组件函数监听
         */
        const requestForm_selectChange = function (e) {
            ctx.emit && ctx.emit("formDataChange", props.bodyData);
        };

        const requestForm_inputChange = function (e) {
            ctx.emit && ctx.emit("formDataChange", props.bodyData);
        };

        const requestForm_checkChange = function (e) {
            ctx.emit && ctx.emit("formDataChange", props.bodyData);
        };

        const header_itemAdd = function () {
            const id = generateString(36);
            ctx.emit &&
                ctx.emit("headerItemAdd", [
                    new Array(props.headerConfig.length).fill(0).map((i) => {
                        return { id };
                    }),
                ]);
        };

        const itemAdd = function (e) {
            const newData = deepClone(this).map((i) => {
                i.id = generateString(36);
                return i;
            });
            ctx.emit && ctx.emit("itemAdd", newData);
        };

        const itemDelete = function (e) {
            ctx.emit && ctx.emit("itemDelete", deepClone(this));
        };

        // 根据类型渲染不同的表单组件。
        const renderFormByType = (columnData, rowData) => {
            if (columnData.type == "input") {
                return (
                    <el-input
                        v-model={columnData.value}
                        placeholder={columnData.placeholder}
                        onChange={requestForm_inputChange.bind(columnData)}
                    />
                );
            } else if (columnData.type == "select") {
                // 自定义options选项
                if (columnData.options && columnData.options.length > 0) {
                    return (
                        <el-select
                            v-model={columnData.value}
                            onChange={requestForm_selectChange.bind(columnData)}
                            placeholder={columnData.placeholder}
                        >
                            {columnData.options.map((i) => {
                                return (
                                    <el-option
                                        key={i.key}
                                        label={i.label}
                                        value={i.value}
                                    />
                                );
                            })}
                        </el-select>
                    );
                }
                // 默认选项
                return (
                    <el-select
                        v-model={columnData.value}
                        onChange={requestForm_selectChange.bind(columnData)}
                        placeholder={columnData.placeholder}
                    >
                        <el-option key="String" label="String" value="String" />
                        <el-option key="Number" label="Number" value="Number" />
                        <el-option key="Array" label="Array" value="Array" />
                        <el-option key="Object" label="Object" value="Object" />
                        <el-option
                            key="Boolean"
                            label="Boolean"
                            value="Boolean"
                        />
                    </el-select>
                );
            } else if (columnData.type == "checkbox") {
                return (
                    <el-checkbox
                        v-model={columnData.value}
                        size="large"
                        onChange={requestForm_checkChange.bind(columnData)}
                    />
                );
            }
        };

        /**
         * view
         */
        return () => (
            <div class={"request-params"}>
                <div class={"request-params__title"}>
                    {props.title} {props.title ? " : " : ""}{" "}
                </div>
                <div class={"request-params__header"}>
                    {headerConfigBridge.value.map((i) => {
                        return (
                            <div
                                style={{ width: i.width + "%" }}
                                class={"column"}
                            >
                                {i.name}
                            </div>
                        );
                    })}
                    {/* 操作按钮 */}
                    <div class={"column"} style={{ width: "20%" }}>
                        <el-button
                            type="primary"
                            circle
                            onClick={header_itemAdd}
                        >
                            <Plus style="width: 1em; height: 1em;" />
                        </el-button>
                    </div>
                </div>
                <div class={"request-params__body"}>
                    {bodyDataBridge.value.map((row) => {
                        return (
                            <div class={"row"}>
                                {row.map((column, columnIndex) => {
                                    return (
                                        <div
                                            class={"column"}
                                            style={{
                                                width:
                                                    headerConfigBridge.value[
                                                        columnIndex
                                                    ].width + "%",
                                            }}
                                        >
                                            {renderFormByType(column, row)}
                                        </div>
                                    );
                                })}
                                {/* 操作按钮 */}
                                <div class={"column"} style={{ width: "20%" }}>
                                    <el-button
                                        type="primary"
                                        circle
                                        onClick={itemAdd.bind(row)}
                                    >
                                        <Plus style="width: 1em; height: 1em;" />
                                    </el-button>
                                    <el-button
                                        type="danger"
                                        circle
                                        onClick={itemDelete.bind(row)}
                                    >
                                        <Minus style="width: 1em; height: 1em;" />
                                    </el-button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
});
