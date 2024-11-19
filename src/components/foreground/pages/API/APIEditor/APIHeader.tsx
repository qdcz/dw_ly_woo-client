import { computed, defineComponent, ref } from 'vue';
import ParamsForm from '@/components/params-form/params-form';
import { cn, deepClone, generateUuid } from '@/utils/index';
import Switch from '@/components/foreground/input/switch';



export default defineComponent({
    name: 'APIHeader',
    emits:['headerDataChange'],
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

        const headerBodyTemplate = [
            {
                type: "input",
                placeholder: "请输入自定义字段-键名",
                value: "1",
                id: "",
            },
            {
                type: "input",
                placeholder: "请输入自定义字段-键值",
                value: "2",
                id: "",
            },
            {
                type: "input",
                placeholder: "字段说明",
                value: "3",
                id: "",
            },
        ]

        // Enable real-time synchronization
        const enableHaderRealTimeSync = ref(false);

        const headerDataBridge = computed({
            get: () => {
                return props.headers.map(
                    (i: any) => {
                        console.log(555,deepClone(headerData).map(item => {
                            console.log(666,i);
                            return {
                                type: "input",
                                placeholder: "请输入自定义字段-键值",
                                value: i.value || "",
                                id: i.id || generateUuid(),
                            }
                        }));
                        
                        return deepClone(headerData).map(item => {
                            return {
                                type: "input",
                                placeholder: "请输入自定义字段-键值",
                                value: item.value || "",
                                id: item.id || generateUuid(),
                            }
                        })
                    }
                );
            },
            set: (val) => {
                emit('headerDataChange', val);
            }
        });

        const AddHeaderParams = () => {
            if (props.headers && props.headers.length > 0) {
                // headerDataBridge.value.push(deepClone(props.headers[props.headers.length - 1]))
                headerDataBridge.value = deepClone(props.headers[props.headers.length - 1])
            } else {
                headerDataBridge.value = deepClone(headerBodyTemplate)
            }
            console.log(props.headers,headerDataBridge.value);
        };

        const handleItemAdd = (newItem) => {
            console.log(666, newItem);
            emit('update:headers', [...props.headers, newItem]);
        };

        const handleItemDelete = (item) => {
            const newHeaders = props.headers.filter(h => h.id !== item.id);
            emit('update:headers', newHeaders);
        };

        const handleFormDataChange = (data) => {
            emit('update:headers', data);
        };

        return () => (
            <div class={cn("w-full")}>
                <div class={cn("flex items-center justify-start py-2")}>
                    <span class={cn("text-sm mr-2 text-gray-500 dark:text-gray-400")}>调试模式</span>
                    <Switch modelValue={enableHaderRealTimeSync.value} onUpdate:modelValue={
                        (value) => { enableHaderRealTimeSync.value = value; }
                    } />
                    <span class={cn("text-sm ml-2 text-gray-500 dark:text-gray-400")}>保存模式（修改会实时保存）</span>
                </div>
                <ParamsForm
                    title="请求头"
                    headerData={headerData}
                    bodyData={headerDataBridge.value}
                    onHeaderItemAdd={AddHeaderParams}
                    onItemAdd={handleItemAdd}
                    onItemDelete={handleItemDelete}
                    onFormDataChange={handleFormDataChange}
                />
            </div>
        );
    }
});
