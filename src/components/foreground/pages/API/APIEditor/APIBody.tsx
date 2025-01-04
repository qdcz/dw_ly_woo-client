import { computed, defineComponent, ref } from 'vue';
import ParamsForm from '@/components/params-form/params-form';
import { cn, deepClone, generateUuid } from '@/utils/index';
import Switch from '@/components/foreground/form/Switch';


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
        const isShowToopTip_L = ref<Boolean>(false);
        const isShowToopTip_R = ref<Boolean>(false);

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
                <div class={cn("flex items-center justify-start pb-2")}>
                    <span class={cn(
                        'cursor-pointer',
                        "relative",
                        "text-sm mr-2",
                        "transition-all duration-500",
                        enableParamsRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}
                        onMouseenter={() => isShowToopTip_L.value = true}
                        onMouseleave={() => isShowToopTip_L.value = false}
                    >
                        Debug Mode
                        <div class={cn(
                            'absolute -left-1/2',
                            "transition-opacity duration-500",
                            "mt-4 py-1 px-2 text-sm rounded dark:bg-gray-700 bg-gray-900 dark:text-gray-300 text-white",
                            'text-nowrap',
                            isShowToopTip_L.value ? "opacity-1" : "opacity-0"
                        )}>
                            <div class={cn(
                                "absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0",
                                "border-l-8 border-r-8 border-b-8 border-transparent dark:border-y-gray-700 border-y-gray-300"
                            )}></div>
                            <span>Changes will not be saved</span>
                        </div>
                    </span>

                    <Switch modelValue={enableParamsRealTimeSync.value} onUpdate:modelValue={
                        (value) => { enableParamsRealTimeSync.value = value; }
                    } />


                    <span class={cn(
                        'cursor-pointer',
                        "relative",
                        "text-sm ml-2",
                        "transition-all duration-500",
                        !enableParamsRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}
                        onMouseenter={() => isShowToopTip_R.value = true}
                        onMouseleave={() => isShowToopTip_R.value = false}
                    >
                        Real-time Mode
                        <div class={cn(
                            'absolute',
                            "transition-opacity duration-500",
                            "mt-4 py-1 px-2 text-sm rounded dark:bg-gray-700 bg-gray-900 dark:text-gray-300 text-white",
                            'text-nowrap',
                            isShowToopTip_R.value ? "opacity-1" : "opacity-0"
                        )}>
                            <div class={cn(
                                "absolute bottom-full left-10 transform -translate-x-1/2 w-0 h-0",
                                "border-l-8 border-r-8 border-b-8 border-transparent dark:border-y-gray-700 border-y-gray-300"
                            )}></div>
                            <span>Single line add and delete will be saved in real time, single column needs to be saved by pressing Enter</span>
                        </div>
                    </span>
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
