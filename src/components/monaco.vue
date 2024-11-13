<template>
    <div class="monaco-editor-container">
        <div ref="editorRef" class="editor"></div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick, watch, onBeforeMount } from "vue";
import * as monaco from "monaco-editor";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { deepClone } from "../utils";
import { FunctionList } from "../api/index";
import { ElMessage } from "element-plus";
import { fa } from "element-plus/es/locale/index.mjs";

let _disposable = null; // 代码补全提示面版
let completionItems = []; // 提示面版内容
let _initLoadFunction = false;

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES6,
    allowNonTsExtensions: true,
});

monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

monaco.languages.register({ id: "html" });
monaco.languages.register({ id: "css" });
monaco.languages.register({ id: "javascript" });
monaco.languages.register({ id: "typescript" });

monaco.languages.onLanguage("html", () => {
    monaco.languages.html.htmlDefaults.setOptions({
        validate: true,
        format: true,
    });
    monaco.languages.html.htmlDefaults.setModeConfiguration({
        completionItems: true,
        hovers: true,
        documentHighlights: true,
        documentLinks: true,
        tokens: true,
        colors: true,
        foldingRanges: true,
        diagnostics: true,
        selectionRanges: true,
        folding: true,
    });
});

monaco.languages.onLanguage("css", () => {
    monaco.languages.css.cssDefaults.setOptions({
        validate: true,
        lint: true,
    });
});

monaco.languages.onLanguage("typescript", () => {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
    });
});

export default {
    name: "MonacoEditor",
    emits: ["getUtils", "contentChange"],
    props: {
        initialValue: {
            type: [String, null],
            required: true,
        },
        initialLanguage: {
            type: String,
            required: true,
            default: "javascript",
        },
        width: {
            type: Number,
            default: 800,
        },
        height: {
            type: Number,
            default: 100,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, ctx) {
        const editorRef = ref(null);
        let editor = null;

        self.MonacoEnvironment = {
            getWorker(_, label) {
                if (label === "json") {
                    return new JsonWorker();
                }
                if (["css", "scss", "less"].includes(label)) {
                    return new CssWorker();
                }
                if (["html", "handlebars", "razor"].includes(label)) {
                    return new HtmlWorker();
                }
                if (["typescript", "javascript"].includes(label)) {
                    return new TsWorker();
                }
                return new EditorWorker();
            },
        };

        /**
         * 接口请求
         * @param {*} params
         */
        const functionList = async (params) => {
            if (!params) {
                params = {
                    page: 1,
                    take: 99999999,
                };
            }
            const { code, data } = await FunctionList(params);
            if (code == 200) {
                ElMessage.success("查询工具函数成功！");
                completionItems = data.data.map((method) => ({
                    label: method.name,
                    insertText: method.name,
                    kind: monaco.languages.CompletionItemKind.Property,
                    documentation: `function description：${method.description || undefined
                        };
params：${JSON.parse(method.params)
                            .map((i, index) =>
                                index == 0
                                    ? `${i.key} : ${i.info || undefined}`
                                    : `
                ${i.key} : ${i.info || undefined}`
                            )
                            .join(` , `)}
return：功能暂未实现
docs: https://github.com`,
                    detail: method.name,
                }));
            }
        };

        onBeforeMount(async () => {
            if (!_initLoadFunction) {
                _initLoadFunction = true;
                await functionList();
            }
        });

        onMounted(() => {
            editor = monaco.editor.create(editorRef.value, {
                value: props.initialValue,
                language: props.initialLanguage,
                automaticLayout: true,
                readOnly: props.readOnly,
                autoIndent: true,
                formatOnPaste: true,
                formatOnType: true,
            });
            monaco.editor.setTheme("vs-dark");
            const layout = {
                // width: props.width,
                height: props.height,
            };
            // editor.layout(layout);

            // 监听内容更改事件并获取最新编辑器内容
            editor.onDidChangeModelContent(() => {
                ctx.emit("contentChange", editor.getValue());
            });

            editor.onKeyUp(async (event) => {
                const currentValue = editor.getValue();
                const cursorPosition = editor.getPosition();
                if ([15, 16, 17, 18].includes(event.keyCode)) return;
                if (
                    currentValue == "utils." ||
                    currentValue.includes("utils.")
                ) {
                    if (_disposable) {
                        _disposable.dispose();
                    }
                    _disposable =
                        monaco.languages.registerCompletionItemProvider(
                            "javascript",
                            {
                                triggerCharacters: ["."],
                                provideCompletionItems: (model, position) => {
                                    // const { lineNumber, column } = position;

                                    /* 获取当前光标所在行的文本 */
                                    // const beforeEditingText =
                                    //     model.getValueInRange({
                                    //         startLineNumber: lineNumber,
                                    //         startColumn: 0,
                                    //         endLineNumber: lineNumber,
                                    //         endColumn: column,
                                    //     });

                                    /* 正在编辑的单词 */
                                    // const editingWord = _.last(
                                    //     beforeEditingText
                                    //         .trim()
                                    //         .split(/\s+/)
                                    // );

                                    /* .结尾 */
                                    // if (editingWord.endsWith(".")) {
                                    //     const wordNoDot = editingWord.slice(
                                    //         0,
                                    //         editingWord.length - 1
                                    //     );
                                    //     if (
                                    //         Object.keys(
                                    //             this._hintData
                                    //         ).includes(wordNoDot)
                                    //     ) {
                                    //         suggestions = [
                                    //             ...this.getTableSuggest(
                                    //                 wordNoDot
                                    //             ),
                                    //         ];
                                    //     }
                                    // } else if (editingWord === ".") {
                                    //     /* .开头 */
                                    //     suggestions = [];
                                    // } else {
                                    //     suggestions = [
                                    //         ...this.getDBSuggest(),
                                    //         ...this.getSQLSuggest(),
                                    //     ];
                                    // }
                                    return {
                                        suggestions: deepClone(completionItems),
                                    };
                                },
                            }
                        );

                    // 设置光标位置
                    editor.setPosition(cursorPosition);
                }
            });
        });

        const getContentValue = function () {
            return editor.getValue();
        };

        const setContentValue = function (v) {
            editor.setValue(v);
            setTimeout(() => {
                formatCode();
            }, 300);
        };

        const formatCode = function () {
            const formatAction = editor.getAction(
                "editor.action.formatDocument"
            );
            formatAction.run();
        };

        // 改变编辑器内的内容
        watch(
            () => props.initialValue,
            (newValue) => {
                if (editor) {
                    editor.trigger("anyString", "editor.action.formatDocument");
                    editor.setValue(newValue);
                }
            }
        );
        return {
            editorRef,
            getContentValue,
            setContentValue,
        };
    },
};
</script>

<style>
.monaco-editor-container {
    width: 100%;
    height: 100%;
}

.editor {
    width: 100%;
    height: 100%;
}
</style>
