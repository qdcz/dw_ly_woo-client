import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cn, deepClone } from '@/utils/index';
import { API_METHOD, API_STEP } from '@/constants';
import APIs from '@/components/foreground/pages/API/APIs';
import { ElMessage } from 'element-plus';

import MonacoEditor from '@/components/monaco.vue';
import editorFuncBox from '@/components/editor-func-box/index.jsx';
import APIHeader from './APIHeader';
import { LEFT_SIDEBAR_WIDTH, MIN_HEIGHT_PREPROCESSING_EDITOR } from '@/const';

const defaultPrePostprocessingForm = {
    id: '',
    name: '',
    params: '',
    logic: '',
    description: '',
}

export default defineComponent({
    name: "mainContent",
    components: {
        MonacoEditor,
        editorFuncBox,
        APIHeader
    },
    setup(props) {
        const route = useRoute();
        const loading = ref(true);
        const preprocessingLoading = ref(true);
        const postprocessingLoading = ref(true);
        const preprocessingEditForm = ref(deepClone(defaultPrePostprocessingForm));
        const postprocessingEditForm = ref(deepClone(defaultPrePostprocessingForm));
        const excuteResultEditForm = ref(null);
        const preprocessingEditorRef: any = ref(null);
        const postprocessingEditorRef: any = ref(null);
        const excuteResultEditorRef: any = ref(null);

        const activeTab = ref('headers');

        /**
         * API response data
         */
        const APIInfo: any = ref({});
        const APIHeaders = ref([]);


        /**
         * component show status
         */
        const isShowPreprocessingEditor = ref(false);
        const isShowPostprocessingEditor = ref(false);
        const isShowExcuteResultEditor = ref(false);

        const getMethodStyles = (method: string) => {
            const styles = {
                'GET': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-600 hover:bg-green-200 dark:hover:bg-green-800/50',
                'POST': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/50',
                'PUT': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-800/50',
                'DELETE': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-600 hover:bg-red-200 dark:hover:bg-red-800/50'
            };
            return styles[method] || styles['DELETE'];
        };


        const getStepStyles = (step: number) => {
            const styles = {
                0: "bg-green-500",
                1: "bg-blue-500",
                2: "bg-yellow-500",
                3: "bg-purple-500",
                4: "bg-red-500"
            };
            return styles[step] || styles[4];
        };

        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            ElMessage.success('已复制到剪贴板');
        };

        const handleCopy = (type: 'preprocessing' | 'postprocessing') => {
            const rowData = type === 'preprocessing' ? preprocessingEditForm : postprocessingEditForm;
            navigator.clipboard.writeText(rowData.value.logic);
            ElMessage.success(`复制${type === 'preprocessing' ? '预处理' : '后处理'}函数成功`);
        };

        const handleFullPage = (type: 'preprocessing' | 'postprocessing') => {
            ElMessage.success(`全屏${type === 'preprocessing' ? '预处理' : '后处理'}函数`);
        };

        const handleFold = (type: 'preprocessing' | 'postprocessing', isFold: boolean) => {
            // First collapse the other editors
            isShowPreprocessingEditor.value = false;
            isShowPostprocessingEditor.value = false;
            isShowExcuteResultEditor.value = false;

            const editorMap = {
                'preprocessing': isShowPreprocessingEditor,
                'postprocessing': isShowPostprocessingEditor,
                'excuteResult': isShowExcuteResultEditor
            };
            editorMap[type].value = !isFold;
        };

        const handleRun = (type: 'preprocessing' | 'postprocessing' | 'excuteResult') => {
            if (type !== 'excuteResult') return;
            loading.value = true;
            ElMessage.success('运行成功');
        };

        const handleSave = (type: 'preprocessing' | 'postprocessing' | 'excuteResult') => {
            if (type === 'excuteResult') return;

            const editorRef = type === 'preprocessing' ? preprocessingEditorRef : postprocessingEditorRef;
            const content = editorRef.value?.getContentValue();


            const formData = type === 'preprocessing' ? preprocessingEditForm : postprocessingEditForm;
            const hookType = type === 'preprocessing' ? 1 : 2;
            const apiCall = !formData.value.id ?
                APIs._APIModuleAddHook({
                    apiId: APIInfo.value.id,
                    hookType,
                    logic: content,
                    name: `api_${type}_${APIInfo.value.id}`,
                    description: `适用于${APIInfo.value.id}接口的${type === 'preprocessing' ? '预处理' : '后处理'}脚本`,
                }) :
                APIs._UpdateAPIModuleHook({
                    id: formData.value.id,
                    data: {
                        name: formData.value.name,
                        logic: content,
                        description: formData.value.description,
                        type: hookType,
                    }
                });

            apiCall.then((res: any) => {
                if (res.code === 200) {
                    ElMessage.success(`保存${type === 'preprocessing' ? '预处理' : '后处理'}函数成功`);
                }
            });

        };

        // 抽象处理函数编辑器组件
        const ProcessingEditor = ({ type, loading, func, editorRef, isShow }) => (
            <div class={cn(
                "transition-all duration-500 ease-in-out",
                isShow ? "w-full" : "w-10"
            )}>
                {/* <div class={cn("text-lg font-semibold mb-4")}>{type}</div> */}
                <div class={cn(
                    `relative w-full min-h-[${MIN_HEIGHT_PREPROCESSING_EDITOR}px]`,
                    "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
                    "shadow-sm hover:shadow-md",
                    "transition-shadow duration-300",
                )}>
                    {/* loading 动画 */}
                    <div class={cn(
                        "absolute",
                        "bg-white dark:bg-gray-900",
                        "flex items-center justify-center",
                        "w-full h-50",
                        "transition-all duration-500 ease-in-out",
                        loading.value ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    )}>
                        <div class={cn(
                            "animate-spin rounded-full",
                            "h-8 w-8",
                            "border-b-2 border-blue-500",
                            "transition-all duration-500",
                            loading.value ? "opacity-100 rotate-0" : "opacity-0 rotate-180"
                        )}></div>
                    </div>
                    {/* 编辑器 */}
                    <div class={cn("flex flex-wrap gap-3 w-full h-full")}>
                        {!loading.value && (
                            <editorFuncBox
                                name={type}
                                paramString={type === 'excuteResult' ? '' : 'params, utils, plugin'}
                                isShowCopy={true}
                                isShowFullPage={true}
                                isShowFold={true}
                                isShowRun={type === 'excuteResult'}
                                class={cn(
                                    `w-full min-h-[${MIN_HEIGHT_PREPROCESSING_EDITOR}px] rounded-lg overflow-hidden`,
                                    "border border-gray-200 dark:border-gray-700",
                                    "shadow-sm hover:shadow-md",
                                    "transition-shadow duration-300",
                                    "relative",
                                    isShow ? "before:absolute before:inset-0" : "",
                                    isShow ? "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" : "",
                                    isShow ? "after:absolute after:inset-0" : "",
                                    isShow ? "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent" : "",
                                    isShow ? "before:-translate-x-full hover:before:translate-x-full" : "",
                                    isShow ? "before:transition-transform before:duration-[2s] before:ease-in-out" : "",
                                    isShow ? "after:-translate-x-full hover:after:translate-x-full" : "",
                                    isShow ? "after:transition-transform after:duration-[2s] after:ease-in-out after:delay-500" : "",
                                )}
                                isFold={!isShow}
                                onOnCopy={() => handleCopy(type)}
                                onOnFullPage={() => handleFullPage(type)}
                                onOnFold={(isFold: boolean) => handleFold(type, isFold)}
                                onOnRun={() => handleRun(type)}
                                height={MIN_HEIGHT_PREPROCESSING_EDITOR}
                            >
                                <MonacoEditor
                                    ref={editorRef}
                                    initialValue={func}
                                    initialLanguage="javascript"
                                    className={cn(
                                        `b${type}Editor`,
                                        "bg-gray-50 dark:bg-black",
                                    )}
                                    style={{ height: MIN_HEIGHT_PREPROCESSING_EDITOR + 'px' }}
                                    onKeydown={(e) => {
                                        // 检测 Ctrl+S 或 Command+S
                                        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                                            e.preventDefault();
                                            handleSave(type);
                                        }
                                    }}
                                    readOnly={type === 'excuteResult'}
                                />
                            </editorFuncBox>
                        )}
                    </div>
                </div>
            </div>
        );

        onMounted(() => {
            APIs._APIInfo({ id: route.query.id as string }).then((res: any) => {
                if (res.code === 200) {
                    APIInfo.value = res.data;
                }
            }).finally(() => {
                setTimeout(() => {
                    loading.value = false;
                }, 300);
            });

            APIs._GetAPIModuleHook({ apiId: route.query.id as string, hookType: 1 }).then((res: any) => {
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        preprocessingEditForm.value = res.data[0];
                    } else {
                        preprocessingEditForm.value = deepClone(defaultPrePostprocessingForm);
                    }
                }
            }).finally(() => {
                setTimeout(() => {
                    preprocessingLoading.value = false;
                }, 1000);
            });

            APIs._GetAPIModuleHook({ apiId: route.query.id as string, hookType: 2 }).then((res: any) => {
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        postprocessingEditForm.value = res.data[0];
                    } else {
                        postprocessingEditForm.value = deepClone(defaultPrePostprocessingForm);
                    }
                }
            }).finally(() => {
                setTimeout(() => {
                    postprocessingLoading.value = false;
                }, 1000);
            });

            APIs._APIModuleBindRequest({ apiModuleId: route.query.id as string }).then((res: any) => {
                if (res.code === 200) {
                    APIHeaders.value = JSON.parse(res.data.headerSchema);
                }   
            });
        });

        return () => (
            <div class={cn("text-gray-900 dark:text-gray-100 relative h-screen w-full")}>
                {/* API Info */}
                <div class={cn("p-4")}>
                    <div class={cn("text-2xl font-bold")}>{APIInfo.value?.name}</div>
                    <div class={cn("text-gray-600 dark:text-gray-400 mt-1 text-sm")}>{APIInfo.value?.description}</div>
                    <div class={cn("flex items-center space-x-2 mt-2")}>
                        <div class={cn(
                            getMethodStyles(API_METHOD[APIInfo.value?.method]),
                            "rounded-[4px]",
                            "py-1 px-2",
                            "cursor-pointer select-none inline-block",
                            "text-gray-600 dark:text-slate-50",
                            "font-[600]",
                            "transition-colors duration-300"
                        )}>{API_METHOD[APIInfo.value?.method]}</div>
                        <div class={cn(
                            "text-gray-600 dark:text-slate-50",
                            "cursor-pointer relative group"
                        )} onClick={() => copyToClipboard(`/visix/api/${APIInfo.value?.path}/${route.query.id}`)}>
                            <div>/visix/api/{APIInfo.value?.path}/{route.query.id}</div>
                            <div class={cn(
                                "absolute -bottom-1.5 left-0 w-0 h-[2px]",
                                "animate-pulse",
                                "group-hover:w-full",
                                "transition-all duration-300",
                                "ease-[cubic-bezier(0.4,0,0.2,1)]",
                                "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
                                "bg-[length:100%_auto]",
                                "animate-gradient"
                            )}></div>
                        </div>
                        <div class={cn("flex items-center gap-2 text-gray-600 dark:text-slate-50 text-sm")}>
                            <div class={cn(
                                "w-2 h-2 rounded-full",
                                getStepStyles(APIInfo.value.step)
                            )}></div>
                            {API_STEP[APIInfo.value.step]}
                        </div>
                    </div>

                    <div class={cn("flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400")}>
                        <div class={cn("flex items-center gap-2")}>
                            <span>createdAt:</span>
                            <span>{new Date(APIInfo.value?.createdAt).toLocaleString()}</span>
                        </div>
                        <div class={cn("flex items-center gap-2")}>
                            <span>updatedAt:</span>
                            <span>{new Date(APIInfo.value?.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* 请求头和参数切换部分 */}
                    <div class={cn("mt-8")}>
                        <div class={cn("flex border-b border-gray-200 dark:border-gray-700")}>
                            {['headers', 'params', 'Processing Function'].map(tab => (
                                <div
                                    class={cn(
                                        "px-4 py-2 cursor-pointer",
                                        "border-b-2 transition-colors duration-300",
                                        activeTab.value === tab
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent hover:border-gray-300"
                                    )}
                                    onClick={() => activeTab.value = tab}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </div>
                            ))}
                        </div>

                        <div>
                            {activeTab.value === 'headers' && (
                                <div class={cn("p-4")}>
                                    <div class={cn("text-lg font-bold")}>
                                        <APIHeader
                                            headers={APIHeaders.value}
                                            on
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab.value === 'params' && (
                                <div class={cn("p-4")}>
                                    <div class={cn("text-lg font-bold")}>Request Params Content</div>
                                </div>
                            )}
                            {activeTab.value === 'Processing Function' && (
                                <div class={cn("p-4")}>
                                    {/* <div class={cn("text-lg font-bold")}>Processing Function Content</div> */}
                                    {/* 前后置函数部分 */}
                                    <div class={cn("flex gap-4")}>
                                        {/* 前置函数 */}
                                        <ProcessingEditor
                                            type="preprocessing"
                                            editorRef={preprocessingEditorRef}
                                            loading={preprocessingLoading}
                                            func={preprocessingEditForm.value.logic}
                                            isShow={isShowPreprocessingEditor.value}
                                        />

                                        {/* 后置函数 */}
                                        <ProcessingEditor
                                            type="postprocessing"
                                            editorRef={postprocessingEditorRef}
                                            loading={postprocessingLoading}
                                            func={postprocessingEditForm.value.logic}
                                            isShow={isShowPostprocessingEditor.value}
                                        />

                                        {/* 结果预览 */}
                                        <ProcessingEditor
                                            type="excuteResult"
                                            editorRef={excuteResultEditorRef}
                                            loading={postprocessingLoading}
                                            func={excuteResultEditForm.value}
                                            isShow={isShowExcuteResultEditor.value}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>




                </div>

                {/* Loading */}
                <div class={cn(
                    "fixed",
                    `w-[calc(100%-${LEFT_SIDEBAR_WIDTH}px)]`,
                    "inset-0",
                    "bg-white dark:bg-gray-900",
                    "px-4 lg:pr-4 lg:m-2",
                    "lg:rounded-lg lg:shadow-sm",
                    "flex items-center justify-center",
                    "transition-opacity duration-300",
                    loading.value ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <div class={cn(
                        "animate-spin rounded-full",
                        "h-8 w-8",
                        "border-b-2 border-blue-500"
                    )}></div>
                </div>
            </div>
        );
    }
});
