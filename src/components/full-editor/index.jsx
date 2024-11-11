import {
    defineComponent,
    reactive,
    computed,
    onMounted,
    onBeforeUnmount,
    ref,
} from "vue";
import { deepClone } from "../../utils/index";
import MonacoEditor from "../monaco.vue";
import { ElMessage } from "element-plus";
export const fullEditorProps = {
    logic: {
        type: [String],
        default: "",
    },
};

export default defineComponent({
    name: "full-editor",
    emits: ["update:modelValue", "handleSaveCode", "codeChange"],
    components: {},
    props: fullEditorProps,
    setup(props, ctx) {
        /**
         * 数据
         */
        const data = reactive({
            editForm: {
                logic: "function(){return true}",
            },
            language: "javascript",
        });

        /**
         * dom 节点
         */
        const Editor = ref(null);

        /**
         * 逻辑桥接
         */
        const logicBridge = computed(() => props.logic);

        /**
         * 获取高度
         */
        const getHeight = () => {
            const height =
                document.body.clientHeight -
                document.querySelector(".el-drawer__header").clientHeight -
                88;
            return height;
        };

        /**
         * 保存代码
         */
        const handleSaveCode = function (e) {
            // ctx.emit && ctx.emit("handleSaveCode", props.logic);
            ctx.emit &&
                ctx.emit("handleSaveCode", Editor.value.getContentValue());
        };

        /**
         * 防抖函数
         * @param func 回调函数
         * @param time 时间
         */
        let lastTime = 0;
        const throttle = (func, time) => {
            return function (...args) {
                const now = Date.now();
                if (now - lastTime > time) {
                    lastTime = now;
                    func.apply(this, args);
                }
            };
        };

        /**
         *
         * @param event 监督键盘事件
         */
        function handleEnterKey(event) {
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                ElMessage.success("代码保存成功！");
                throttle(() => {
                    handleSaveCode();
                }, 1000)();
            }
        }

        onMounted(() => {
            window.addEventListener("keydown", handleEnterKey);
        });

        onBeforeUnmount(() => {
            window.removeEventListener("keydown", handleEnterKey);
        });

        /**
         * view
         */
        return () => (
            <div class={"full-editor"}>
                <MonacoEditor
                    initialValue={logicBridge.value}
                    initialLanguage={data.language}
                    ref={Editor}
                    style={{ height: getHeight() + "px" }}
                    onContentChange={(v) =>
                        ctx.emit && ctx.emit("codeChange", v)
                    }
                ></MonacoEditor>
            </div>
        );
    },
});
