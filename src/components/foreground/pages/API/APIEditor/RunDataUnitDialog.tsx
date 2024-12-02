import { defineComponent, ref } from "vue";
import { cn } from "@/utils/tailwindcss";
import { MIN_HEIGHT_PREPROCESSING_EDITOR } from "@/constants";

import PublicDialog from "@/components/foreground/dialog/publicDialog";
import ComfirmButton from "@/components/foreground/form/ComfirmButton";
import EditorFuncBox from "@/components/editor-func-box";
import MonacoEditor from "@/components/monaco.vue";
import { ElMessage } from "element-plus";


export default defineComponent({
    name: "RunDataUnitDialog",
    components: {
        PublicDialog,
        ComfirmButton,
        MonacoEditor,
        EditorFuncBox
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        dataUnit: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["close",],
    setup(props, { emit }) {

        const monacoEditorRef = ref<any>(null);

        const RunSql = () => {
            console.log(props.dataUnit);
        }

        const onCopy = () => {
            navigator.clipboard.writeText(monacoEditorRef.value?.getContentValue());
            ElMessage.success(`copy success`);
        }

        const onFormatCode = () => {
            monacoEditorRef.value?.formatCode();
            ElMessage.success(`format success`);
        }

        return () => (
            <PublicDialog title={props.title} isOpen={props.isOpen} width="70%" onClose={() => {
                emit("close");
            }}>
                {{
                    default: () => (
                        <div class="monaco-editor">
                            <EditorFuncBox
                                header={true}
                                isShowCopy={true}
                                isShowRun={props.dataUnit.m_unitType === "1"}
                                isShowFormatCode={props.dataUnit.m_unitType === "2"}
                                onOnCopy={onCopy}
                                onOnFormatCode={onFormatCode}
                            >
                                <MonacoEditor
                                    ref={monacoEditorRef}
                                    initialValue={props.dataUnit.sql || props.dataUnit.schema}
                                    initialLanguage={props.dataUnit.m_unitType === "1" ? "sql" : "json"}
                                    className={cn(
                                        "bg-gray-50 dark:bg-black",
                                    )}
                                    style={{ height: MIN_HEIGHT_PREPROCESSING_EDITOR + 'px' }}
                                    readOnly={true}
                                />
                            </EditorFuncBox>
                        </div>
                    ),
                    footer: () => (
                        props.dataUnit.m_unitType === "1" ? <ComfirmButton text="Run" onClick={RunSql} /> : null
                    )
                }}
            </PublicDialog>
        );
    }
});