import { defineComponent, computed } from "vue";
import { FullScreen, DocumentCopy, CaretLeft } from "@element-plus/icons-vue";
import RunIcon from "@/components/foreground/icon/Run.tsx";
import FormatCodeIcon from "@/components/foreground/icon/FormatCode.tsx";
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
    isShowFold: {
        type: [Boolean],
        default: false,
    },
    isShowCopy: {
        type: [Boolean],
        default: false,
    },
    isShowFullPage: {
        type: [Boolean],
        default: false,
    },
    isShowRun: {
        type: [Boolean],
        default: false,
    },
    isShowFormatCode: {
        type: [Boolean],
        default: false,
    },
    isFold: {
        type: [Boolean],
        default: false,
    },
    height: {
        type: [Number],
        default: 0,
    },
};

export default defineComponent({
    name: "editor-func-box",
    emits: ["onCopy", "onFullPage", "onFold", "onRun", "onFormatCode"],
    props,
    components: {
        RunIcon,
        FormatCodeIcon,
    },
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
        const fold = (isFold) => ctx.emit("onFold", isFold);
        const run = () => ctx.emit("onRun");
        const formatCode = () => ctx.emit("onFormatCode");
        return () => (
            <div class="editor-func-box">
                {
                    props.isFold && (
                        <div class="foldCover" style={{ height: props.height + 'px' }} onClick={fold.bind(null, false)}>
                            <span>{props.name}</span>
                        </div>
                    )
                }
                {props.header && !props.isFold && (
                    <div class="header">
                        <div>
                            <span class="mtk mtk1">function </span>
                            <span class="mtk mtk2">{nameBridge.value}</span>
                            <span class="mtk mtk3"> {"("} </span>
                            <span class="mtk mtk4">{paramsBridge.value}</span>
                            <span class="mtk mtk3"> {")"} </span>
                            <span class="mtk mtk3"> {"{"} </span>
                        </div>
                        {props.isShowFold && (
                            <el-icon class="btn full" onClick={fold.bind(null, true)}>
                                {<DArrowLeft />}
                            </el-icon>
                        )}
                    </div>
                )}
                <div>{!props.isFold && ctx.slots.default && ctx.slots.default()}</div>
                {props.footer && !props.isFold && (
                    <div class="footer">
                        <span class="mtk mtk3"> {"}"} </span>
                        <div>
                            {props.isShowFormatCode && (
                                <el-icon class="btn formatCode" onClick={formatCode}>
                                    {<FormatCodeIcon />}
                                </el-icon>
                            )}
                            {props.isShowRun && (
                                <el-icon class="btn run" onClick={run}>
                                    {<RunIcon />}
                                </el-icon>
                            )}
                            {props.isShowCopy && (
                                <el-icon class="btn copy" onClick={copy}>
                                    {<DocumentCopy />}
                                </el-icon>
                            )}
                            {props.isShowFullPage && (
                                <el-icon class="btn full" onClick={fullPage}>
                                    {<FullScreen />}
                                </el-icon>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    },
});
