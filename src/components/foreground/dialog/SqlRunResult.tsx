import { defineComponent, ref, watch } from "vue";
import { cn, extractKeyValuePairs, encryptAES, convertMonacoValue } from "@/utils";
import { MIN_HEIGHT_PREPROCESSING_EDITOR } from "@/constants";

import PublicDialog from "@/components/foreground/dialog/publicDialog";
import ComfirmButton from "@/components/foreground/form/ComfirmButton";
import EditorFuncBox from "@/components/editor-func-box";
import MonacoEditor from "@/components/monaco.vue";
import { ElMessage } from "element-plus";

import Input from "@/components/foreground/form/Input";
import APIs from "@/components/foreground/pages/API/APIs";


export default defineComponent({
    name: "SqlRunResult",
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
        title: {
            type: String,
            default: "SQL Run Result"
        },
        code: {
            type: String,
            default: ""
        },
        dataSourceId: {
            type: String,
            default: ""
        }
    },
    emits: ["close",],
    setup(props, { emit }) {

        const monacoEditorRef = ref<any>(null);
        const excuteResult = ref<string>("");

        const onCopy = () => {
            navigator.clipboard.writeText(monacoEditorRef.value?.getContentValue());
            ElMessage.success(`copy success`);
        }

        const sqlParams = ref<any[]>([]);
        watch(() => props.code, () => {
            // Parse dynamic parameters of SQL
            const params = extractKeyValuePairs(props.code);

            sqlParams.value = params.map((i: any) => {
                return {
                    key: i.value,
                    value: "",
                }
            });
        }, { immediate: true })

        const ExcuteSql = () => {
            let sql = props.code;
            sqlParams.value.forEach((element) => {
                sql = sql.replace(
                    ":" + element.key,
                    `'${element.value}'` || `''`
                );
            });
            const sqlEncrypt = encryptAES(sql);
            APIs._SqlResult({
                dataSourceId: props.dataSourceId,
                sql: sqlEncrypt,
            }).then((res: any) => {
                if (res.code === 200) {
                    excuteResult.value = convertMonacoValue(res.data).content;
                    ElMessage.success(`excute sql success`);
                }
            })
        }

        return () => (
            <PublicDialog title={props.title} isOpen={props.isOpen} width="70%" onClose={() => {
                sqlParams.value.forEach((i: any) => i.value = "")
                emit("close");
            }}>
                {{
                    default: () => (
                        <div class="flex w-full">
                            <div class="flex-1/3 flex flex-col overflow-auto no-scrollbar" style={{ maxHeight: MIN_HEIGHT_PREPROCESSING_EDITOR + 28 * 2 + 'px' }}>
                                <span class="text-base font-bold pb-4 sticky top-0 bg-white dark:bg-gray-800">Parameters</span>
                                {sqlParams.value.map((i: any) => (
                                    <div class="flex items-center py-2">
                                        <span class="mr-2 text-sm">{i.key}</span>
                                        <Input class="mr-1" bordered={true} key={i.key} modelValue={i.value} onUpdate:modelValue={(value: string) => {
                                            i.value = value;
                                        }} placeholder={"input your parameter"} />
                                    </div>
                                ))}
                                {
                                    sqlParams.value.length <= 0 && <div class="text-sm text-gray-500 whitespace-nowrap pr-5 select-none">This SQL has no parameters</div>
                                }
                            </div>
                            <div class="flex-1 ml-4">
                                <div class="monaco-editor rounded-lg overflow-hidden">
                                    <EditorFuncBox
                                        header={true}
                                        isShowCopy={true}
                                        onOnCopy={onCopy}
                                    >
                                        <MonacoEditor
                                            ref={monacoEditorRef}
                                            initialValue={excuteResult.value}
                                            initialLanguage="sql"
                                            className={cn(
                                                "bg-gray-50 dark:bg-black",
                                            )}
                                            style={{ height: MIN_HEIGHT_PREPROCESSING_EDITOR + 'px' }}
                                            readOnly={true}
                                        />
                                    </EditorFuncBox>
                                </div>
                            </div>
                        </div>
                    ),
                    footer: () => (
                        <ComfirmButton text="ExcuteSql" onClick={ExcuteSql} />
                    )
                }}
            </PublicDialog>
        );
    }
});