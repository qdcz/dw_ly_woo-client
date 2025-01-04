import { computed, defineComponent, ref } from 'vue';
import ParamsForm from '@/components/params-form/params-form';
import { cn, deepClone, generateUuid } from '@/utils/index';
import Switch from '@/components/foreground/form/Switch';



export default defineComponent({
    name: 'APIHeader',
    emits: ['headerDataChange', 'headerParamsDelete'],
    components: {
        ParamsForm,
        Switch
    },
    props: {
        headers: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const headerData = [
            { name: "参数名", width: "25" },
            { name: "字段值", width: "25" },
            { name: "描述", width: "50" }
        ];

        const isShowToopTip_L = ref<Boolean>(false);
        const isShowToopTip_R = ref<Boolean>(false);

        const createHeaderBodyTemplate = () => {
            const id = generateUuid();
            return [
                {
                    type: "input",
                    placeholder: "请输入自定义字段-键名",
                    value: "key",
                    id
                },
                {
                    type: "input",
                    placeholder: "请输入自定义字段-键值",
                    value: "value",
                    id
                },
                {
                    type: "input",
                    placeholder: "字段说明",
                    value: "这是一段描述",
                    id
                },
            ]
        }

        // Enable real-time synchronization
        const enableHaderRealTimeSync = ref(false);

        const headerDataBridge = computed({
            get: () => {
                return props.headers
            },
            set: (val) => {
                emit('headerDataChange', val, enableHaderRealTimeSync);
            }
        });

        const AddHeaderParams = () => {
            if (props.headers && props.headers.length > 0) {
                const data = deepClone(props.headers);
                headerDataBridge.value = data.concat([createHeaderBodyTemplate()])
            } else {
                headerDataBridge.value = [createHeaderBodyTemplate()]
            }
        };

        const DeleteHeaderParams = (item, index) => {
            const data = deepClone(props.headers);
            data.splice(index, 1);
            headerDataBridge.value = data;
            emit('headerParamsDelete', item, index);
        };

        const ParamsDataChange = (data) => {
            headerDataBridge.value = data;
        };

        return () => (
            <div class={cn("w-full")}>
                <div class={cn("flex items-center justify-start pb-2")}>
                    <span class={cn(
                        'cursor-pointer',
                        "relative",
                        "text-sm mr-2",
                        "transition-all duration-500",
                        enableHaderRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
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

                    <Switch modelValue={enableHaderRealTimeSync.value} onUpdate:modelValue={
                        (value) => { enableHaderRealTimeSync.value = value; }
                    } />

                    <span class={cn(
                        'cursor-pointer',
                        "relative",
                        "text-sm ml-2",
                        "transition-all duration-500",
                        !enableHaderRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
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
                    title="请求头"
                    headerData={headerData}
                    bodyData={headerDataBridge.value}
                    onItemAdd={AddHeaderParams}
                    onItemDelete={DeleteHeaderParams}
                    onParamsChange={ParamsDataChange}
                />
            </div>
        );
    }
});
