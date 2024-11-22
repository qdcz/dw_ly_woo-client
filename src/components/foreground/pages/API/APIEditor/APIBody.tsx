import { computed, defineComponent, ref } from 'vue';
import ParamsForm from '@/components/params-form/params-form';
import { cn, deepClone, generateUuid } from '@/utils/index';
import Switch from '@/components/foreground/input/switch';


export default defineComponent({
    name: 'APIBody',
    emits: ['paramsChange', 'queryParamsDelete'],
    components: {
        ParamsForm,
        Switch
    },
    props: {
        params: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const params = [
            { name: "参数名", width: "20" },
            { name: "类型", width: "20" },
            { name: "必传", width: "10" },
            { name: "示例值", width: "20" },
            { name: "说明", width: "30" },
        ];

        const createParamsTemplate = () => {
            const id = generateUuid();
            return [
                {
                    type: "input",
                    placeholder: "请输入入参名",
                    value: "key",
                    id
                },
                {
                    type: "select",
                    placeholder: "请选择字段类型",
                    value: "string",
                    id
                },
                {
                    type: "checkbox",
                    placeholder: "是否必传",
                    value: 'true',
                    id
                },
                {
                    type: "input",
                    placeholder: "请输入示例值",
                    value: 'value',
                    id
                },
                {
                    type: "input",
                    placeholder: "请输入入参描述",
                    value: "这是一段描述",
                    id
                },
            ]
        }

        // Enable real-time synchronization
        const enableParamsRealTimeSync = ref(false);

        const paramsBridge = computed({
            get: () => {
                return props.params
            },
            set: (val) => {
                emit('paramsChange', val, enableParamsRealTimeSync);
            }
        });

        const addParams = () => {
            if (props.params && props.params.length > 0) {
                const data = deepClone(props.params);
                paramsBridge.value = data.concat([createParamsTemplate()])
            } else {
                paramsBridge.value = [createParamsTemplate()]
            }
        };

        const deleteParams = (item, index) => {
            const data = deepClone(props.params);
            data.splice(index, 1);
            paramsBridge.value = data;
            emit('queryParamsDelete', item, index);
        };

        const ParamsChange = (data) => {
            paramsBridge.value = data;
        };

        return () => (
            <div class={cn("w-full")}>
                <div class={cn("flex items-center justify-start py-2")}>
                    <span class={cn(
                        "text-sm mr-2",
                        "transition-all duration-500",
                        enableParamsRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}>调试模式（修改不会保存至云端）</span>
                    <Switch modelValue={enableParamsRealTimeSync.value} onUpdate:modelValue={
                        (value) => { enableParamsRealTimeSync.value = value; }
                    } />
                    <span class={cn(
                        "text-sm ml-2",
                        "transition-all duration-500",
                        !enableParamsRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}>保存模式（单行增删会实时保存至云端，单列需要回车进行保存）</span>
                </div>
                <ParamsForm
                    title="请求入参"
                    headerData={params}
                    bodyData={paramsBridge.value}
                    onItemAdd={addParams}
                    onItemDelete={deleteParams}
                    onParamsChange={ParamsChange}
                />
            </div>
        );
    }
});
