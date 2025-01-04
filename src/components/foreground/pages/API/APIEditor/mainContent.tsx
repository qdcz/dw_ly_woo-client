import { computed, ComputedRef, defineComponent, onMounted, provide, Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

import { cn, convertBooleanNumber, convertMonacoValue, deepClone, encryptAES, generateUuid } from '@/utils/index';
import { LEFT_SIDEBAR_WIDTH, MIN_HEIGHT_PREPROCESSING_EDITOR, API_METHOD, API_STEP } from '@/constants';

import { ElMessage } from 'element-plus';
import MonacoEditor from '@/components/monaco.vue';
import editorFuncBox from '@/components/editor-func-box/index.jsx';
import Switch from '@/components/foreground/form/Switch';
import Select from '@/components/foreground/form/Select';
import Tab from '@/components/foreground/other/tab'
import ComfirmButton from '@/components/foreground/form/ComfirmButton';
import ComfirmDialog from '@/components/foreground/dialog/confirm';
import codePopupFullScreen from '@/components/foreground/dialog/codePopupFullScreen';

import RefreshIcon from '@/components/foreground/icon/Refresh';

import { ApiStore } from '@/store';

import APIs from '@/components/foreground/pages/API/APIs';
import APIHeader from './APIHeader';
import APIBody from './APIBody';
import DataUnit from './DataUnit';
import Input from '@/components/foreground/form/Input';


const defaultPrePostprocessingForm = {
    id: '',
    name: '',
    params: '',
    logic: '',
    description: '',
}

const API_STEP_OPTIONS = Object.keys(API_STEP).map((key) => ({
    label: API_STEP[key],
    value: Number(key)
}));

const tempApiKeyExpirationTimeOptions = new Array(60).fill(0).map((i, index) => {
    return {
        label: `${index + 1}分钟`,
        value: (index + 1) * 1000 * 60
    }
});
tempApiKeyExpirationTimeOptions.push({
    label: `100年`,
    value: 1000 * 60 * 60 * 24 * 31 * 12 * 100
})



export default defineComponent({
    name: "mainContent",
    components: {
        MonacoEditor,
        editorFuncBox,
        APIHeader,
        APIBody,
        DataUnit,
        Switch,
        Select,
        Tab,
        ComfirmDialog,
        codePopupFullScreen,
        RefreshIcon
    },
    setup(props) {
        const route = useRoute();
        const loading = ref<boolean>(true);
        const preprocessingLoading = ref<boolean>(true);
        const postprocessingLoading = ref<boolean>(true);
        const preprocessingEditForm = ref(deepClone(defaultPrePostprocessingForm));
        const postprocessingEditForm = ref(deepClone(defaultPrePostprocessingForm));
        const excuteResultEditForm = ref<string | null>(null);
        const isOpenProcessingFunctionLog = ref<boolean>(false);
        const isOpenAuthentication = ref<boolean>(false);
        const isOpenDeleteAPIDialog = ref<boolean>(false);
        const isShowCodePopupFullScreen = ref<boolean>(false);
        const codePopupMonacoCode = ref<string | null>(null);
        const codePopupMonacoType = ref<string>('');
        const tempApiKey = ref("");
        const tempApiKeyExpirationTime = ref<number | null>(1000 * 60);
        const apiStore = ApiStore();
        const tabList = [
            { id: "headers", name: "Headers" },
            { id: "params", name: "Params" },
            { id: "dataUnit", name: "Data Unit" },
            { id: "processingFunction", name: "Processing Function" },
            { id: "setting", name: "Setting" },
        ]
        const messageContentMap = {
            preprocessing: 'preprocessing',
            postprocessing: 'postprocessing',
            excuteResult: 'excuteResult',
        };
        /**
         * component ref
         */
        const preprocessingEditorRef: any = ref(null);
        const postprocessingEditorRef: any = ref(null);
        const excuteResultEditorRef: any = ref(null);

        const activeTab = ref('headers');

        /**
         * API response data
         */
        const APIInfo: any = ref({});
        // api请求体信息  包含headerSchema 和 bodySchema
        const APIRequestHeaderInfo = ref<Array<any>>([]);
        const APIRequestBodyInfo = ref<Array<any>>([]);
        const APIRequestBodyId = ref<string>("");
        const projectInfo = ref<any>(null);


        /**
         * component show status
         */
        const isShowPreprocessingEditor = ref(false);
        const isShowPostprocessingEditor = ref(false);
        const isShowExcuteResultEditor = ref(true);


        // provide
        provide('APIEditorPage_EnableLoading', {
            changeLoading: (val: boolean) => {
                loading.value = val;
            }
        });

        const getMethodStyles = (method: string) => {
            const styles = {
                'GET': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-600 hover:bg-green-200 dark:hover:bg-green-800/50',
                'POST': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800/50',
                'PUT': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-800/50',
                'DELETE': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-600 hover:bg-red-200 dark:hover:bg-red-800/50'
            };
            return styles[method] || styles['DELETE'];
        };

        const stepColor: ComputedRef<string> = computed(() => getStepStyles(APIInfo.value.step));
        const getStepStyles = (step: number) => {
            const styles = {
                1: "bg-blue-500",
                2: "bg-green-500",
                3: "bg-yellow-500",
                4: "bg-purple-500",
                5: "bg-red-500"
            };
            return styles[step] || styles[5];
        };

        const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
            ElMessage.success('Copied to clipboard');
        };

        const paramsDataChange = async (type: string, val: any, enableHaderRealTimeSync: Ref<boolean>) => {
            type == 'headers' ? APIRequestHeaderInfo.value = val : "";
            type == 'bodys' ? APIRequestBodyInfo.value = val : "";

            if (enableHaderRealTimeSync.value) {
                const schemas = {
                    headerSchema: JSON.stringify(
                        (APIRequestHeaderInfo.value || []).map(
                            (rowData) => {
                                return {
                                    id: rowData[0].id || generateUuid(),
                                    info: rowData[2].value,
                                    key: rowData[0].value,
                                    status: 0,
                                    value: rowData[1].value,
                                };
                            }
                        )
                    ),
                    bodySchema: JSON.stringify(
                        (APIRequestBodyInfo.value || []).map((rowData) => {
                            return {
                                id: rowData[0].id || generateUuid(),
                                type: rowData[1].value,
                                required: rowData[2].value,
                                info: rowData[4].value,
                                key: rowData[0].value,
                                status: 0,
                                value: rowData[3].value,
                            };
                        })
                    ),
                    querySchema: "[]",
                };

                if (APIRequestBodyId.value) { // 更新
                    await APIs._UpdateAPIModuleRequest({
                        APIRequestId: APIRequestBodyId.value,
                        schemas
                    });
                } else { // 新增
                    APIs._AddAPIModuleRequest({
                        apiModuleId: route.query.id,
                        ...schemas
                    }).then(() => {
                        getAPIRequest();
                    })
                }
                ElMessage.success('Automatic update successful');
            }
        }

        const handleCopy = (type: 'preprocessing' | 'postprocessing' | 'excuteResult') => {
            const rowDataMap = {
                preprocessing: preprocessingEditForm.value.logic,
                postprocessing: postprocessingEditForm.value.logic,
                excuteResult: excuteResultEditForm.value,
            };
            const logic = rowDataMap[type];
            navigator.clipboard.writeText(logic);
            ElMessage.success(`Copy successful ${messageContentMap[type]} function`);
        };

        const handleFullPage = (type: 'preprocessing' | 'postprocessing' | 'excuteResult') => {
            // ElMessage.success(`FullPage successful ${messageContentMap[type]} function`);
            const rowDataMap = {
                preprocessing: preprocessingEditForm.value.logic,
                postprocessing: postprocessingEditForm.value.logic,
                excuteResult: excuteResultEditForm.value,
            };
            codePopupMonacoCode.value = rowDataMap[type];
            codePopupMonacoType.value = type;
            isShowCodePopupFullScreen.value = true
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

        const handleRun = async (type: 'preprocessing' | 'postprocessing' | 'excuteResult') => {
            if (type !== 'excuteResult') return;
            try {
                loading.value = true;
                const eName = projectInfo.value?.eName;
                const params = {};
                const headers = {};
                if (isOpenProcessingFunctionLog.value) {
                    headers['X-Woo-Processing-Log'] = true;
                    // params['___hooklogger'] = true;
                }
                if (APIRequestHeaderInfo.value) {
                    APIRequestHeaderInfo.value.forEach((rowData) => {
                        headers[rowData[0].value] = rowData[1].value;
                    });
                }
                if (APIRequestBodyInfo.value) {
                    APIRequestBodyInfo.value.forEach((rowData) => {
                        params[rowData[0].value] = convertBooleanNumber(rowData[3].value);
                    });
                }
                const response: any = await APIs._APIExecutePreview(eName, APIInfo.value.id, params, headers);
                if (response.code === 200) {
                    const result = convertMonacoValue(response.data);
                    excuteResultEditForm.value = result.content;
                    apiStore.changeLoggerData(result.logger);
                }
                ElMessage.success('Run successful');
            } catch (e) {
                console.error("Failed to run", e);
            } finally {
                loading.value = false;
            }
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
                    ElMessage.success(`Save ${type === 'preprocessing' ? 'preprocessing' : 'postprocessing'} function successfully`);
                    getProcessingFunction(type);
                }
            });

        };

        const handleDelete = () => {
            isOpenDeleteAPIDialog.value = false;
            APIs._DeleteAPIModule(APIInfo.value.id).then((res: any) => {
                if (res.code === 200) {
                    ElMessage.success('Deleted successfully');
                    router.back();
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
                                paramString={type === 'excuteResult' ? '' : (
                                    type === 'preprocessing' ? 'params, utils, plugin' : 'data, params, utils, plugin'
                                )}
                                isShowCopy={true}
                                isShowFullPage={true}
                                isShowFold={true}
                                isShowRun={type === 'excuteResult'}
                                bottomTip={type !== 'excuteResult' ? 'Hold 【ctrl + s】 to save' : ''}
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

        const getAPIRequest = async () => {
            const APIModuleBindRequestResult = await APIs._APIModuleBindRequest({ apiModuleId: route.query.id as string }) as {
                headerSchema: Array<any>;
                querySchema: Array<any>;
                bodySchema: Array<any>;
                id: string
            };
            APIRequestHeaderInfo.value = APIModuleBindRequestResult.headerSchema;
            APIRequestBodyInfo.value = APIModuleBindRequestResult.bodySchema;
            APIRequestBodyId.value = APIModuleBindRequestResult.id
        }

        const getProjectInfo = async () => {
            const response: any = await APIs._GetProjectInfo(APIInfo.value.projectId);
            if (response.code === 200) {
                projectInfo.value = response.data;
            }
        }

        // 获取前后处理函数
        const getProcessingFunction = async (type: 'preprocessing' | 'postprocessing') => {
            const hookType = type === 'preprocessing' ? 1 : 2;
            APIs._GetAPIModuleHook({ apiId: route.query.id as string, hookType }).then((res: any) => {
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        hookType === 1 ?
                            preprocessingEditForm.value = res.data[0] :
                            postprocessingEditForm.value = res.data[0];
                    } else {
                        hookType === 1 ?
                            preprocessingEditForm.value = deepClone(defaultPrePostprocessingForm) :
                            postprocessingEditForm.value = deepClone(defaultPrePostprocessingForm);
                    }
                }
            }).finally(() => {
                setTimeout(() => {
                    hookType === 1 ?
                        preprocessingLoading.value = false :
                        postprocessingLoading.value = false;
                }, 1000);
            });
        }

        const handleUpdateTempApiKey = () => {
            const apiId = route.query.id as string;
            const expireTime = new Date(new Date().getTime() + Number(tempApiKeyExpirationTime.value)).getTime().toString();
            const encryptTimestamp = encryptAES(`${apiId}WOO${expireTime}`);
            tempApiKey.value = encryptTimestamp;
        }

        onMounted(() => {
            APIs._APIInfo({ id: route.query.id as string }).then((res: any) => {
                if (res.code === 200) {
                    APIInfo.value = res.data;
                }
            }).finally(() => {
                getProjectInfo();
                getAPIRequest();
                setTimeout(() => {
                    loading.value = false;
                }, 300);
            });
            getProcessingFunction('preprocessing');
            getProcessingFunction('postprocessing');



            activeTab.value = 'headers';
        });

        return () => (
            <>
                {/* 删除弹窗部分 */}
                <ComfirmDialog ref="deleteDialogRef" title="Danger" message="Are you sure you want to delete this API?"
                    isOpen={isOpenDeleteAPIDialog.value}
                    onCancel={() => isOpenDeleteAPIDialog.value = false}
                    onConfirm={handleDelete}
                />
                {/* 全屏编辑器部分 */}
                <codePopupFullScreen
                    code={codePopupMonacoCode.value}
                    type={codePopupMonacoType.value}
                    isOpen={isShowCodePopupFullScreen.value}
                    onClose={() => isShowCodePopupFullScreen.value = false}
                />
                <div class={cn("text-gray-900 dark:text-gray-100 relative h-screen w-full")}>
                    {/* API Info */}
                    <div class={cn("p-4")}>
                        <div class={cn("flex items-center justify-between")}>
                            <div class={cn("text-2xl font-bold")}>{APIInfo.value?.name}({APIInfo.value?.path})</div>
                            <div>
                                <ComfirmButton text="Run" class="mr-4" onClick={() => {
                                    activeTab.value = 'processingFunction';
                                    handleRun('excuteResult');
                                }}></ComfirmButton>
                                <ComfirmButton text="Delete" onClick={() => isOpenDeleteAPIDialog.value = true}></ComfirmButton>
                            </div>
                        </div>
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
                            )} onClick={() => copyToClipboard(`/visix/api/${projectInfo.value?.eName}/${route.query.id}`)}>
                                <div>/visix/api/{projectInfo.value?.eName}/{route.query.id}</div>
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
                            <div class={cn("flex items-center  text-gray-600 dark:text-slate-50 text-sm")}>
                                <div class={cn(
                                    "w-2 h-2 rounded-full",
                                    stepColor.value
                                )}></div>
                                <Select bordered={false} focusBordered={false} options={API_STEP_OPTIONS} modelValue={APIInfo.value.step} onUpdate:modelValue={(val) => {
                                    APIInfo.value.step = val;
                                    APIs._UpdateAPIModuleStep({ id: route.query.id as string, step: val * 1 }).then((res: any) => {
                                        if (res.code === 200) {
                                            ElMessage.success(`Step changed to ${API_STEP[val]}`);
                                        }
                                    });
                                }}></Select>
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

                        {/* 请求头、参数、数据单元、处理函数切换部分 */}
                        <div class={cn("mt-8")}>
                            <Tab options={tabList} active={activeTab} onActive={(id: string) => activeTab.value = id}>
                                {activeTab.value === 'headers' && (
                                    <div class={cn("p-4")}>
                                        <div class={cn("text-lg font-bold")}>
                                            <APIHeader
                                                headers={APIRequestHeaderInfo.value}
                                                onHeaderDataChange={(val: any[], enableHaderRealTimeSync: Ref<boolean>) => {
                                                    paramsDataChange("headers", val, enableHaderRealTimeSync)
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {activeTab.value === 'params' && (
                                    <div class={cn("p-4")}>
                                        <div class={cn("text-lg font-bold")}>
                                            <APIBody
                                                params={APIRequestBodyInfo.value}
                                                onParamsChange={(val: any[], enableHaderRealTimeSync: Ref<boolean>) => {
                                                    paramsDataChange("bodys", val, enableHaderRealTimeSync)
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {activeTab.value === 'dataUnit' && (
                                    <div class={cn("p-4")}>
                                        <div class={cn("text-lg font-bold")}>
                                            <DataUnit />
                                        </div>
                                    </div>
                                )}
                                {activeTab.value === 'processingFunction' && (
                                    <div class={cn("p-4")}>
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
                                {activeTab.value === 'setting' && (
                                    <div class={cn("p-4 select-none")}>
                                        <div class={cn("text-lg font-bold")}>
                                            <div class={cn("flex items-center pb-4")}>
                                                <span class={cn("text-base font-bold mr-2")}>Enable Logging for Processing Function</span>
                                                <Switch
                                                    modelValue={isOpenProcessingFunctionLog.value}
                                                    onUpdate:modelValue={(value: boolean) => isOpenProcessingFunctionLog.value = value}
                                                />
                                            </div>
                                            <div class={cn("flex items-center pb-4")}>
                                                <span class={cn("text-base font-bold mr-2")}>Temporary Authentication-Free Call</span>
                                                <Switch
                                                    modelValue={isOpenAuthentication.value}
                                                    onUpdate:modelValue={(value: boolean) => isOpenAuthentication.value = value}
                                                />
                                            </div>
                                            {
                                                isOpenAuthentication.value && (
                                                    <div class={cn("p-2")}>
                                                        <div class={cn("flex items-center pb-4")}>
                                                            <span class={cn("text-base font-bold mr-4 text-nowrap")}>How to use?</span>
                                                            <span class={cn("text-sm text-gray-500 text-nowrap")}>visix/api/xxx/xxx?apiId=Temporary API Key</span>
                                                        </div>
                                                        <div class={cn("flex items-center")}>
                                                            <span class={cn("text-base font-bold mr-2 text-nowrap")}>Expiration time</span>
                                                            <div class={cn("w-40")}>
                                                                <Select placeholder="select expiration time"
                                                                    options={tempApiKeyExpirationTimeOptions} modelValue={tempApiKeyExpirationTime.value}
                                                                    onUpdate:modelValue={(val) => {
                                                                        tempApiKeyExpirationTime.value = val;
                                                                        handleUpdateTempApiKey();
                                                                    }}></Select>
                                                            </div>
                                                        </div>
                                                        <div class={cn("flex items-center")}>
                                                            <span class={cn("text-base font-bold mr-2 text-nowrap")}>Temporary API Key</span>
                                                            <Input
                                                                class={cn("mr-2")}
                                                                disabled
                                                                bordered
                                                                placeholder="Click the update button to get a temporary API Key"
                                                                modelValue={tempApiKey.value}
                                                            />
                                                            <RefreshIcon height="2.5" width="2.5" onClick={handleUpdateTempApiKey} />
                                                        </div>

                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )}
                            </Tab>
                        </div>


                    </div>

                    {/* Loading */}
                    <div style={{ left: `${LEFT_SIDEBAR_WIDTH}px` }} class={cn(
                        "fixed",
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
                </div >
            </>
        );
    }
});
