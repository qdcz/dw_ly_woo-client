import { defineComponent, computed } from "vue";
import { FullScreen, DocumentCopy } from "@element-plus/icons-vue";

export const props = {
    name: {
        type: [String],
        default: "",
    },
    params: {
        type: [Array],
        default: [],
    },
    paramString: {
        type: [String],
        default: "",
    },
    header: {
        type: [Boolean],
        default: true,
    },
    footer: {
        type: [Boolean],
        default: true,
    },
};

export default defineComponent({
    name: "editor-func-box",
    emits: ["onCopy", "onFullPage"],
    props,
    setup(props, ctx) {
        const nameBridge = computed(() => props.name);
        const paramsBridge = computed(() => {
            if (props.paramString) {
                return props.paramString;
            }
            if (props.params.length) {
                let str = "";
                props.params.forEach((i) => (str += ` , ${i[0].value}`));
                return str.slice(2);
            } else {
                return "";
            }
        });

        const copy = () => ctx.emit && ctx.emit("onCopy");
        const fullPage = () => ctx.emit("onFullPage");

        return () => (
            <div class="editor-func-box">
                {props.header && (
                    <div class="header">
                        <span class="mtk mtk1">function </span>
                        <span class="mtk mtk2">{nameBridge.value}</span>
                        <span class="mtk mtk3"> {"("} </span>
                        <span class="mtk mtk4">{paramsBridge.value}</span>
                    </div>
                )}

                <div>{ctx.slots.default && ctx.slots.default()}</div>
                {props.footer && (
                    <div class="footer">
                        <span class="mtk mtk3"> {"}"} </span>
                        <div>
                            <el-icon class="btn copy" onClick={copy}>
                                {<DocumentCopy />}
                            </el-icon>
                            <el-icon class="btn full" onClick={fullPage}>
                                {<FullScreen />}
                            </el-icon>
                        </div>
                    </div>
                )}
            </div>
        );
    },
});
