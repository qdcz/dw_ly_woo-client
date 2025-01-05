import { defineComponent, ref, watch } from "vue";
import { cn } from "@/utils";
import { MIN_HEIGHT_PREPROCESSING_EDITOR } from "@/constants";

import PublicDialog from "@/components/foreground/dialog/publicDialog";
import ComfirmButton from "@/components/foreground/form/ComfirmButton";
import EditorFuncBox from "@/components/editor-func-box";
import MonacoEditor from "@/components/monaco.vue";
import { ElMessage } from "element-plus";

import Input from "@/components/foreground/form/Input";


export default defineComponent({
    name: "CodePopupFullScreen",
    components: {
        PublicDialog,
        ComfirmButton,
        MonacoEditor,
        EditorFuncBox,
        Input
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            validator: (value: string) => ['preprocessing', 'postprocessing', 'excuteResult'].includes(value),
            default: ""
        }
    },
    emits: ["close", 'save'],
    setup(props, { emit }) {

        const monacoEditorRef = ref<any>(null);
        const _code = ref<string>("");
        const clientHeight = ref<number>(MIN_HEIGHT_PREPROCESSING_EDITOR);

        const onCopy = () => {
            navigator.clipboard.writeText(monacoEditorRef.value?.getContentValue());
            ElMessage.success(`copy success`);
        }

        const onFullPage = () => emit("close");

        watch(() => props.code, () => {
            clientHeight.value = document.body.clientHeight - 24 - 28 as number;
            _code.value = props.code
        }, { immediate: true })

        const handleSave = () => {
            const content = monacoEditorRef.value?.getContentValue();
            emit('save', content);
        }

        return () => (
            <PublicDialog title={false} notPadding={true} isOpen={props.isOpen} width="100%" height="100vh" onClose={() => emit("close")}>
                {{
                    default: () => (
                        <div class="flex w-full">
                            <div class="flex-1 monaco-editor rounded-lg overflow-hidden">
                                <EditorFuncBox
                                    header={true}
                                    isShowCopy={true}
                                    isShowFullPage={true}
                                    onOnCopy={onCopy}
                                    onOnFullPage={onFullPage}
                                    bottomTip={props.type === 'excuteResult' ? '' : 'Hold 【ctrl + s】 to save'}
                                    name={props.type}
                                    paramString={props.type === 'excuteResult' ? '' : (
                                        props.type === 'preprocessing' ? 'params, utils' : 'data, params, utils'
                                    )}
                                >
                                    <MonacoEditor
                                        ref={monacoEditorRef}
                                        initialValue={props.code}

                                        initialLanguage="javascript"
                                        className={cn(
                                            "bg-gray-50 dark:bg-black",
                                        )}
                                        style={{ height: clientHeight.value + 'px' }}
                                        onKeydown={(e) => {
                                            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                                                e.preventDefault();
                                                handleSave();
                                            }
                                        }}
                                        readOnly={props.type === 'excuteResult'}
                                    />
                                </EditorFuncBox>
                            </div>
                        </div>
                    )
                }}
            </PublicDialog>
        );
    }
});