import { computed, defineComponent, ref } from 'vue';
import ParamsForm from '@/components/params-form/params-form';
import { cn, deepClone, generateUuid } from '@/utils/index';
import Switch from '@/components/foreground/input/switch';



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
                <div class={cn("flex items-center justify-start py-2")}>
                    <span class={cn(
                        "text-sm mr-2",
                        "transition-all duration-500",
                        enableHaderRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}>调试模式（修改不会保存至云端）</span>
                    <Switch modelValue={enableHaderRealTimeSync.value} onUpdate:modelValue={
                        (value) => { enableHaderRealTimeSync.value = value; }
                    } />
                    <span class={cn(
                        "text-sm ml-2",
                        "transition-all duration-500",
                        !enableHaderRealTimeSync.value ? "text-gray-300 dark:text-gray-600" : "text-blue-500 dark:text-indigo-50"
                    )}>保存模式（单行增删会实时保存至云端，单列需要回车进行保存）</span>
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
